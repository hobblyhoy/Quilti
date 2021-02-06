import React, { useEffect, useState } from 'react';
import { Slider } from 'office-ui-fabric-react/lib/Slider';

export function WidthPicker({ width, setWidth }) {
   return (
      <div style={{ width: '120px' }}>
         <Slider min={3} max={83} step={10} defaultValue={43} snapToStep onChange={widthParam => setWidth(widthParam)} showValue={false} />
      </div>
   );
}
