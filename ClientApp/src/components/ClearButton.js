import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { TooltipButton } from './TooltipButton';

export function ClearButton({ disabled, clear }) {
   const [isOpen, setIsOpen] = useState(false);

   let click = () => {
      setIsOpen(false);
      clear();
   };

   return (
      <div>
         <TooltipButton tooltip="Clear All" onClick={() => setIsOpen(true)} disabled={disabled}>
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
               <button onClick={click}>
                  <FontAwesomeIcon icon={faTrashAlt} /> Yes, clear it!
               </button>
               <button onClick={() => setIsOpen(false)}>No</button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
