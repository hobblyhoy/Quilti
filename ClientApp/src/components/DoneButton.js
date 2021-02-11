import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import { TooltipButton } from './TooltipButton';

export function DoneButton({ save, hasInteractedWithCanvas }) {
   const [isOpen, setIsOpen] = useState(false);

   let clear = () => {
      save();
      setIsOpen(false);
   };

   return (
      <div>
         <TooltipButton tooltip="Finished" onClick={() => setIsOpen(true)} disabled={!hasInteractedWithCanvas}>
            <FontAwesomeIcon icon={faSave} />
         </TooltipButton>
         <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">Are you all finished?</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  You're about to permanently submit your artwork to the Quilt- Are you all done?
               </DialogContentText>
               <DialogContentText>
                  Remember to add something near the edges to give your neighboring artists something to work with!
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <button onClick={clear}>
                  <FontAwesomeIcon icon={faSave} /> I'm Done!
               </button>
               <button onClick={() => setIsOpen(false)}>No</button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
