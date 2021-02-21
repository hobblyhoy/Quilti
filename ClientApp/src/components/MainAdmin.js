import React, { useEffect, useState } from 'react';
import { NavMenu } from './NavMenu';
import axios from 'axios';
import { TextField } from '@material-ui/core';

export function MainAdmin() {
   const [patchId, setPatchId] = useState('');
   const [patchImage, setPatchImage] = useState(null);
   const [creatorIp, setCreatorIp] = useState('');
   const [reqStatus, setReqStatus] = useState('');

   useEffect(() => {
      (async () => {})();
   }, []);

   let checkImage = async () => {
      setPatchImage(null);
      setReqStatus('');
      let resp = await axios.get('/api/Patch/' + patchId);
      setPatchImage(resp.data.imageMini);
   };

   useEffect(() => {
      setPatchImage(null);
   }, [patchId]);

   let banUser = async () => {
      console.error('TODO');
   };

   let removeImage = async () => {
      let resp = await axios.delete('/api/Patch/' + patchId + '/' + creatorIp);
      console.log({ resp });
      setReqStatus(resp.status);
   };

   let fieldMargin = { marginTop: '3rem' };

   return (
      <div style={{ margin: '1rem' }}>
         <NavMenu></NavMenu>
         <div>Because we cant have nice things.</div>
         <div style={fieldMargin}>
            <TextField label="IP" value={creatorIp} onChange={e => setCreatorIp(e.target.value)} />
            <TextField label="ID" value={patchId} onChange={e => setPatchId(e.target.value)} />
         </div>
         <div style={fieldMargin}>
            <button onClick={checkImage}>Check Image</button>
            {patchImage && <img src={patchImage} width="100" height="100" />}
         </div>
         <div style={fieldMargin}>
            <button onClick={banUser} disabled={!patchImage}>
               Ban User
            </button>
         </div>
         <div style={fieldMargin}>
            <button onClick={removeImage} disabled={!patchImage}>
               Remove Image
            </button>
         </div>
         <div style={fieldMargin}>{reqStatus}</div>
      </div>
   );
}
