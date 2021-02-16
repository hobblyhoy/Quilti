import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function GeneralDialog() {
   const [isOpen, setIsOpen] = useState(false);
   const [title, setTitle] = useState();
   const [message, setMessage] = useState();

   useEffect(() => {
      window.QuiltiDialog = (title, message) => {
         setTitle(title);
         setMessage(message);
      };
   }, []);

   useEffect(() => {
      if (title && message) setIsOpen(true);
   }, [title, message]);

   let onClose = () => {
      setIsOpen(false);
      setMessage('');
      setTitle('');
   };

   return (
      <Dialog open={isOpen} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
         <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
         <DialogContent>
            <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
         </DialogContent>
         <DialogActions>
            <button onClick={onClose}>OK</button>
         </DialogActions>
      </Dialog>
   );
}
