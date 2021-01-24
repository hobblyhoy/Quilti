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

        public byte[] Image { get; set; }
    }
}
