export function util_gridInitialize(columns, rows, defaultValue) {
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
   return grid.length;
}

export function util_gridRowCount(grid) {
   return grid[0].length;
}

export function util_gridShiftUp(grid, defaultValue) {
   let columnCount = util_gridColumnCount(grid);
   for (let i = 0; i < columnCount; i++) {
      grid[i].unshift(defaultValue);
      grid[i].pop();
   }
   return grid;
}

export function util_gridShiftDown(grid, defaultValue) {
   let columnCount = util_gridColumnCount(grid);
   for (let i = 0; i < columnCount; i++) {
      grid[i].shift();
      grid[i].push(defaultValue);
   }
   return grid;
}

export function util_gridShiftLeft(grid, defaultValue) {
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
   let rowCount = util_gridRowCount(grid);
   for (let i = 0; i < rowCount; i++) {
      grid[columnIndex][i] = defaultValue;
   }

   return grid;
}

export function util_gridFillRow(grid, rowIndex, defaultValue) {
   let columnCount = util_gridColumnCount(grid);
   for (let i = 0; i < columnCount; i++) {
      grid[i][rowIndex] = defaultValue;
   }

   return grid;
}

export function util_gridFirstOrDefault(grid, predicate) {
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
