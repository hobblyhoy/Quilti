import React, { useEffect, useState } from 'react';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import Tooltip from '@material-ui/core/Tooltip';

export function WidthPicker({ width, setWidth }) {
   return (
      <Tooltip title={`Brush Width (${width - 3})`} arrow>
         <div style={{ width: '120px' }}>
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
      </Tooltip>
   );
}
