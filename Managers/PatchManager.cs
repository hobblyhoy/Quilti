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
            return context.Patches.First(p =>
                p.ObjectStatus == ObjectStatus.Active
                && (p.NorthPatchId == null || p.EastPatchId == null || p.SouthPatchId == null || p.WestPatchId == null));
        }

        public static Patch GetPatch(QuiltiContext context, IMemoryCache cache, int patchId)
        {

            var patch = cache.GetOrCreate($"Patch_{patchId}", entry =>
            {
                entry.SlidingExpiration = TimeSpan.FromDays(1);
                return context.Patches.First(p => p.PatchId == patchId);
            });

            //Thread.Sleep(50);
            return patch;
        }

        public static bool UserHasHitCreateCap(QuiltiContext context, string creatorIp)
        {
            var oneHourAgo = DateTimeOffset.Now.AddHours(-1);

            var usersRecentPatches = context.Patches.Where(p => p.CreatorIp == creatorIp && p.LastModifiedDate > oneHourAgo).ToList();
            return usersRecentPatches.Count > 4;
        }

        // We only go until we validate at least one of the directions they gave us is valid, so in the event of intentionally
        // bad/conflicting relative patches everything should continue to work
        public static Patch ReservePatch(QuiltiContext context, IMemoryCache cache, PatchPostReserveDto patchPostReserveDto)
        {

            // Make sure this this location is truly an empty one 
            if (patchPostReserveDto.NorthPatchId != null)
            {
                var southPatch = context.Patches.First(p => p.SouthPatchId == patchPostReserveDto.NorthPatchId);
                if (southPatch == null) throw new ArgumentException();
            }

            //var allNeighbors = context.Patches.Where(
            //            p => p.NorthPatchId == patchPostReserveDto.SouthPatchId
            //            || p.SouthPatchId == patchPostReserveDto.NorthPatchId
            //            || p.EastPatchId == patchPostReserveDto.WestPatchId
            //            || p.WestPatchId == patchPostReserveDto.EastPatchId
            //        );
            // only rely on ONE of the directionals, so that if a user gave us north of 1 and south of 8 (which 
            // would pass the previous check) that we're only going based on teh first one

            // build a new patch in the "reserved" state

            // send the patch back
            return null;
        }
    }
}
