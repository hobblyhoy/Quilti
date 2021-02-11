import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndoAlt } from '@fortawesome/free-solid-svg-icons';
import { TooltipButton } from './TooltipButton';

export function UndoButton({ canvasStateHistory, undo }) {
   return (
      <div>
         <TooltipButton tooltip="Undo" onClick={undo} disabled={canvasStateHistory.length < 2}>
            <FontAwesomeIcon icon={faUndoAlt} />
         </TooltipButton>
      </div>
   );
}
