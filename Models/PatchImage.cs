using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Quilti.Models
{
    public class PatchImage
    {
        [Key]
        public int PatchImageId { get; set; }

        public byte[] Image { get; set; }
    }
}
