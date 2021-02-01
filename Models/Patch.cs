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
        public string PatchId { get; set; }

        public int X { get; set; }
        public int Y { get; set; }
        public string CreatorIp { get; set; }
        public string ImageMini { get; set; }

        public virtual PatchImage PatchImage { get; set; }

    }
}
