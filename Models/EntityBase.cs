using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quilti.Models
{
    public class EntityBase
    {
        public DateTimeOffset? CreatedDate { get; set; }
        public DateTimeOffset? LastModifiedDate { get; set; }
        public string ObjectStatus { get; set; }
    }

    public static class ObjectStatus
    {
        public const string Active = "ACT";
        public const string Reserved = "RES";
        public const string SoftDeleted = "SOFTDEL"; // Still accessible in all db request
        public const string Deleted = "DEL"; // Filtered out from all db request
    }
}
