using Microsoft.Extensions.Caching.Memory;
using Quilti.DAL;
using Quilti.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quilti.Managers
{
    public static class PatchManager
    {
        public static Patch GetPatch(QuiltiContext context, IMemoryCache cache, int patchId)
        {
            
            var patch = cache.GetOrCreate($"Patch_{patchId}", entry =>
            {
                entry.SlidingExpiration = TimeSpan.FromDays(1);
                return context.Patches.First(p => p.PatchId == patchId);
            });


            return patch;
        }
    }
}
