using Quilti.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quilti.Dtos
{
    // Naming convention:
    // <Object Name> <Http Method> <"Request" || "Response"> <"Dto">
    public class PatchGetResponseDto
    {
        public string PatchId { get; set; }
        public int X { get; set; }
        public int Y { get; set; }

        public string ImageMini { get; set; }
        public string ObjectStatus { get; set; }

        public PatchGetResponseDto(Patch patch)
        {
            this.PatchId = patch.PatchId;
            this.X = patch.X;
            this.Y = patch.Y;
            this.ImageMini = patch.ImageMini;
            this.ObjectStatus = patch.ObjectStatus;
        }
    }

    public class PatchPatchRequestDto
    {
        public string PatchId { get; set; }
        public string Image { get; set; }
        public string ImageMini { get; set; }

    }
}
