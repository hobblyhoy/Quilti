using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Quilti.DAL;
using Quilti.Dtos;
using Quilti.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Quilti.Managers
{
    public static class PatchManager
    {
        // We start from the origin patch (0x0) iteraritng out a ring of patches at a time until we find an empty patch
        // We return the patch which neighbors it as our starting seed patch for the front end
        public static Patch GetNextAvailablePatch(QuiltiContext context, IMemoryCache cache)
        {
            // Pull out the last ringNumber used (or fall back to starting at 0)
            var cacheKey = "lastRingNumber";
            cache.TryGetValue(cacheKey, out int ringNumber);

            Patch returnPatch = null;
            bool lastPatchFound = false;
            while (!lastPatchFound)
            {
                var currentRingPatches = context.Patches
                    .Where(
                        p => (
                            (Math.Abs(p.X) == ringNumber || Math.Abs(p.Y) == ringNumber)
                            && (Math.Abs(p.X) <= ringNumber && Math.Abs(p.Y) <= ringNumber)
                        )
                    )
                    .ToList();

                // Each ring has more patches in it than the one before, do the math on how many patches this particular ring should have
                // 0 - 1    // 1 - (3x3) - (1x1)    // 2 - (5x5) - (3x3)    // n - (2*n+1)^2 - (2*n-1)^2
                var fullRingCount = (ringNumber == 0) ? 1 : Math.Pow(2 * ringNumber + 1, 2) - Math.Pow(2 * ringNumber - 1, 2);

                if (currentRingPatches.Count == fullRingCount)
                {
                    // Our current ring is full, set the returnPatch now in case the next ring is empty
                    returnPatch = currentRingPatches.First();
                    ringNumber++;
                }
                else if (currentRingPatches.Count == 0)
                {
                    // Our current ring is empty, just get out now and we'll return with the first patch from the previous ring
                    lastPatchFound = true;
                }
                else
                {
                    // Generate a list of all the potential patch Ids (filled or not) that exist in this ring
                    // It's important we generate these in this particular order so that any given item is a geometric neighbor
                    // to the one before and after
                    var potentialPatchIds = new List<string>();
                    var ringRange = Enumerable.Range(ringNumber * -1, ringNumber * 2 + 1);

                    // Top row
                    foreach (var i in ringRange)
                    {
                        var j = ringRange.Last();
                        potentialPatchIds.Add(i + "x" + j);
                    }

                    // Right column
                    foreach (var j in ringRange.Reverse())
                    {
                        var i = ringRange.Last();
                        potentialPatchIds.Add(i + "x" + j);
                    }
                    // Bottom row
                    foreach (var i in ringRange.Reverse())
                    {
                        var j = ringRange.First();
                        potentialPatchIds.Add(i + "x" + j);
                    }
                    // Left Column
                    foreach (var j in ringRange)
                    {
                        var i = ringRange.First();
                        potentialPatchIds.Add(i + "x" + j);
                    }

                    potentialPatchIds = potentialPatchIds.Distinct().ToList();


                    // Iterate through the potential patch Ids and find the missing one, returning the patch before it
                    // Making sure we've encountered at least one Patch in this ring first so we're not returning anything
                    // on the previous ring
                    var haveEncounteredPatch = false;
                    foreach (var patchId in potentialPatchIds)
                    {
                        var nextInList = currentRingPatches.FirstOrDefault(p => p.PatchId == patchId);
                        if (nextInList == null && haveEncounteredPatch)
                        {
                            break;
                        }
                        else if (nextInList != null)
                        {
                            returnPatch = nextInList;
                            haveEncounteredPatch = true;
                        }
                    }

                    lastPatchFound = true;
                }
            }

            cache.Set(cacheKey, ringNumber, TimeSpan.FromDays(7));

            return returnPatch;
        }

        public static async Task DeletePatch(QuiltiContext context, IMemoryCache cache, string patchId)
        {
            var patchImage = context.PatchImages.FirstOrDefault(p => p.PatchId == patchId);
            context.PatchImages.Remove(patchImage);

            var patch = context.Patches.FirstOrDefault(p => p.PatchId == patchId);
            context.Patches.Remove(patch);

            await context.SaveChangesAsync();

            cache.Remove($"Patch_{patch.PatchId}");
        }

        public static Patch GetPatch(QuiltiContext context, IMemoryCache cache, string patchId)
        {
            var patch = cache.GetOrCreate($"Patch_{patchId}", entry =>
            {
                entry.SlidingExpiration = TimeSpan.FromDays(1);
                return context.Patches.AsNoTracking().First(p => p.PatchId == patchId);
            });
            return patch;
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

        public static async Task<string> CompletePatch(QuiltiContext context, IMemoryCache cache, string patchId, string imageMini, string image)
        {
            var patch = context.Patches.First(x => x.PatchId == patchId);
            // Patch Image
            var patchImage = new PatchImage()
            {
                PatchId = patch.PatchId,
                Image = image
            };
            context.PatchImages.Add(patchImage);

            // Patch
            patch.ImageMini = imageMini;
            patch.ObjectStatus = ObjectStatus.Active;
            await context.SaveChangesAsync();

            // Return
            cache.Remove($"Patch_{patch.PatchId}");
            return patch.PatchId;
        }

        public static async Task ClearOutOldReservedPatches(QuiltiContext context, IMemoryCache cache)
        {
            var oneHourAgo = DateTimeOffset.Now.AddHours(-1);
            var patchesToClear = context.Patches.Where(p => p.ObjectStatus == ObjectStatus.Reserved && p.LastModifiedDate < oneHourAgo).ToList();
            context.Patches.RemoveRange(patchesToClear);
            await context.SaveChangesAsync();

            foreach (var patch in patchesToClear)
            {
                cache.Remove($"Patch_{patch.PatchId}");
            }
        }

        public static bool PatchMatchesCreator(QuiltiContext context, IMemoryCache cache, string patchId, string creatorIp)
        {
            var patch = GetPatch(context, cache, patchId);
            return patch.CreatorIp == creatorIp;
        }

    }
}
