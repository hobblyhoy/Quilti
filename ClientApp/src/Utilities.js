import placeholderImageCheckers from './assets/checkers.js';
import placeholderImageReserved from './assets/reserved.js';

//// Grid Utilities \\\\
export function util_debugGrid(grid) {
   let debugGrid = [];
   for (let i = 0; i < grid.length; i++) {
      let row = [];
      for (let j = 0; j < grid[0].length; j++) {
         //row.push(i + '-' + j);
         let toAdd = grid[i][j].patchId;
         if (grid[i][j].status === 'reserved' || grid[i][j].status === 'partial' || grid[i][j].status === 'full') {
            toAdd += ' - ' + grid[i][j].status.substring(0, 4);
         }
         row.push(toAdd);
      }
      debugGrid.push(row);
   }

   let transpose = m => m[0].map((x, i) => m.map(x => x[i]));
   console.table(transpose(debugGrid));
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

export function util_calculateAllowableGridRoom(buttonSize, imageSize, minimumSpace) {
   if (arguments.length !== 3) throw 'invalid args in util_calculateAllowableGridRoom';
   if (buttonSize <= 0 || imageSize <= 0) throw 'invalid args in util_calculateAllowableGridRoom';

   let buttonBuffer = 2 * buttonSize;
   let navBuffer = Math.max(document.getElementById('nav').offsetHeight, document.getElementById('nav').clientHeight);

   let windowWidth = Math.min(window.innerWidth, window.outerWidth); // idk man, some browsers are just weird like that
   let windowHeight = Math.min(window.innerHeight, window.outerHeight);

   let gridRoomWidth = windowWidth - buttonBuffer;
   let gridRoomHeight = windowHeight - buttonBuffer - navBuffer;
   if (gridRoomWidth < minimumSpace || gridRoomHeight < minimumSpace) {
      throw 'oops, not enough room for any size grid! ' + gridRoomWidth + 'x' + gridRoomHeight;
   }

   let gridColumns = Math.floor(gridRoomWidth / imageSize);
   let gridRows = Math.floor(gridRoomHeight / imageSize);
   return { gridColumns, gridRows };
}

export function util_gridInitialize(columnCount, rowCount, leftX, topY) {
   if (arguments.length !== 4) throw 'invalid args in util_gridInitialize';
   if (columnCount <= 0 || rowCount <= 0) throw 'invalid args in util_gridInitialize';

   let x = leftX;
   let y = topY;
   let grid = [];
   for (let i = 0; i < columnCount; i++) {
      let row = [];
      y = topY;
      for (let j = 0; j < rowCount; j++) {
         row.push(util_createEmptyPatchDecFromPatchId(x + 'x' + y));
         y--;
      }
      grid.push(row);
      x++;
   }

   return grid;
}

export function util_gridFirstOrDefault(grid, predicate) {
   if (arguments.length !== 2) throw 'invalid args in util_gridFirstOrDefault';
   if (!util_gridIsValid(grid)) throw 'invalid grid in util_gridFirstOrDefault';

   let columnCount = util_gridColumnCount(grid);
   let rowCount = util_gridRowCount(grid);
   for (let i = 0; i < columnCount; i++) {
      for (let j = 0; j < rowCount; j++) {
         if (predicate(grid[i][j])) {
            return { patch: grid[i][j], columnIndex: i, rowIndex: j };
            //return grid[i][j];
         }
      }
   }
}

//// Patch Utilities \\\\
export function util_createEmptyPatchDecFromPatchId(patchId) {
   if (arguments.length !== 1) throw 'invalid args in util_createEmptyPatchDecFromPatchId';

   let coordinates = util_patchCoordinatesFromPatchId(patchId);

   return {
      patchId,
      x: coordinates.x,
      y: coordinates.y,
      src: placeholderImageCheckers,
      status: 'empty',
   };
}

export function util_createPatchDecFromPatch(patch) {
   if (arguments.length !== 1) throw 'invalid args in util_createPatchDecFromPatch';
   if (!patch) throw 'invalid args in util_createPatchDecFromPatch';
   if (patch.objectStatus !== 'ACT' && patch.objectStatus !== 'RES') throw 'invalid args in api_createPatchDecFromPatch';

   return {
      patchId: patch.patchId,
      x: patch.x,
      y: patch.y,
      src: patch.objectStatus === 'ACT' ? patch.imageMini : placeholderImageReserved,
      status: patch.objectStatus === 'ACT' ? 'partial' : 'reserved',
   };
}

export function util_patchCoordinatesFromPatchId(patchId) {
   if (arguments.length !== 1) throw 'invalid args in util_patchComponentsFromPatchId';

   return {
      x: parseInt(patchId.split('x')[0], 10),
      y: parseInt(patchId.split('x')[1], 10),
   };
}

//// Misc Utilities \\\\
// Take advantage of the fact that our setter maintain access to the latest React state values
// to pull it out when we've lost context (event listeners, setTimeout, etc)
export function util_extractReactState(setter) {
   if (arguments.length !== 1) throw 'invalid args in util_extractReactState';
   let valTemp;
   setter(val => {
      valTemp = val;
      return val;
   });
   return valTemp;
}
