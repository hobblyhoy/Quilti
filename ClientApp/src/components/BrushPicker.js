import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintBrush, faSprayCan, faDotCircle } from '@fortawesome/free-solid-svg-icons';

export function BrushPicker({ drawMode, setDrawMode }) {
   return (
      <div>
         <button
            onClick={() => setDrawMode('Pencil')}
            style={{ borderRadius: '5px', backgroundColor: drawMode === 'Pencil' ? 'lightgray' : '' }}>
            <FontAwesomeIcon icon={faPaintBrush} />
         </button>
         <button
            onClick={() => setDrawMode('Spray')}
            style={{ borderRadius: '5px', backgroundColor: drawMode === 'Spray' ? 'lightgray' : '' }}>
            <FontAwesomeIcon icon={faSprayCan} />
         </button>
         <button
            onClick={() => setDrawMode('Circle')}
            style={{ borderRadius: '5px', backgroundColor: drawMode === 'Circle' ? 'lightgray' : '' }}>
            <FontAwesomeIcon icon={faDotCircle} />
         </button>
      </div>
   );
}
