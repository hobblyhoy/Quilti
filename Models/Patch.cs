using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Quilti.Models
{
    public class Patch : EntityBase
    {
        [Key]
        public int PatchId { get; set; }

        [ForeignKey("NorthPatchId")]
        public virtual Patch NorthPatch { get; set; }

        [ForeignKey("SouthPatchId")]
        public virtual Patch SouthPatch { get; set; } 
        
        [ForeignKey("EastPatchId")]
        public virtual Patch EastPatch { get; set; }

        [ForeignKey("WestPatchId")]
        public virtual Patch WestPatch { get; set; }

        public string CreatorIp { get; set; }
        //TODO the Image reference
    }
}
