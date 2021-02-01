using Quilti.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quilti.Dtos
{
    // Dont think we'll be actually using this one, just for the POC
    public class PatchRequest
    {
        public string ImageMini { get; set; }
        public string Image { get; set; }
    }

    public class PatchGetRequestDto
    {
        public string PatchId { get; set; }
        public int X { get; set; }
        public int Y { get; set; }

        public string ImageMini { get; set; }
        public string ObjectStatus { get; set; }

        public PatchGetRequestDto(Patch patch)
        {
            this.PatchId = patch.PatchId;
            this.X = patch.X;
            this.Y = patch.Y;
            this.ImageMini = patch.ImageMini;
            this.ObjectStatus = patch.ObjectStatus;
        }
    }

    public class PatchPostReserveDto
    {
        //public int? NorthPatchId { get; set; }
        //public int? SouthPatchId { get; set; }
        //public int? EastPatchId { get; set; }
        //public int? WestPatchId { get; set; }

    }
}
