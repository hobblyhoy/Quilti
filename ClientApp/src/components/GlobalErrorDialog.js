import React, { Component, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function GlobalErrorDialog() {
   const [errorCode, setErrorCode] = useState(null);
   const [isOpen, setIsOpen] = useState(false);

   const errorText = {
      403: 'We only allow you to create a limited number of Patches per hour. Try again later!',
      409: 'Oops, there was a problem working with this patch of the quilt right now. Please refresh or try a different patch.',
   };

   useEffect(() => {
      console.log('building global handler');
      window.QuiltiError = code => {
         setErrorCode(code);
      };
   }, []);

   useEffect(() => {
      if (errorCode) setIsOpen(true);
   }, [errorCode]);
   useEffect(() => {
      if (isOpen === false) setErrorCode(null);
   }, [isOpen]);

   return (
      <Dialog
         open={isOpen}
         onClose={() => setIsOpen(false)}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description">
         <DialogTitle id="alert-dialog-title">
            <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: 'red', marginRight: '10px' }} />
            Something went wrong..
         </DialogTitle>
         <DialogContent>
            <DialogContentText id="alert-dialog-description">
               {errorText[errorCode] || 'An unknown error occurred. Please refresh and try again.'}
            </DialogContentText>
         </DialogContent>
         <DialogActions>
            <button onClick={() => setIsOpen(false)}>OK</button>
         </DialogActions>
      </Dialog>
   );
}
