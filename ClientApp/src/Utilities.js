///////// Grid Utilities \\\\\\\\\\\
export function util_gridInitialize(columns, rows, defaultValue) {
   if (arguments.length !== 3) throw 'invalid args';

   let grid = [];
   for (let i = 0; i < columns; i++) {
      let row = [];
      for (let j = 0; j < rows; j++) {
         row.push(defaultValue);
      }
      grid.push(row);
   }

   return grid;
}

export function util_gridColumnCount(grid) {
   if (arguments.length !== 1) throw 'invalid args';

   return grid.length;
}

export function util_gridRowCount(grid) {
   if (arguments.length !== 1) throw 'invalid args';

   return grid[0].length;
}

export function util_gridIsValid(grid) {
   let columns = util_gridColumnCount(grid);
   let rows = util_gridRowCount(grid);

   return columns > 0 && rows > 0;
}

export function util_gridShiftUp(grid, defaultValue) {
   if (arguments.length !== 2) throw 'invalid args';
   if (!util_gridIsValid(grid)) throw 'invalid grid';

   let columnCount = util_gridColumnCount(grid);
   for (let i = 0; i < columnCount; i++) {
      grid[i].unshift(defaultValue);
      grid[i].pop();
   }
   return grid;
}

export function util_gridShiftDown(grid, defaultValue) {
   if (arguments.length !== 2) throw 'invalid args';
   if (!util_gridIsValid(grid)) throw 'invalid grid';

   let columnCount = util_gridColumnCount(grid);
   for (let i = 0; i < columnCount; i++) {
      grid[i].shift();
      grid[i].push(defaultValue);
   }
   return grid;
}

export function util_gridShiftLeft(grid, defaultValue) {
   if (arguments.length !== 2) throw 'invalid args';
   if (!util_gridIsValid(grid)) throw 'invalid grid';

   let newColumn = [];
   let rowCount = util_gridRowCount(grid);
   for (let i = 0; i < rowCount; i++) {
      newColumn.push(defaultValue);
   }

   grid.unshift(newColumn);
   grid.pop();

   return grid;
}

export function util_gridShiftRight(grid, defaultValue) {
   if (arguments.length !== 2) throw 'invalid args';
   if (!util_gridIsValid(grid)) throw 'invalid grid';

   let newColumn = [];
   let rowCount = util_gridRowCount(grid);
   for (let i = 0; i < rowCount; i++) {
      newColumn.push(defaultValue);
   }

   grid.shift();
   grid.push(newColumn);

   return grid;
}

// Useful for knocking out the statuses on the row/column before a
// newly inserted one so they can be processed again to find their
// new neighbors
export function util_gridFillColumn(grid, columnIndex, defaultValue) {
   if (arguments.length !== 3) throw 'invalid args';
   if (columnIndex < 0 || columnIndex > util_gridColumnCount(grid) - 1) throw 'invalid args';
   if (!util_gridIsValid(grid)) throw 'invalid grid';

   let rowCount = util_gridRowCount(grid);
   for (let i = 0; i < rowCount; i++) {
      grid[columnIndex][i] = defaultValue;
   }

   return grid;
}

export function util_gridFillRow(grid, rowIndex, defaultValue) {
   if (arguments.length !== 3) throw 'invalid args';
   if (rowIndex < 0 || rowIndex > util_gridRowCount(grid) - 1) throw 'invalid args';
   if (!util_gridIsValid(grid)) throw 'invalid grid';

   let columnCount = util_gridColumnCount(grid);
   for (let i = 0; i < columnCount; i++) {
      grid[i][rowIndex] = defaultValue;
   }

   return grid;
}

export function util_gridFirstOrDefault(grid, predicate) {
   if (arguments.length !== 2) throw 'invalid args';
   if (!util_gridIsValid(grid)) throw 'invalid grid';

   let columnCount = util_gridColumnCount(grid);
   let rowCount = util_gridRowCount(grid);
   for (let i = 0; i < columnCount; i++) {
      for (let j = 0; j < rowCount; j++) {
         if (predicate(grid[i][j])) {
            return { patch: grid[i][j], columnIndex: i, rowIndex: j };
         }
      }
   }
}

// Patches outside our current grid area will return undefined
// Otherwise we return whatever is located in that position relative to the provided coordinates
// For empty patches within our bounds this should be null
export function util_gridGetSurroundingPatches(grid, columnIndex, rowIndex) {
   if (arguments.length !== 3) throw 'invalid args';
   if (!util_gridIsValid(grid)) throw 'invalid grid';

   let ret = { northPatch: undefined, southPatch: undefined, eastPatch: undefined, westPatch: undefined };
   if (rowIndex > 0) ret.northPatch = grid[columnIndex][rowIndex - 1];
   if (rowIndex < util_gridRowCount(grid) - 1) ret.southPatch = grid[columnIndex][rowIndex + 1];
   if (columnIndex < util_gridColumnCount(grid) - 1) ret.eastPatch = grid[columnIndex + 1][rowIndex];
   if (columnIndex > 0) ret.westPatch = grid[columnIndex - 1][rowIndex];

   return ret;
}

export function util_debugGrid(grid) {
   let idsOnlyGrid = [];
   for (let i = 0; i < grid.length; i++) {
      let row = [];
      for (let j = 0; j < grid[0].length; j++) {
         //row.push(i + '-' + j);
         if (grid[i][j] != null) {
            row.push(grid[i][j].patchId);
         } else {
            row.push(null);
         }
      }
      idsOnlyGrid.push(row);
   }

   let transpose = m => m[0].map((x, i) => m.map(x => x[i]));
   console.table(transpose(idsOnlyGrid));
}

///////// Patch Utilities \\\\\\\\\\\
export function util_patchIsValid(patch) {
   return !!patch.patchId;
}

export function util_patchDecorate(patch) {
   if (arguments.length !== 1) throw 'invalid args';
   if (!util_patchIsValid(patch)) throw 'invalid args';

   patch.__src = patch.imageMini;
   patch.__fullImageLoaded = false;
   return patch;
}

export function util_patchApplyFullImage(patch, image) {
   if (arguments.length !== 2) throw 'invalid args';
   if (!image || typeof image !== 'string' || image.length === 0) throw 'invalid args';

   patch.__src = image;
   patch.__fullImageLoaded = true;

   return patch;
}
