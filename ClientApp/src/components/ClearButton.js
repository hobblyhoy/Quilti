import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import { TooltipButton } from './TooltipButton';

export function ClearButton({ setBackground, hasInteractedWithCanvas, setHasInteractedWithCanvas }) {
   const [isOpen, setIsOpen] = useState(false);

   let clear = () => {
      setBackground(background => ({ ...background }));
      setHasInteractedWithCanvas(false);
      setIsOpen(false);
   };

   return (
      <div>
         {/* <Tooltip title="Clear All" arrow>
            <span onClick={() => setIsOpen(true)}>
               <button disabled={!hasInteractedWithCanvas} style={{ pointerEvents: 'none' }}>
                  <FontAwesomeIcon icon={faTrashAlt} />
               </button>
            </span>
         </Tooltip> */}
         <TooltipButton tooltip="Clear All" onClick={() => setIsOpen(true)} disabled={!hasInteractedWithCanvas}>
            <FontAwesomeIcon icon={faTrashAlt} />
         </TooltipButton>
         <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">Are you sure you want to clear?</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Your work of art will be entirely erased, are you sure you want to continue?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <button onClick={clear}>
                  <FontAwesomeIcon icon={faTrashAlt} /> Yes, clear it!
               </button>
               <button onClick={() => setIsOpen(false)}>No</button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
