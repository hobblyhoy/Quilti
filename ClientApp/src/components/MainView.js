import axios from 'axios';
import React, { useEffect, useState } from 'react';

export function MainView() {
   const [fullGrid, setFullGrid] = useState(null);

   let getPatch = async patchId => {
      //TODO local cacheing (only if all neighbours are filled)
      // that might actually be kind of hard to determine since remember theres the "reserved" state
      let resp = await axios.get('/api/Patch/' + patchId);
      return resp.data;
      // TODO decorate with some kind of "src" prop that will always hold the current source. It can also preload to our palceholder when it's reserved
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

         // if theres a patch north of us, we're not on the top row, and the item above us isnt in our grid yet..
         let northPatchAwaited, southPatchAwaited, eastPatchAwaited, westPatchAwaited;
         if (next.patch.northPatchId && next.rowIndex > 0 && grid[next.columnIndex][next.rowIndex - 1] === null) {
            northPatchAwaited = getPatch(next.patch.northPatchId);
         }

         // if theres a patch south of us, we're not on the bottom row, and the item below isn't in our grid yet..
         if (next.patch.southPatchId && next.rowIndex < grid[0].length - 1 && grid[next.columnIndex][next.rowIndex + 1] === null) {
            southPatchAwaited = getPatch(next.patch.southPatchId);
         }

         // if theres a patch east of us, we're not on the far right column, and the patch to our right isnt in oru grid yet..
         if (next.patch.eastPatchId && next.columnIndex < grid.length - 1 && grid[next.columnIndex + 1][next.rowIndex] === null) {
            eastPatchAwaited = getPatch(next.patch.eastPatchId);
         }

         // if theres a patch west of us, we're not in the first column, and the patch to our left isnt in our grid yet...
         if (next.patch.westPatchId && next.columnIndex > 0 && grid[next.columnIndex - 1][next.rowIndex] === null) {
            westPatchAwaited = getPatch(next.patch.westPatchId);
         }

         if (northPatchAwaited) {
            let northPatch = await northPatchAwaited;
            grid[next.columnIndex][next.rowIndex - 1] = northPatch;
         }
         if (southPatchAwaited) {
            let southPatch = await southPatchAwaited;
            grid[next.columnIndex][next.rowIndex + 1] = southPatch;
         }
         if (eastPatchAwaited) {
            let eastPatch = await eastPatchAwaited;
            grid[next.columnIndex + 1][next.rowIndex] = eastPatch;
         }
         if (westPatchAwaited) {
            let westPatch = await westPatchAwaited;
            grid[next.columnIndex - 1][next.rowIndex] = westPatch;
         }

         // TODO if we got a north, south, east, west patch and all came back as active, add it to the local cache

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

   let fakeLazyLoad = () => {
      let fullGridCopy = [...fullGrid];
      fullGridCopy[0][0].imageMini = 'https://via.placeholder.com/200';

      setFullGrid(fullGridCopy);
   };

   return (
      <div>
         <span>Hi this is the main view</span>
         <div style={{ display: 'flex' }}>
            {fullGrid &&
               fullGrid.map(column => {
                  return (
                     <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {column.map(row => (
                           <img src={row ? row.imageMini : 'https://via.placeholder.com/200'} style={{ width: '200px', height: '200px' }} />
                        ))}
                     </div>
                  );
               })}
         </div>
         <button onClick={fakeLazyLoad}>Simulate a lazy load</button>
      </div>
   );
}
