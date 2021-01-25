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
        public static Patch GetPatch(QuiltiContext context, int patchId)
        {
            //TODO implement cacheing
            return context.Patches.First(p => p.PatchId == patchId);
        }
    }
}
