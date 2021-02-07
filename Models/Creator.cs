using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quilti.Models
{
    public class Creator : EntityBase
    {
        public string CreatorIp { get; set; }
        public bool IsBanned { get; set; }
        public bool IsUnrestricted { get; set; }
    }
}
