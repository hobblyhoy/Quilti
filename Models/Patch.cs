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

        public int? NorthPatchId { get; set; }
        public int? SouthPatchId { get; set; }
        public int? EastPatchId { get; set; }
        public int? WestPatchId { get; set; }


        public virtual Patch NorthPatch { get; set; }
        public virtual Patch SouthPatch { get; set; }
        public virtual Patch EastPatch { get; set; }
        public virtual Patch WestPatch { get; set; }

        public string CreatorIp { get; set; }
        public string ImageMini { get; set; }

        public virtual PatchImage PatchImage { get; set; }

    }

    public class PatchWithGridMeta
    {
        public Patch Patch { get; set; }
        public int ColumnIndex { get; set; }
        public int RowIndex { get; set; }
    }
}
