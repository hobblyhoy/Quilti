using Quilti.DAL;
using Quilti.Managers;
using Quilti.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quilti.CustomObjects
{
    public class PatchGrid
    {
        // TODO consider making this private and returning something easier to digest
        public Patch[,] Patches2D { get; private set; }
        private int TotalColumns { get; set; }
        private int TotalRows { get; set; }
        private bool[,] NeighborPatchesFound2D { get; set; }
        private readonly QuiltiContext _context;
        public PatchGrid(QuiltiContext context, int columns, int rows, Patch patch, int columnIndex, int rowIndex)
        {
            _context = context;

            Patches2D = new Patch[columns, rows];
            TotalColumns = columns;
            TotalRows = rows;
            NeighborPatchesFound2D = new bool[columns, rows];

            Patches2D[columnIndex, rowIndex] = patch;
        }

        public void Insert()
        {
            //Actually, we can just let this throw as normal
            //if (columnIndex > Patches2D.GetLength(0))
            //{
            //    throw new Exception("columnIndex outside range")
            //}

        }

        public void FillGrid()
        {
            var nextUnprocessedPatch = NextUnprocessedPatch();
            while (nextUnprocessedPatch != null)
            {
                // North Check
                if (nextUnprocessedPatch.RowIndex > 0 && nextUnprocessedPatch.Patch.NorthPatchId != null)
                {
                    //Patches2D[nextUnprocessedPatch.RowIndex - 1, nextUnprocessedPatch.ColumnIndex] = PatchManager.GetPatch(_context, (int)nextUnprocessedPatch.Patch.NorthPatchId);
                }

                // South Check
                if (nextUnprocessedPatch.RowIndex < TotalRows - 1)




                    //Find everything north, east, south, west of our patch
                    // Check whats north in our grid
                    // if anythigns in there or it's outside the bounds, just move on
                    // otherwise make a request for it
                    // if that request turns up with something place it into the grid
                    // otherwise, do nothing.
                    // etc, etc, for south, west, etc

                    // mark the cell as processed

                    nextUnprocessedPatch = NextUnprocessedPatch();
            }
        }


        private PatchWithGridMeta NextUnprocessedPatch()
        {
            for (int i = 0; i < Patches2D.GetLength(0); i++)
            {
                for (int j = 0; j < Patches2D.GetLength(1); j++)
                {
                    if (Patches2D[i, j] != null && NeighborPatchesFound2D[i, j] == false)
                    {
                        return new PatchWithGridMeta()
                        {
                            Patch = Patches2D[i, j],
                            ColumnIndex = i,
                            RowIndex = j
                        };
                    }
                }
            }
            return null;
        }
    }
}
