///////// Grid Utilities \\\\\\\\\\\
export function util_gridInitialize(columns, rows, defaultValue) {
   if (arguments.length !== 3) throw 'invalid args in util_gridInitialize';

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
   if (arguments.length !== 1) throw 'invalid args in util_gridColumnCount';
   if (!grid) throw 'invalid args in util_gridColumnCount';

   return grid.length;
}

export function util_gridRowCount(grid) {
   if (arguments.length !== 1) throw 'invalid args in util_gridRowCount';
   if (!grid || !grid[0]) throw 'invalid args in util_gridRowCount';

   return grid[0].length;
}

export function util_gridIsValid(grid) {
   let columns = util_gridColumnCount(grid);
   let rows = util_gridRowCount(grid);

   return columns > 0 && rows > 0;
}

export function util_gridContainsCoordinates(grid, columnIndex, rowIndex) {
   if (arguments.length !== 3) throw 'invalid args in util_gridContainsCoordinates';
   if (!util_gridIsValid(grid)) throw 'invalid grid in util_gridContainsCoordinates';

   if (columnIndex < 0 || columnIndex > util_gridColumnCount(grid) - 1) return false;
   if (rowIndex < 0 || rowIndex > util_gridRowCount(grid) - 1) return false;

   return true;
}

export function util_gridShiftUp(grid, defaultValue) {
   if (arguments.length !== 2) throw 'invalid args in util_gridShiftUp';
   if (!util_gridIsValid(grid)) throw 'invalid grid in util_gridShiftUp';

   let columnCount = util_gridColumnCount(grid);
   for (let i = 0; i < columnCount; i++) {
      grid[i].unshift(defaultValue);
      grid[i].pop();
   }
   return grid;
}

export function util_gridShiftDown(grid, defaultValue) {
   if (arguments.length !== 2) throw 'invalid args in util_gridShiftDown';
   if (!util_gridIsValid(grid)) throw 'invalid grid in util_gridShiftDown';

   let columnCount = util_gridColumnCount(grid);
   for (let i = 0; i < columnCount; i++) {
      grid[i].shift();
      grid[i].push(defaultValue);
   }
   return grid;
}

export function util_gridShiftLeft(grid, defaultValue) {
   if (arguments.length !== 2) throw 'invalid args in util_gridShiftLeft';
   if (!util_gridIsValid(grid)) throw 'invalid grid in util_gridShiftLeft';

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
   if (arguments.length !== 2) throw 'invalid args in util_gridShiftRight';
   if (!util_gridIsValid(grid)) throw 'invalid grid in util_gridShiftRight';

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
   if (arguments.length !== 3) throw 'invalid args in util_gridFillColumn';
   if (columnIndex < 0 || columnIndex > util_gridColumnCount(grid) - 1) throw 'invalid args in util_gridFillColumn';
   if (!util_gridIsValid(grid)) throw 'invalid grid in util_gridFillColumn';
   if (!util_gridContainsCoordinates(grid, columnIndex, 0)) throw 'invalid coordinates in util_gridFillColumn';

   let rowCount = util_gridRowCount(grid);
   for (let i = 0; i < rowCount; i++) {
      grid[columnIndex][i] = defaultValue;
   }

   return grid;
}

export function util_gridFillRow(grid, rowIndex, defaultValue) {
   if (arguments.length !== 3) throw 'invalid args in util_gridFillRow';
   if (rowIndex < 0 || rowIndex > util_gridRowCount(grid) - 1) throw 'invalid args in util_gridFillRow';
   if (!util_gridIsValid(grid)) throw 'invalid grid';
   if (!util_gridContainsCoordinates(grid, 0, rowIndex)) throw 'invalid coordinates in util_gridFillRow';

   let columnCount = util_gridColumnCount(grid);
   for (let i = 0; i < columnCount; i++) {
      grid[i][rowIndex] = defaultValue;
   }

   return grid;
}

// NOTE this doesnt return the patch, it returns an object with the patch and its coordinates
export function util_gridFirstOrDefault(grid, predicate) {
   if (arguments.length !== 2) throw 'invalid args in util_gridFirstOrDefault';
   if (!util_gridIsValid(grid)) throw 'invalid grid in util_gridFirstOrDefault';

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
   if (arguments.length !== 3) throw 'invalid args in util_gridGetSurroundingPatches';
   if (!util_gridIsValid(grid)) throw 'invalid grid in util_gridGetSurroundingPatches';
   if (!util_gridContainsCoordinates(grid, columnIndex, rowIndex)) throw 'invalid coordinates in util_gridGetSurroundingPatches';

   let ret = { northPatch: undefined, southPatch: undefined, eastPatch: undefined, westPatch: undefined };
   if (rowIndex > 0) ret.northPatch = grid[columnIndex][rowIndex - 1];
   if (rowIndex < util_gridRowCount(grid) - 1) ret.southPatch = grid[columnIndex][rowIndex + 1];
   if (columnIndex < util_gridColumnCount(grid) - 1) ret.eastPatch = grid[columnIndex + 1][rowIndex];
   if (columnIndex > 0) ret.westPatch = grid[columnIndex - 1][rowIndex];

   return ret;
}

//Generates increasingly larger circles from a given starting point until it finds a patch. Returns patch with coordinate meta
export function util_gridFindNearestPatch(grid, columnIndex, rowIndex, predicate) {
   if (arguments.length !== 4) throw 'invalid args in util_gridGetSurroundingPatches';
   if (!util_gridIsValid(grid)) throw 'invalid grid in util_gridGetSurroundingPatches';
   if (!util_gridContainsCoordinates(grid, columnIndex, rowIndex)) throw 'invalid coordinates in util_gridFindNearestPatch';

   // The trivial case
   if (util_patchIsValid(grid[columnIndex][rowIndex])) return { patch: grid[columnIndex][rowIndex], columnIndex, rowIndex };

   // Certainly not a perfectly efficient algorithm but it's all just lookups on relatively tiny arrays, I'm not worried about it one bit
   let patchWithMeta;
   let columnStart = columnIndex;
   let columnEnd = columnIndex;
   let rowStart = rowIndex;
   let rowEnd = rowIndex;
   let iterationCount = 0;
   while (!patchWithMeta) {
      iterationCount++;
      if (iterationCount > 200) throw 'infinite loop in util_gridFindNearestPatch';

      //generate new search bounds
      if (columnStart > 0) columnStart--;
      if (columnEnd < util_gridColumnCount(grid) - 1) columnEnd++;
      if (rowStart > 0) rowStart--;
      if (rowEnd < util_gridRowCount(grid) - 1) rowEnd++;

      for (let i = columnStart; i < columnEnd; i++) {
         for (let j = rowStart; j < rowEnd; j++) {
            if (predicate(grid[i][j])) {
               return { patch: grid[i][j], columnIndex: i, rowIndex: j };
            }
         }
      }

      if (columnStart === 0 && columnEnd === util_gridColumnCount(grid) - 1 && rowStart === 0 && rowEnd === util_gridRowCount(grid) - 1) {
         throw 'searched entire grid and did not find any patches';
      }
   }
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
   if (arguments.length !== 1) throw 'invalid args in util_patchIsValid';

   return !!(patch && patch.patchId);
}

export function util_patchDecorate(patch) {
   if (arguments.length !== 1) throw 'invalid args in util_patchDecorate';
   if (!util_patchIsValid(patch)) throw 'invalid args in util_patchDecorate';

   if (!patch.__src && !patch.__fullImageLoaded) {
      patch.__src = patch.imageMini;
      patch.__fullImageLoaded = false;
   }
   return patch;
}

export function util_patchApplyFullImage(patch, image) {
   if (arguments.length !== 2) throw 'invalid args in util_patchApplyFullImage';
   if (!image || typeof image !== 'string' || image.length === 0) throw 'invalid args in util_patchApplyFullImage';

   patch.__src = image;
   patch.__fullImageLoaded = true;

   return patch;
}

///////// Misc Utilities \\\\\\\\\\\
export function util_calculateAllowableGridRoom(buttonSize, imageSize) {
   if (arguments.length !== 2) throw 'invalid args in util_calculateAllowableGridRoom';
   if (buttonSize <= 0 || imageSize <= 0) throw 'invalid args in util_calculateAllowableGridRoom';

   let buttonBuffer = 2 * buttonSize;
   let navBuffer = Math.max(document.getElementById('nav').offsetHeight, document.getElementById('nav').clientHeight);

   let windowWidth = Math.min(window.innerWidth, window.outerWidth); // idk man, some browsers are just weird like that
   let windowHeight = Math.min(window.innerHeight, window.outerHeight);

   let gridRoomWidth = windowWidth - buttonBuffer;
   let gridRoomHeight = windowHeight - buttonBuffer - navBuffer;
   if (gridRoomWidth < 100 || gridRoomHeight < 100) {
      throw 'oops, not enough room for any size grid! ' + gridRoomWidth + 'x' + gridRoomHeight;
   }

   let gridColumns = Math.floor(gridRoomWidth / imageSize);
   let gridRows = Math.floor(gridRoomHeight / imageSize);
   console.log({ gridColumns, gridRows });
   return { gridColumns, gridRows };
}
