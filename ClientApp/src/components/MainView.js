import axios from 'axios';
import React, { useEffect, useState } from 'react';

export function MainView() {
   const [fullGrid, setFullGrid] = useState(null);

   let getPatch = async patchId => {
      //TODO local cacheing (only if all neighbours are filled)
      // that might actually be kind of hard to determine since remember theres the "reserved" state
      let resp = await axios.get('/api/Patch/' + patchId);
      return resp.data;
   };

   let nextUnprocessedPatch = async (grid, gridStatus) => {
      for (let i = 0; i < grid.length; i++) {
         for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] != null && gridStatus[i][j] == false) {
               return { patch: grid[i][j], columnIndex: i, rowIndex: j };
            }
         }
      }
   };

   let fillGrid = async (grid, gridStatus) => {
      let next = await nextUnprocessedPatch(grid, gridStatus);
      //console.log({ next });
      while (next) {
         console.log({ next });
         // Get all surrounding patches that reside within our grid

         // if we know theres a patch north of us, we're not on the top row, and the item above us isnt in our grid yet..
         if (next.patch.northPatchId && next.rowIndex > 0 && grid[next.columnIndex][next.rowIndex - 1] === null) {
            let northPatch = await getPatch(next.patch.northPatchId);
            grid[next.columnIndex][next.rowIndex - 1] = northPatch;
         }

         // if we know theres a patch south of us, we're not on the bottom row, and the item below isn't in our grid yet..
         if (next.patch.southPatchId && next.rowIndex < grid[0].length - 1 && grid[next.columnIndex][next.rowIndex + 1] === null) {
            let southPatch = await getPatch(next.patch.southPatchId);
            grid[next.columnIndex][next.rowIndex + 1] = southPatch;
         }
         // TODO  east, west.

         // if theres a patch east of us, we're not on the far right column, and the patch to our right isnt in oru grid yet..
         if (next.patch.eastPatchId && next.columnIndex < grid.length - 1 && grid[next.columnIndex + 1][next.rowIndex] === null) {
            let eastPatch = await getPatch(next.patch.eastPatchId);
            grid[next.columnIndex + 1][next.rowIndex] = eastPatch;
         }

         // if theres a patch west of us, we're not in the first column, and the patch to our left isnt in our grid yet...
         if (next.patch.westPatchId && next.columnIndex > 0 && grid[next.columnIndex - 1][next.rowIndex] === null) {
            let westPatch = await getPatch(next.patch.westPatchId);
            grid[next.columnIndex - 1][next.rowIndex] = westPatch;
         }

         // TODO if we got a north, south, east, west patch and all came back as active, add it to the local cache

         // TODO figure out how to get all these to run in parallel

         // Mark the current block as proccessed
         gridStatus[next.columnIndex][next.rowIndex] = true;

         // Grab the next Patch to be processed
         next = await nextUnprocessedPatch(grid, gridStatus);
      }
   };

   let debugGrid = grid => {
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
   };

   let initialLoad = async () => {
      // Initial load
      // Make a request for the first item
      let resp = await axios.get('/api/Patch');
      let initialPatch = resp.data;
      let imageSize = 200;
      let buttonBuffer = 2 * 20;
      let navBuffer = 100; //hard code just for POC
      let gridColumns = Math.floor((window.innerWidth - buttonBuffer) / imageSize);
      let gridRows = Math.floor((window.innerHeight - buttonBuffer - navBuffer) / imageSize);

      // Initialize an empty grid and gridStatus
      let grid = [];
      let gridStatus = [];
      for (let i = 0; i < gridColumns; i++) {
         let row = [];
         let rowStatus = [];
         for (let j = 0; j < gridRows; j++) {
            //row.push(i + '-' + j);
            row.push(null);
            rowStatus.push(false);
         }
         grid.push(row);
         gridStatus.push(rowStatus);
      }

      let gridColumnIndex;
      let gridRowIndex;
      if (!initialPatch.northPatchId) {
         gridColumnIndex = Math.floor(gridColumns / 2);
         gridRowIndex = gridRows > 1 ? 1 : 0;
      } //TODO the rest of these..

      grid[gridColumnIndex][gridRowIndex] = initialPatch;

      // fill in the rest of the grid..
      await fillGrid(grid, gridStatus);
      setFullGrid(grid);

      debugGrid(grid);
      console.log(grid);
   };

   useEffect(() => {
      initialLoad();
   }, []);

   return (
      <div>
         <span>Hi this is the main view</span>
         <div style={{ display: 'flex' }}>
            {fullGrid &&
               fullGrid.map(column => {
                  return (
                     <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {column.map(row => (
                           <div style={{ display: 'block', width: '200px', height: '200px' }}>| {row ? row.patchId : '-'} |</div>
                        ))}
                     </div>
                  );
               })}
         </div>
      </div>
   );
}
