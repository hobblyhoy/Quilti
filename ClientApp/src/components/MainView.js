import axios from 'axios';
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
   util_patchApplyFullImage,
   util_gridGetSurroundingPatches,
} from '../Utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   faAngleDoubleUp,
   faAngleDoubleDown,
   faAngleDoubleLeft,
   faAngleDoubleRight,
   faPlus,
   faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { db_init, db_patch_get, db_patch_insertSafe, db_patchImage_get, db_patchImage_insertSafe } from '../DB';
import placeholderImageCheckers from '../assets/checkers2.png';
import placeholderImageReserved from '../assets/reserved.png';
import './MainView.css';
import { NavMenu } from './NavMenu';
import { NavItem, NavLink } from 'reactstrap';

export function MainView() {
   const [fullGrid, setFullGrid] = useState(null);
   const [fullGridStatus, setFullGridStatus] = useState(null);
   const [columns, setColumns] = useState(0);
   const [rows, setRows] = useState(0);
   const [imageSize, setImageSize] = useState(150);
   const [buttonSize, setButtonSize] = useState(30);
   const [mainAreaHeight, setMainAreaHeight] = useState(1);
   const [dbIsInitialized, setDbIsInitialized] = useState(false);

   //// Primary object getters \\\\
   let getPatch = async patchId => {
      let patch = await db_patch_get(patchId);
      if (!patch) {
         let resp = await axios.get('/api/Patch/' + patchId);
         patch = resp.data;
      }

      util_patchDecorate(patch);

      // IF this is a reserved patch, apply it's reserved image
      if (patch.objectStatus === 'RES') util_patchApplyFullImage(patch, placeholderImageReserved);

      // If we already have the full image in our local db, apply it now
      let image = await db_patchImage_get(patchId);
      if (image) util_patchApplyFullImage(patch, image);
      return patch;
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

   //// Initial Load \\\\
   let initialLoad = async () => {
      if (!dbIsInitialized) {
         db_init();
         // only needed because of HMR, if this is a prod build we can pull it out
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

      // Our initial patch will always be missing at least one of north/south/east/west directions
      // we need to figure out which it is and strategically position it in the grid to be conducive for adding onto the quilt
      let gridColumnIndex;
      let gridRowIndex;
      if (!initialPatch.northPatchId) {
         gridColumnIndex = Math.floor(gridColumns / 2);
         gridRowIndex = 1;
      } else if (!initialPatch.southPatchId) {
         gridColumnIndex = Math.floor(gridColumns / 2);
         gridRowIndex = gridRows - 2;
      } else if (!initialPatch.eastPatch) {
         gridColumnIndex = 1;
         gridRowIndex = Math.floor(gridRows) / 2;
      } else if (!initialPatch.westPatch) {
         gridColumnIndex = gridColumns - 2;
         gridRowIndex = Math.floor(gridRowIndex) / 2;
      }

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

   //// Main and support functions for filling the grid \\\\
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
         let surroundingPatches = util_gridGetSurroundingPatches(grid, next.columnIndex, next.rowIndex);

         // if theres a patch north of us, we're not on the top row, and the item above us isn't in our grid yet..
         //cannot be a simple !surroundingPatches.xxxxPatch check, we get undefined for patches outside our current grid
         let northPatchAwaited, southPatchAwaited, eastPatchAwaited, westPatchAwaited;
         let northPatch, southPatch, eastPatch, westPatch;
         if (next.patch.northPatchId && surroundingPatches.northPatch === null) {
            northPatchAwaited = getPatch(next.patch.northPatchId);
         }
         // if theres a patch south of us, we're not on the bottom row, and the item below isn't in our grid yet..
         if (next.patch.southPatchId && surroundingPatches.southPatch === null) {
            southPatchAwaited = getPatch(next.patch.southPatchId);
         }
         // if theres a patch east of us, we're not on the far right column, and the patch to our right isn't in our grid yet..
         if (next.patch.eastPatchId && surroundingPatches.eastPatch === null) {
            eastPatchAwaited = getPatch(next.patch.eastPatchId);
         }
         // if theres a patch west of us, we're not in the first column, and the patch to our left isn't in our grid yet..
         if (next.patch.westPatchId && surroundingPatches.westPatch === null) {
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

         // Insert into the local cache if all the surrounding cells are completed
         // The above logic is too strict to reuse here so we'll need to read into each cell individually
         surroundingPatches = util_gridGetSurroundingPatches(grid, next.columnIndex, next.rowIndex); //Update surroundingPatches
         if (
            surroundingPatches.northPatch &&
            surroundingPatches.northPatch.objectStatus === 'ACT' &&
            surroundingPatches.southPatch &&
            surroundingPatches.southPatch.objectStatus === 'ACT' &&
            surroundingPatches.eastPatch &&
            surroundingPatches.eastPatch.objectStatus === 'ACT' &&
            surroundingPatches.westPatch &&
            surroundingPatches.westPatch.objectStatus === 'ACT'
         ) {
            await db_patch_insertSafe(next.patch);
         }

         // Flag the current patch as processed
         gridStatus[next.columnIndex][next.rowIndex] = true;

         // Grab the next Patch to be processed
         next = await nextUnprocessedPatch(grid, gridStatus);
      }
   };

   let checkForFullImages = async () => {
      let result = util_gridFirstOrDefault(fullGrid, patch => patch && !patch.__fullImageLoaded && patch.objectStatus === 'ACT');
      let patchMissingFullImage = result && result.patch;
      if (patchMissingFullImage) {
         let image = await getPatchImage(patchMissingFullImage.patchId);
         util_patchApplyFullImage(patchMissingFullImage, image);

         setFullGrid([...fullGrid]);
      }
   };
   useEffect(() => {
      if (fullGrid) {
         console.log('grid updated');
         util_debugGrid(fullGrid);

         // recursive loop to check for and apply full images to our patches
         checkForFullImages();
      }
   }, [fullGrid]);

   //// User interaction / onClick bindings \\\\
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
            gridStatus = util_gridFillRow(gridStatus, 1, false);
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

   let imageSizeAdjust = delta => {
      // TODO Get current centermost patch
      // TODO if not found try for one of the surrounding patches
      // TODO fall back to the first available patch in our grid

      // clear the current grid
      // assign our found patch to
      setImageSize(imageSize => imageSize + delta);
      console.log(delta);
   };

   //// Dynamic CSS styling \\\\
   const cssGridContainer = {
      display: 'grid',
      gridTemplateColumns: `${buttonSize}px ${imageSize * columns}px ${buttonSize}px`,
      gridTemplateRows: `${buttonSize}px ${imageSize * rows}px ${buttonSize}px`,
   };

   let gridLocationIsClickable = (columnIndex, rowIndex) => {
      // we should be over an empty patch
      if (fullGrid[columnIndex][rowIndex]) return false;

      // There should be at least one filled patch in some direction
      let surroundingPatches = util_gridGetSurroundingPatches(fullGrid, columnIndex, rowIndex);
      return (
         (surroundingPatches.northPatch && surroundingPatches.northPatch.objectStatus === 'ACT') ||
         (surroundingPatches.southPatch && surroundingPatches.southPatch.objectStatus === 'ACT') ||
         (surroundingPatches.eastPatch && surroundingPatches.eastPatch.objectStatus === 'ACT') ||
         (surroundingPatches.westPatch && surroundingPatches.westPatch.objectStatus === 'ACT')
      );
   };

   return (
      <div>
         <NavMenu>
            <NavItem>
               <NavLink href="#" className="text-dark" onClick={() => imageSizeAdjust(50)}>
                  <FontAwesomeIcon icon={faPlus} />
               </NavLink>
            </NavItem>
            <NavItem>
               <NavLink href="#" className="text-dark" onClick={() => imageSizeAdjust(-50)}>
                  <FontAwesomeIcon icon={faMinus} />
               </NavLink>
            </NavItem>
         </NavMenu>
         <div className="align-center" style={{ height: mainAreaHeight + 'px' }}>
            <div style={cssGridContainer}>
               <button
                  className="button-up alignCenter"
                  style={{ gridColumnStart: 2, gridColumnEnd: 3, gridRowStart: 1, gridRowEnd: 2 }}
                  onClick={() => moveGrid('up')}>
                  <FontAwesomeIcon icon={faAngleDoubleUp} />
               </button>
               <button
                  className="button-down alignCenter"
                  style={{ gridColumnStart: 2, gridColumnEnd: 3, gridRowStart: 3, gridRowEnd: 4 }}
                  onClick={() => moveGrid('down')}>
                  <FontAwesomeIcon icon={faAngleDoubleDown} />
               </button>
               <button
                  className="button-left alignCenter"
                  style={{ gridColumnStart: 1, gridColumnEnd: 2, gridRowStart: 2, gridRowEnd: 3 }}
                  onClick={() => moveGrid('left')}>
                  <FontAwesomeIcon icon={faAngleDoubleLeft} />
               </button>
               <button
                  className="button-right alignCenter"
                  style={{ gridColumnStart: 3, gridColumnEnd: 4, gridRowStart: 2, gridRowEnd: 3 }}
                  onClick={() => moveGrid('right')}>
                  <FontAwesomeIcon icon={faAngleDoubleRight} />
               </button>

               <div className="grid-flexbox-container" style={{ gridColumnStart: 2, gridColumnEnd: 3, gridRowStart: 2, gridRowEnd: 3 }}>
                  {fullGrid &&
                     fullGrid.map((column, i) => {
                        return (
                           <div className="column-container" key={column.map(item => item && item.patchId).join() + '-' + i}>
                              {column.map((patch, j) => (
                                 <img
                                    className={gridLocationIsClickable(i, j) ? 'patch-clickable' : ''}
                                    key={patch ? patch.patchId : `emptyPatch${i}-${j}`}
                                    src={patch ? patch.__src : placeholderImageCheckers}
                                    style={{ width: imageSize + 'px', height: imageSize + 'px' }}
                                    onClick={() => patchClick(patch, i, j)}
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
