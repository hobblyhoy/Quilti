import React, { useEffect, useState } from 'react';
import {
   util_calculateAllowableGridRoom,
   util_debugGrid,
   util_gridColumnCount,
   util_gridRowCount,
   util_gridInitialize,
   util_gridFirstOrDefault,
} from '../Utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   faAngleDoubleUp,
   faAngleDoubleDown,
   faAngleDoubleLeft,
   faAngleDoubleRight,
   faPlus,
   faMinus,
   faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { db_init } from '../DB';
import placeholderImageCheckers from '../assets/checkers.js';
import placeholderImageReserved from '../assets/reserved.js';
import './MainView.css';
import { NavMenu } from './NavMenu';
import { NavItem, NavLink } from 'reactstrap';
import { useParams, useHistory } from 'react-router-dom';
import { api_getInitialPatchDec, api_getPatchDec, api_getPatchIdsInRange, api_getPatchImage, api_reservePatch } from '../API';

export function MainView() {
   const [dbIsInitialized, setDbIsInitialized] = useState(false);
   const [imageSize, setImageSize] = useState(null);
   const [fullGridCoordinates, setFullGridCoordinates] = useState(null);
   const [fullGrid, setFullGrid] = useState(null);
   const { patchIdParam } = useParams();
   const history = useHistory();
   // Layout aids
   const [mainAreaHeight, setMainAreaHeight] = useState(1);
   const [buttonSize, setButtonSize] = useState(30);
   const [isLoading, setIsLoading] = useState(true);

   //// Main process flow \\\\
   // https://app.creately.com/diagram/XnWD2VGuOky/edit
   // We daisy chain through stages 0 => 3, the tail of each kicking off the next, each stage dependant on the one before it.
   // We break it into stages so that our user interaction can pipe in at key points and kick off just the remainder of the chain

   // Stage 0 - Init \\
   useEffect(() => {
      (async () => {
         console.log('init');
         if (!dbIsInitialized) {
            db_init();
            // only needed because of HMR, if this is a prod build we can pull it out
            setDbIsInitialized(true);
         }

         // Determine the suitable starting imageSize based on fitting a minimum of 2 rows/columns in users current screen
         let imageSizeTemp = 400;
         let gridColumns = 0;
         let gridRows = 0;
         while (gridColumns < 2 || gridRows < 2) {
            imageSizeTemp = imageSizeTemp / 2;
            ({ gridColumns, gridRows } = util_calculateAllowableGridRoom(buttonSize, imageSizeTemp, 100));
         }
         setImageSize(imageSizeTemp);
      })();
   }, []);

   // Stage 1 - imageSize callback \\
   useEffect(() => {
      if (!imageSize) return;
      (async () => {
         console.log('imageSizeCallback');

         setMainAreaHeight(window.innerHeight - document.getElementById('nav').offsetHeight);

         let initialPatchDec;
         if (patchIdParam) {
            // coming in from /view/x page
            initialPatchDec = await api_getPatchDec(patchIdParam);
         } else if (fullGrid) {
            // on user image size adjustment, grab the closest one to the center
            let column = Math.floor(util_gridColumnCount(fullGrid) / 2);
            let row = Math.floor(util_gridRowCount(fullGrid) / 2);
            initialPatchDec = fullGrid[column][row];
         } else {
            // initial load
            initialPatchDec = await api_getInitialPatchDec();
         }

         // Figure out the size of our grid and the appropriate global coordinates
         let { gridColumns, gridRows } = util_calculateAllowableGridRoom(buttonSize, imageSize, 100);

         let leftX = initialPatchDec.x - Math.floor(gridColumns / 2);
         let rightX = leftX + gridColumns - 1;
         let topY = initialPatchDec.y + Math.floor(gridRows / 2);
         let bottomY = topY - gridRows + 1;
         setFullGridCoordinates({ leftX, rightX, topY, bottomY });
      })();
   }, [imageSize]);

   // Stage 2 - fullGridCoordinates Callback \\
   useEffect(() => {
      if (!fullGridCoordinates) return;
      (async () => {
         console.log('fullGridCoordinatesCallback');

         let patchIdsInRangeAwaited = api_getPatchIdsInRange(
            fullGridCoordinates.leftX,
            fullGridCoordinates.rightX,
            fullGridCoordinates.topY,
            fullGridCoordinates.bottomY
         );

         let columnCount = fullGridCoordinates.rightX - fullGridCoordinates.leftX + 1;
         let rowCount = fullGridCoordinates.topY - fullGridCoordinates.bottomY + 1;

         // Build the empty grid
         let grid = util_gridInitialize(columnCount, rowCount, fullGridCoordinates.leftX, fullGridCoordinates.topY);
         util_debugGrid(grid);

         // Finish waiting for the request to come back
         let patchIdsInRange = await patchIdsInRangeAwaited;

         // Fill in all the ones that we know contain something
         await Promise.all(
            patchIdsInRange.map(async patchId => {
               //console.log('Starting to get patch...', patchId); //check for parallelism
               let patchDecInGridMeta = util_gridFirstOrDefault(grid, p => p.patchId === patchId);
               let patchDecFromApi = await api_getPatchDec(patchDecInGridMeta.patch.patchId);
               grid[patchDecInGridMeta.columnIndex][patchDecInGridMeta.rowIndex] = patchDecFromApi;
               //console.log('Finished setting patch...', patchId);
            })
         );

         console.log('About to set fullGrid');
         util_debugGrid(grid);
         setFullGrid(grid);
      })();
   }, [fullGridCoordinates]);

   // Stage 3 - fullGrid Callback \\
   useEffect(() => {
      if (!fullGrid) return;
      (async () => {
         setIsLoading(false);
         let result = util_gridFirstOrDefault(fullGrid, patch => patch.status === 'partial');
         let patchDecMissingFullImage = result && result.patch;
         if (patchDecMissingFullImage) {
            let image = await api_getPatchImage(patchDecMissingFullImage.patchId);
            patchDecMissingFullImage.src = image;
            patchDecMissingFullImage.status = 'full';
            console.log('Updated full image on', patchDecMissingFullImage.patchId);
            setFullGrid([...fullGrid]);

            util_debugGrid(fullGrid);
         }
      })();
   }, [fullGrid]);

   //// User interaction / onClick bindings \\\\
   let patchClick = async patch => {
      if (!gridLocationIsClickable(patch)) return;

      // TODO check for an error here, if we hit one display some kind of message about it already being reserved and retrigger the grid load
      //
      console.log({ patch });
      let reservedPatch = await api_reservePatch(patch.patchId);
      history.push('/draw/' + reservedPatch);
   };

   let imageSizeAdjustClick = factor => {
      // Ensure we're not beyond our fixed min/max and that we have room for this size grid
      let newImageSize = factor > 0 ? imageSize * 2 : imageSize / 2;
      if (newImageSize < 50 || newImageSize > 800) return;
      let allowableGridRoom = util_calculateAllowableGridRoom(buttonSize, newImageSize, 100);
      if (allowableGridRoom.gridColumns < 2 || allowableGridRoom.gridRows < 2) return;

      setIsLoading(true);
      console.log('Changing image size from, to...', imageSize, newImageSize);
      setImageSize(newImageSize);
   };

   let moveGridClick = direction => {
      let coordinates = { ...fullGridCoordinates };
      switch (direction) {
         case 'up':
            coordinates.topY++;
            coordinates.bottomY++;
            break;
         case 'down':
            coordinates.topY--;
            coordinates.bottomY--;
            break;
         case 'left':
            coordinates.leftX--;
            coordinates.rightX--;
            break;
         case 'right':
            coordinates.leftX++;
            coordinates.rightX++;
            break;
      }
      setFullGridCoordinates(coordinates);
   };

   // TODO resize events, heavily debounced

   //// Dynamic CSS styling / display aids \\\\
   const cssGridContainer = {
      display: 'grid',
      gridTemplateColumns: fullGrid ? `${buttonSize}px ${imageSize * util_gridColumnCount(fullGrid)}px ${buttonSize}px` : '',
      gridTemplateRows: fullGrid ? `${buttonSize}px ${imageSize * util_gridRowCount(fullGrid)}px ${buttonSize}px` : '',
   };

   const fullGridContainer = {
      display: 'flex',
      width: fullGrid ? imageSize * util_gridColumnCount(fullGrid) : 0,
      height: fullGrid ? imageSize * util_gridRowCount(fullGrid) : 0,
   };

   let gridLocationIsClickable = patch => {
      return patch.status === 'empty';
   };

   return (
      <div>
         <NavMenu>
            <NavItem>
               <NavLink href="#" className="text-dark" onClick={() => imageSizeAdjustClick(1)}>
                  <FontAwesomeIcon icon={faPlus} />
               </NavLink>
            </NavItem>
            <NavItem>
               <NavLink href="#" className="text-dark" onClick={() => imageSizeAdjustClick(-1)}>
                  <FontAwesomeIcon icon={faMinus} />
               </NavLink>
            </NavItem>
         </NavMenu>
         <div className="align-center" style={{ height: mainAreaHeight + 'px' }}>
            {isLoading ? (
               <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
               <div style={cssGridContainer}>
                  <button
                     className="button-up alignCenter"
                     style={{ gridColumnStart: 2, gridColumnEnd: 3, gridRowStart: 1, gridRowEnd: 2 }}
                     onClick={() => moveGridClick('up')}>
                     <FontAwesomeIcon icon={faAngleDoubleUp} />
                  </button>
                  <button
                     className="button-down alignCenter"
                     style={{ gridColumnStart: 2, gridColumnEnd: 3, gridRowStart: 3, gridRowEnd: 4 }}
                     onClick={() => moveGridClick('down')}>
                     <FontAwesomeIcon icon={faAngleDoubleDown} />
                  </button>
                  <button
                     className="button-left alignCenter"
                     style={{ gridColumnStart: 1, gridColumnEnd: 2, gridRowStart: 2, gridRowEnd: 3 }}
                     onClick={() => moveGridClick('left')}>
                     <FontAwesomeIcon icon={faAngleDoubleLeft} />
                  </button>
                  <button
                     className="button-right alignCenter"
                     style={{ gridColumnStart: 3, gridColumnEnd: 4, gridRowStart: 2, gridRowEnd: 3 }}
                     onClick={() => moveGridClick('right')}>
                     <FontAwesomeIcon icon={faAngleDoubleRight} />
                  </button>

                  <div style={{ gridColumnStart: 2, gridColumnEnd: 3, gridRowStart: 2, gridRowEnd: 3, ...fullGridContainer }}>
                     {fullGrid.map((column, i) => {
                        return (
                           <div className="column-container" key={column.map(item => item && item.patchId).join() + '-' + i}>
                              {column.map((patch, j) => (
                                 <img
                                    className={gridLocationIsClickable(patch) ? 'patch-clickable' : ''}
                                    key={patch.patchId}
                                    src={patch.src}
                                    style={{ width: imageSize + 'px', height: imageSize + 'px' }}
                                    onClick={() => patchClick(patch)}
                                 />
                              ))}
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
