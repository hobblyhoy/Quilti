using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Quilti.DAL;
using Quilti.Dtos;
using Quilti.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Quilti.Managers
{
    public static class PatchManager
    {
        public static Patch GetNextAvailablePatch(QuiltiContext context)
        {
            //STUB
            return context.Patches.First(p => p.ObjectStatus == ObjectStatus.Active);
        }

        public static Patch GetPatch(QuiltiContext context, IMemoryCache cache, string patchId)
        {
            var patch = cache.GetOrCreate($"Patch_{patchId}", entry =>
            {
                entry.SlidingExpiration = TimeSpan.FromDays(1);
                return context.Patches.First(p => p.PatchId == patchId);
            });
            return patch;
        }

        public static bool UserHasHitCreateCap(QuiltiContext context, string creatorIp)
        {
            var oneHourAgo = DateTimeOffset.Now.AddHours(-1);

            var usersRecentPatches = context.Patches.Where(p => p.CreatorIp == creatorIp && p.LastModifiedDate > oneHourAgo).ToList();
            return usersRecentPatches.Count > 4;
        }

        public static bool PatchExists(QuiltiContext context, string patchId)
        {
            var patch = context.Patches.FirstOrDefault(p => p.PatchId == patchId);
            return patch != null;
        }

        public static async Task<string> ReservePatch(QuiltiContext context, string creatorIp, string patchId)
        {
            var coordinates = Helper.PatchIdToCoordinates(patchId);
            var newPatch = new Patch()
            {
                PatchId = patchId,
                X = coordinates.X,
                Y = coordinates.Y,
                CreatorIp = creatorIp,
                ObjectStatus = ObjectStatus.Reserved
            };
            context.Patches.Add(newPatch);
            await context.SaveChangesAsync();
            return newPatch.PatchId;
        }

        public static List<string> GetPatchIdsInRange(QuiltiContext context, int leftX, int rightX, int topY, int bottomY)
        {
            var patches = context.Patches
                    .Where(p => p.X >= leftX && p.X <= rightX && p.Y >= bottomY && p.Y <= topY)
                    .Select(p => p.PatchId)
                    .ToList();
            return patches;
        }

        public static async Task<Patch> CompletePatch(QuiltiContext context, IMemoryCache cache, Patch patch, string imageMini, string image)
        {
            var patchImage = new PatchImage()
            {
                PatchId = patch.PatchId,
                Image = image
            };
            context.PatchImages.Add(patchImage);

            patch.ImageMini = imageMini;
            patch.ObjectStatus = ObjectStatus.Active;

            context.Patches.Update(patch);
            await context.SaveChangesAsync();

            // TODO need to audit for anywhere else we need to clear cache
            cache.Remove($"Patch_{patch.PatchId}");

            return patch;
        }

        public static async Task ClearOutOldReservedPatches(QuiltiContext context, IMemoryCache cache)
        {
            var oneHourAgo = DateTimeOffset.Now.AddHours(-1);
            context.Patches.RemoveRange(context.Patches.Where(p => p.ObjectStatus == ObjectStatus.Reserved && p.LastModifiedDate < oneHourAgo));
            await context.SaveChangesAsync();
        }

    }
}
