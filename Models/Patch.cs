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
        public int PatchId { get; set; }

        public virtual Patch NorthPatch { get; set; }
        public virtual Patch SouthPatch { get; set; }
        public virtual Patch EastPatch { get; set; }
        public virtual Patch WestPatch { get; set; }

        public string CreatorIp { get; set; }
        public byte[] ImageMini { get; set; } //POC this soon but implement much later

        public virtual PatchImage PatchImage { get; set; }

    }
}
