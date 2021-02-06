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

   return (
      <div style={{ position: 'relative' }}>
         <button onClick={() => setIsOpen(isOpen => !isOpen)}>
            <FontAwesomeIcon icon={faSquare} style={{ color: color }} />
         </button>
         {isOpen && (
            <div style={{ position: 'absolute', left: '-5px', top: '35px' }}>
               <GithubPicker color={color} onChangeComplete={colorParam => chooseColor(colorParam.hex)} triangle="top-left" />
            </div>
         )}
      </div>
   );
}
