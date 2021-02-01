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

        public static Patch ReservePatch(QuiltiContext context, IMemoryCache cache, PatchPostReserveDto patchPostReserveDto)
        {
            return null;
        }

        public static List<string> GetPatchIdsInRange(QuiltiContext context, int leftX, int rightX, int topY, int bottomY)
        {

            var patches = context.Patches
                    .Where(p => p.X >= leftX && p.X <= rightX && p.Y >= bottomY && p.Y <= topY)
                    .Select(p => p.PatchId)
                    .ToList();
            return patches;
        }
    }
}
