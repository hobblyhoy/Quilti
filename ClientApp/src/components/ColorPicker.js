import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { GithubPicker } from 'react-color';

export function ColorPicker({ color, setColor }) {
   const [isOpen, setIsOpen] = useState(false);

   let chooseColor = color => {
      setIsOpen(false);
      setColor(color);
   };

   let colors = [
      '#2C2C2C',
      '#B80000',
      '#DB3E00',
      '#FCCB00',
      '#008B02',
      '#006B76',
      '#1273DE',
      '#004DCF',
      '#5300EB',
      // Row 2
      '#D3D3D3',
      '#EB9694',
      '#FAD0C3',
      '#FEF3BD',
      '#C1E1C5',
      '#BEDADC',
      '#C4DEF6',
      '#BED3F3',
      '#D4C4FB',
   ];

   return (
      <div style={{ position: 'relative' }}>
         <button onClick={() => setIsOpen(isOpen => !isOpen)}>
            <FontAwesomeIcon icon={faSquare} style={{ color: color }} />
         </button>
         {isOpen && (
            <div style={{ position: 'absolute', left: '-5px', top: '35px' }}>
               <GithubPicker
                  width={238}
                  colors={colors}
                  color={color}
                  onChangeComplete={colorParam => chooseColor(colorParam.hex)}
                  triangle="top-left"
               />
            </div>
         )}
      </div>
   );
}
