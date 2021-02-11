import React, { useEffect, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';

export function TooltipButton({ tooltip, onClick, disabled, children }) {
   // I know this span wrapper / pointerEvents on button is weird.
   // It solves a bug in Material Tooltips when you aren't using the Material specific <Button>
   // and the button is disableable
   return (
      <Tooltip title={tooltip} arrow>
         <span className="button" onClick={() => !disabled && onClick()}>
            <button disabled={disabled} style={{ pointerEvents: 'none' }}>
               {children}
            </button>
         </span>
      </Tooltip>
   );
}
