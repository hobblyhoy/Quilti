import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintBrush, faSprayCan, faDotCircle } from '@fortawesome/free-solid-svg-icons';
import { TooltipButton } from './TooltipButton';

export function BrushPicker({ drawMode, setDrawMode }) {
   return (
      <div>
         <TooltipButton
            tooltip="Brush"
            onClick={() => setDrawMode('Pencil')}
            buttonStyle={{ backgroundColor: drawMode === 'Pencil' ? 'lightgray' : '' }}>
            <FontAwesomeIcon icon={faPaintBrush} />
         </TooltipButton>

         <TooltipButton
            tooltip="Spray"
            onClick={() => setDrawMode('Spray')}
            buttonStyle={{ backgroundColor: drawMode === 'Spray' ? 'lightgray' : '' }}>
            <FontAwesomeIcon icon={faSprayCan} />
         </TooltipButton>

         <TooltipButton
            tooltip="Dots"
            onClick={() => setDrawMode('Circle')}
            buttonStyle={{ backgroundColor: drawMode === 'Circle' ? 'lightgray' : '' }}>
            <FontAwesomeIcon icon={faDotCircle} />
         </TooltipButton>
      </div>
   );
}
