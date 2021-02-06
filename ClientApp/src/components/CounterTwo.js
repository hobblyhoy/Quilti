import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { GithubPicker } from 'react-color';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { QuiltiCanvas } from './QuiltiCanvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencilAlt, faSprayCan, faDotCircle } from '@fortawesome/free-solid-svg-icons';

export function CounterTwo() {
   const [color, setColor] = useState('#DB3E00');
   const [width, setWidth] = useState(43);
   const [drawMode, setDrawMode] = useState('Pencil');
   const [background, setBackground] = useState({ color: 'lightgray' });

   return (
      <div>
         <div>
            <QuiltiCanvas color={color} width={width} drawMode={drawMode} background={background} />
         </div>
         {color && width && drawMode && (
            <div>
               <button onClick={() => setBackground({ ...background })}>
                  Clear <FontAwesomeIcon icon={faTrashAlt} />
               </button>
               <button onClick={() => setDrawMode('Pencil')}>
                  Pencil <FontAwesomeIcon icon={faPencilAlt} />
               </button>
               <button onClick={() => setDrawMode('Spray')}>
                  Spray <FontAwesomeIcon icon={faSprayCan} />
               </button>
               <button onClick={() => setDrawMode('Circle')}>
                  Circle <FontAwesomeIcon icon={faDotCircle} />
               </button>
               <GithubPicker color={color} onChangeComplete={colorParam => setColor(colorParam.hex)} triangle="top-left" />
               <div style={{ width: '120px' }}>
                  <Slider
                     min={3}
                     max={83}
                     step={10}
                     defaultValue={43}
                     snapToStep
                     onChange={widthParam => setWidth(widthParam)}
                     showValue={false}
                  />
               </div>
            </div>
         )}
      </div>
   );
}
