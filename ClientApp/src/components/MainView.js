﻿import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
   util_gridInitialize,
   util_gridShiftLeft,
   util_debugGrid,
   util_gridFillColumn,
   util_gridShiftRight,
   util_gridColumnCount,
   util_gridShiftUp,
   util_gridFillRow,
   util_gridShiftDown,
   util_gridRowCount,
   util_gridFirstOrDefault,
   util_patchDecorate,
} from '../Utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp, faAngleDoubleDown, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { db_init, db_patch_get, db_patch_insertSafe, db_patchImage_get, db_patchImage_insertSafe } from '../DB';

export function MainView() {
   const [fullGrid, setFullGrid] = useState(null);
   const [fullGridStatus, setFullGridStatus] = useState(null);
   const [columns, setColumns] = useState(0);
   const [rows, setRows] = useState(0);
   const [imageSize, setImageSize] = useState(200);
   const [buttonSize, setButtonSize] = useState(30);
   const [mainAreaHeight, setMainAreaHeight] = useState(1);
   const [dbIsInitialized, setDbIsInitialized] = useState(false);

   let getPatch = async patchId => {
      let patch = await db_patch_get(patchId);
      if (!patch) {
         let resp = await axios.get('/api/Patch/' + patchId);
         patch = resp.data;
      }

      // image might be null here, we're cool with that
      let image = await db_patchImage_get(patchId);
      return util_patchDecorate(patch, image);
   };

   let getPatchImage = async patchId => {
      let image = await db_patchImage_get(patchId);
      if (!image) {
         let resp = await axios.get('/api/PatchImage/' + patchId);
         image = resp.data;

         db_patchImage_insertSafe(patchId, image);
      }

      return image;
   };

   let nextUnprocessedPatch = async (grid, gridStatus) => {
      for (let i = 0; i < util_gridColumnCount(grid); i++) {
         for (let j = 0; j < util_gridRowCount(grid); j++) {
            if (grid[i][j] != null && gridStatus[i][j] == false) {
               return { patch: grid[i][j], columnIndex: i, rowIndex: j };
            }
         }
      }
   };

   let fillGrid = async (grid, gridStatus) => {
      let next = await nextUnprocessedPatch(grid, gridStatus);
      while (next) {
         // if theres a patch north of us, we're not on the top row, and the item above us isnt in our grid yet..
         let northPatchAwaited, southPatchAwaited, eastPatchAwaited, westPatchAwaited;
         let northPatch, southPatch, eastPatch, westPatch;
         if (next.patch.northPatchId && next.rowIndex > 0 && grid[next.columnIndex][next.rowIndex - 1] === null) {
            northPatchAwaited = getPatch(next.patch.northPatchId);
         }
         // if theres a patch south of us, we're not on the bottom row, and the item below isn't in our grid yet..
         if (next.patch.southPatchId && next.rowIndex < util_gridRowCount(grid) - 1 && grid[next.columnIndex][next.rowIndex + 1] === null) {
            southPatchAwaited = getPatch(next.patch.southPatchId);
         }
         // if theres a patch east of us, we're not on the far right column, and the patch to our right isnt in oru grid yet..
         if (
            next.patch.eastPatchId &&
            next.columnIndex < util_gridColumnCount(grid) - 1 &&
            grid[next.columnIndex + 1][next.rowIndex] === null
         ) {
            eastPatchAwaited = getPatch(next.patch.eastPatchId);
         }
         // if theres a patch west of us, we're not in the first column, and the patch to our left isnt in our grid yet...
         if (next.patch.westPatchId && next.columnIndex > 0 && grid[next.columnIndex - 1][next.rowIndex] === null) {
            westPatchAwaited = getPatch(next.patch.westPatchId);
         }

         if (northPatchAwaited) {
            northPatch = await northPatchAwaited;
            grid[next.columnIndex][next.rowIndex - 1] = northPatch;
         }
         if (southPatchAwaited) {
            southPatch = await southPatchAwaited;
            grid[next.columnIndex][next.rowIndex + 1] = southPatch;
         }
         if (eastPatchAwaited) {
            eastPatch = await eastPatchAwaited;
            grid[next.columnIndex + 1][next.rowIndex] = eastPatch;
         }
         if (westPatchAwaited) {
            westPatch = await westPatchAwaited;
            grid[next.columnIndex - 1][next.rowIndex] = westPatch;
         }

         // Only insert into your local cache if all the surrounding cells are completed
         if (
            northPatch &&
            northPatch.objectStatus === 'ACT' &&
            southPatch &&
            southPatch.objectStatus === 'ACT' &&
            eastPatch &&
            eastPatch.objectStatus === 'ACT' &&
            westPatch &&
            westPatch.objectStatus === 'ACT'
         ) {
            await db_patch_insertSafe(next.patch);
         }

         // Mark the current block as proccessed
         gridStatus[next.columnIndex][next.rowIndex] = true;

         // Grab the next Patch to be processed
         next = await nextUnprocessedPatch(grid, gridStatus);
      }
   };

   let initialLoad = async () => {
      if (!dbIsInitialized) {
         // only needed because of HMR, if this is a prod build we can pull it out
         db_init();
         setDbIsInitialized(true);
      }
      // Initial load
      // Make a request for the first item
      let resp = await axios.get('/api/Patch');
      let initialPatch = resp.data;
      let buttonBuffer = 2 * buttonSize;
      let navBuffer = 100; //hard code just for POC
      let gridColumns = Math.floor((window.innerWidth - buttonBuffer) / imageSize);
      let gridRows = Math.floor((window.innerHeight - buttonBuffer - navBuffer) / imageSize);
      setColumns(gridColumns);
      setRows(gridRows);

      // Initialize an empty grid and gridStatus
      let grid = util_gridInitialize(gridColumns, gridRows, null);
      let gridStatus = util_gridInitialize(gridColumns, gridRows, false);

      let gridColumnIndex;
      let gridRowIndex;
      if (!initialPatch.northPatchId) {
         gridColumnIndex = Math.floor(gridColumns / 2);
         gridRowIndex = gridRows > 1 ? 1 : 0;
      } //TODO the rest of these..

      grid[gridColumnIndex][gridRowIndex] = util_patchDecorate(initialPatch);

      setMainAreaHeight(window.innerHeight - document.getElementById('nav').offsetHeight);

      // fill in the rest of the grid..
      await fillGrid(grid, gridStatus);
      setFullGrid(grid);
      setFullGridStatus(gridStatus);
   };

   useEffect(() => {
      initialLoad();
   }, []);

   let patchClick = (patch, columnIndex, rowIndex) => {
      //TODO, all of it
      console.log({ patch, columnIndex, rowIndex });
   };

   let moveGrid = async direction => {
      let grid, gridStatus;
      switch (direction) {
         case 'up':
            grid = util_gridShiftUp(fullGrid, null);
            gridStatus = util_gridShiftUp(fullGridStatus, false);
            gridStatus = util_gridFillRow(gridStatus, false);
            break;
         case 'down':
            grid = util_gridShiftDown(fullGrid, null);
            gridStatus = util_gridShiftDown(fullGridStatus, false);
            gridStatus = util_gridFillRow(gridStatus, util_gridRowCount(grid) - 2, false);
            break;
         case 'left':
            grid = util_gridShiftLeft(fullGrid, null);
            gridStatus = util_gridShiftLeft(fullGridStatus, false);
            gridStatus = util_gridFillColumn(gridStatus, 1, false);
            break;
         case 'right':
            grid = util_gridShiftRight(fullGrid, null);
            gridStatus = util_gridShiftRight(fullGridStatus, false);
            gridStatus = util_gridFillColumn(gridStatus, util_gridColumnCount(grid) - 2, false);
            break;
      }

      await fillGrid(grid, gridStatus);

      setFullGrid([...grid]);
      setFullGridStatus([...gridStatus]);
   };

   // TODO consider just folding this into the useEffect below
   let checkForFullImages = async () => {
      let result = util_gridFirstOrDefault(fullGrid, patch => patch && !patch.__fullImageLoaded);
      let patchMissingFullImage = result && result.patch;
      if (patchMissingFullImage) {
         let image = await getPatchImage(patchMissingFullImage.patchId);
         util_patchDecorate(patchMissingFullImage, image);

         setFullGrid([...fullGrid]);
      }
   };

   useEffect(() => {
      if (fullGrid) {
         console.log('grid updated');
         util_debugGrid(fullGrid);
         checkForFullImages();
      }
   }, [fullGrid]);

   const gridContainer = {
      display: 'grid',
      gridTemplateColumns: `${buttonSize}px ${imageSize * columns}px ${buttonSize}px`,
      gridTemplateRows: `${buttonSize}px ${imageSize * rows}px ${buttonSize}px`,
   };

   const alignCenter = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   };

   return (
      <div>
         <div style={{ height: mainAreaHeight + 'px', ...alignCenter }}>
            <div style={gridContainer}>
               <div
                  style={{ gridColumnStart: 2, gridColumnEnd: 3, gridRowStart: 1, gridRowEnd: 2, ...alignCenter }}
                  onClick={() => moveGrid('up')}>
                  <FontAwesomeIcon icon={faAngleDoubleUp} />
               </div>
               <div
                  style={{ gridColumnStart: 2, gridColumnEnd: 3, gridRowStart: 3, gridRowEnd: 4, ...alignCenter }}
                  onClick={() => moveGrid('down')}>
                  <FontAwesomeIcon icon={faAngleDoubleDown} />
               </div>
               <div
                  style={{ gridColumnStart: 1, gridColumnEnd: 2, gridRowStart: 2, gridRowEnd: 3, ...alignCenter }}
                  onClick={() => moveGrid('left')}>
                  <FontAwesomeIcon icon={faAngleDoubleLeft} />
               </div>
               <div
                  style={{ gridColumnStart: 3, gridColumnEnd: 4, gridRowStart: 2, gridRowEnd: 3, ...alignCenter }}
                  onClick={() => moveGrid('right')}>
                  <FontAwesomeIcon icon={faAngleDoubleRight} />
               </div>

               {/* here down is our working grid based on flexbox dont touch! (TODO consider transition into css grid, would have to be pretty dynamicly built though) */}
               <div style={{ display: 'flex', gridColumnStart: 2, gridColumnEnd: 3, gridRowStart: 2, gridRowEnd: 3 }}>
                  {fullGrid &&
                     fullGrid.map((column, i) => {
                        return (
                           <div style={{ display: 'flex', flexDirection: 'column' }}>
                              {column.map((row, j) => (
                                 <img
                                    src={row ? row.__src : 'https://via.placeholder.com/200'}
                                    style={{ width: '200px', height: '200px' }}
                                    onClick={() => patchClick(row, i, j)}
                                 />
                              ))}
                           </div>
                        );
                     })}
               </div>
            </div>
         </div>
      </div>
   );
}
