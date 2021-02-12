import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

export function TooltipButton({ tooltip, onClick, disabled, children, buttonStyle }) {
   return (
      <>
         <button onClick={onClick} disabled={disabled} data-tip data-for={tooltip} style={buttonStyle}>
            {children}
         </button>
         <ReactTooltip id={tooltip} place="bottom" type="dark" effect="solid" offset={{ bottom: 10 }}>
            <span>{tooltip}</span>
         </ReactTooltip>
      </>
   );
}
