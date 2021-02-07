using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quilti.Managers
{
    public static class Helper
    {
        public static Coordinates PatchIdToCoordinates(string s)
        {
            var split = s.Split('x');
            var ret = new Coordinates
            {
                X = Int32.Parse(split[0]),
                Y = Int32.Parse(split[1])
            };

            return ret;
        }
    }

    public class Coordinates
    {
        public int X { get; set; }
        public int Y { get; set; }
    }
}
