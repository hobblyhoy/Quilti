import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintBrush, faSprayCan, faDotCircle } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import { TooltipButton } from './TooltipButton';

export function BrushPicker({ drawMode, setDrawMode }) {
   return (
      <div>
         <TooltipButton tooltip="Brush" onClick={() => setDrawMode('Pencil')}></TooltipButton>
         <Tooltip title="Brush" arrow>
            <button
               onClick={() => setDrawMode('Pencil')}
               style={{ borderRadius: '5px', backgroundColor: drawMode === 'Pencil' ? 'lightgray' : '' }}>
               <FontAwesomeIcon icon={faPaintBrush} />
            </button>
         </Tooltip>
         <Tooltip title="Spray" arrow>
            <button
               onClick={() => setDrawMode('Spray')}
               style={{ borderRadius: '5px', backgroundColor: drawMode === 'Spray' ? 'lightgray' : '' }}>
               <FontAwesomeIcon icon={faSprayCan} />
            </button>
         </Tooltip>
         <Tooltip title="Dots" arrow>
            <button
               onClick={() => setDrawMode('Circle')}
               style={{ borderRadius: '5px', backgroundColor: drawMode === 'Circle' ? 'lightgray' : '' }}>
               <FontAwesomeIcon icon={faDotCircle} />
            </button>
         </Tooltip>
      </div>
   );
}
