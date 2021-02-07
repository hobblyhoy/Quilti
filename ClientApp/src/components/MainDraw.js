import React, { useEffect, useState } from 'react';
import { NavMenu } from './NavMenu';
import { QuiltiCanvas } from './QuiltiCanvas';
import { BrushPicker } from './BrushPicker';
import { ColorPicker } from './ColorPicker';
import { NavItem, NavLink } from 'reactstrap';
import { useParams, useHistory } from 'react-router-dom';
import './Global.css';
import { db_init } from '../DB';
import { util_debugGrid, util_gridInitialize, util_patchCoordinatesFromPatchId, util_gridFirstOrDefault } from '../Utilities';
import { api_getPatchIdsInRange, api_getPatchDec, api_getPatchImage, api_completePatch } from '../API';
import { debounce } from 'lodash';
import { WidthPicker } from './WidthPicker';
import { ClearButton } from './ClearButton';
import { DoneButton } from './DoneButton';

export function MainDraw() {
   const { patchIdParam } = useParams();
   const [mainAreaHeight, setMainAreaHeight] = useState(1);
   const [mainAreaWidth, setMainAreaWidth] = useState(1);
   const [dbIsInitialized, setDbIsInitialized] = useState(false);
   const [patchIdsInRange, setPatchIdsInRange] = useState(null);
   const [fullGrid, setFullGrid] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const history = useHistory();
   // Canvas
   const [color, setColor] = useState('#DB3E00');
   const [width, setWidth] = useState(43);
   const [drawMode, setDrawMode] = useState('Pencil');
   const [background, setBackground] = useState({ color: 'lightgray' });
   const [hasInteractedWithCanvas, setHasInteractedWithCanvas] = useState(false);

   //// Init \\\\
   useEffect(() => {
      (async () => {
         console.log('init');
         if (!dbIsInitialized) {
            db_init();
            // only needed because of HMR, if this is a prod build we can pull it out
            setDbIsInitialized(true);
         }

         setMainAreaHeight(window.innerHeight - document.getElementById('nav').offsetHeight);
         setMainAreaWidth(window.innerWidth);

         let pcfp = util_patchCoordinatesFromPatchId(patchIdParam);
         setPatchIdsInRange(await api_getPatchIdsInRange(pcfp.x - 1, pcfp.x + 1, pcfp.y + 1, pcfp.y - 1));
      })();
   }, []);

   // Stage 1-A surroundingPatchesList callback \\
   useEffect(() => {
      if (!patchIdsInRange) return;
      (async () => {
         console.log('surroundingPatchesList');
         console.log({ surroundingPatchesList: patchIdsInRange });

         let pcfp = util_patchCoordinatesFromPatchId(patchIdParam);
         let grid = util_gridInitialize(3, 3, pcfp.x - 1, pcfp.y + 1);
         util_debugGrid(grid);

         // Fill in all the ones that we know contain something
         await Promise.all(
            patchIdsInRange.map(async patchId => {
               let patchDecInGridMeta = util_gridFirstOrDefault(grid, p => p.patchId === patchId);
               let patchDecFromApi = await api_getPatchDec(patchDecInGridMeta.patch.patchId);
               grid[patchDecInGridMeta.columnIndex][patchDecInGridMeta.rowIndex] = patchDecFromApi;
            })
         );

         // Check if the patch we're supposed to be drawing is already completed (user might have hit back button after submitting)
         if (grid[1][1].status === 'ACT') history.replace('/view/' + patchIdParam);

         console.log('Initial grid:');
         util_debugGrid(grid);
         console.log({ grid });
         setFullGrid(grid);
      })();
   }, [patchIdsInRange]);

   // Stage 2-A fullGrid Callback \\
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
   let resizeEventDebounced = debounce(() => {
      setMainAreaHeight(window.innerHeight - document.getElementById('nav').offsetHeight);
      setMainAreaWidth(window.innerWidth);
   }, 50);
   useEffect(() => {
      window.addEventListener('resize', resizeEventDebounced);
      return () => {
         window.removeEventListener('resize', resizeEventDebounced);
      };
   }, []);

   let save = async () => {
      let canvasEl = document.getElementById('canvas');

      //construct an off-screen canvas for building a mini version of our image
      let imageUncompressed = canvasEl.toDataURL();
      let image = canvasEl.toDataURL('image/jpeg', 0.5);

      // Construct a placeholder image
      let imageObj = new Image();
      imageObj.src = imageUncompressed;
      await imageObj.decode();

      // convert out image object into a canvas, and compress it down
      let miniCanvas = document.createElement('canvas');
      let miniCtx = miniCanvas.getContext('2d');
      miniCanvas.width = 100;
      miniCanvas.height = 100;
      miniCtx.drawImage(imageObj, 0, 0, 100, 100);
      var imageMini = miniCanvas.toDataURL('image/jpeg', 0.1);

      // Patch up the Patch
      let respPatchId = await api_completePatch(patchIdParam, image, imageMini);
      history.push('/view/' + respPatchId);
   };

   //// Dynamic CSS styling / display aids \\\\
   let calculateFullGridClass = (column, row) => {
      let ret = '';
      switch (column) {
         case 0:
            ret += 'column-left grid-right-align ';
            break;
         case 1:
            ret += 'column-mid ';
            break;
         case 2:
            ret += 'column-right grid-left-align ';
            break;
         default:
            throw 'bad column in calculateFullGridClass';
      }

      switch (row) {
         case 0:
            ret += 'row-top grid-bottom-align ';
            break;
         case 1:
            ret += 'row-mid ';
            break;
         case 2:
            ret += 'row-bottom grid-top-align ';
            break;
         default:
            throw 'bad row in calculateFullGridClass';
      }

      return ret;
   };

   return (
      <div>
         <NavMenu>
            <NavItem>
               <NavLink href="#" className="text-dark">
                  <DoneButton save={save} hasInteractedWithCanvas={hasInteractedWithCanvas} />
               </NavLink>
            </NavItem>
            <NavItem>
               <NavLink href="#" className="text-dark">
                  <ClearButton
                     setBackground={setBackground}
                     hasInteractedWithCanvas={hasInteractedWithCanvas}
                     setHasInteractedWithCanvas={setHasInteractedWithCanvas}
                  />
               </NavLink>
            </NavItem>
            <NavItem>
               <NavLink href="#" className="text-dark">
                  <ColorPicker color={color} setColor={setColor} />
               </NavLink>
            </NavItem>
            <NavItem>
               <NavLink href="#" className="text-dark">
                  <BrushPicker drawMode={drawMode} setDrawMode={setDrawMode} />
               </NavLink>
            </NavItem>
            <NavItem>
               <NavLink href="#" className="text-dark">
                  <WidthPicker width={width} setWidth={setWidth} />
               </NavLink>
            </NavItem>
         </NavMenu>
         <div className="force-center" style={{ height: mainAreaHeight + 'px', width: mainAreaWidth + 'px' }}>
            <div className="layout-container">
               {fullGrid &&
                  fullGrid.map((column, i) => {
                     return column.map((patch, j) => {
                        return i === 1 && j == 1 ? (
                           // Our canvas
                           <QuiltiCanvas
                              key={patch.patchId}
                              color={color}
                              width={width}
                              drawMode={drawMode}
                              background={background}
                              setHasInteractedWithCanvas={setHasInteractedWithCanvas}
                           />
                        ) : (
                           // The 8 surrounding patches
                           <div key={patch.patchId} className={calculateFullGridClass(i, j)}>
                              <img src={patch.src} />
                           </div>
                        );
                     });
                  })}
            </div>
         </div>
      </div>
   );
}
