using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Quilti.Models
{
    public class PatchImage : EntityBase
    {
        public int PatchImageId { get; set; }


        public virtual Patch Patch { get; set; }

        // technically should be varbinary but based on real world testing theres only slightly more storage usage as a varchar (1.34x)
        // I have plenty of storage- I'm willing to make the tradeoff of taking up more hdd space for a simpler implementation
        public string Image { get; set; }
    }
}
