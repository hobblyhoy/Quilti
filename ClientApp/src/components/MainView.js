import axios from 'axios';
import React, { useEffect, useState } from 'react';

export function MainView() {
   useEffect(() => {
      // Initial load
      // Make a request for the first item
      axios.get('/api/Patch').then(resp => {
         let initialPatch = resp.data;
         let imageSize = 200;
         let buttonBuffer = 2 * 20;
         let navBuffer = 100; //hard code just for POC
         let gridColumns = Math.floor((window.innerWidth - buttonBuffer) / imageSize);
         let gridRows = Math.floor((window.innerHeight - buttonBuffer - navBuffer) / imageSize);

         //
         let grid = [];
         for (let i = 0; i < gridColumns; i++) {
            let row = [];
            for (let j = 0; j < gridRows; j++) {
               //row.push(i + '-' + j);
               row.push(null);
            }
            grid.push(row);
         }

         let gridColumnIndex;
         let gridRowIndex;
         if (!initialPatch.northPatchId) {
            gridColumnIndex = Math.floor(gridColumns / 2);
            gridRowIndex = gridRows > 1 ? 1 : 0;
         } //TODO the rest of these..

         grid[gridColumnIndex][gridRowIndex] = initialPatch;

         let transpose = m => m[0].map((x, i) => m.map(x => x[i]));
         console.table(transpose(grid));
      });
   }, []);

   return <div style={{ height: '100%' }}>Hi this is the main view</div>;
}
