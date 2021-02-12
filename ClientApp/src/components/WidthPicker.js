import React, { useEffect, useState } from 'react';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import ReactTooltip from 'react-tooltip';

export function WidthPicker({ width, setWidth }) {
   return (
      <>
         <div style={{ width: '120px' }} data-tip data-for="Width">
            <Slider
               min={3}
               max={83}
               step={10}
               defaultValue={width}
               snapToStep
               onChange={widthParam => setWidth(widthParam)}
               showValue={false}
            />
         </div>
         <ReactTooltip id="Width" place="bottom" type="dark" effect="solid" offset={{ bottom: 10 }}>
            <span>Width ({width - 3})</span>
         </ReactTooltip>
      </>
   );
}
