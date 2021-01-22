import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';

export function Counter() {
   useEffect(() => {
      const canvas = new fabric.Canvas('canvas', {
         width: 500,
         height: 500,
         backgroundColor: 'grey',
      });

      let mousePressed = false;
      canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
      canvas.freeDrawingBrush.width = 12;
      canvas.freeDrawingBrush.color = 'red';
      canvas.renderAll();

      canvas.on('mouse:move', () => {
         if (mousePressed) {
            canvas.isDrawingMode = true;
            canvas.renderAll();
         }
      });

      canvas.on('mouse:down', event => {
         mousePressed = true;
         //canvas.setCursor('grab');
         canvas.renderAll();
      });

      canvas.on('mouse:up', event => {
         mousePressed = false;
         //canvas.setCursor('default');
         canvas.renderAll();
      });
   }, []);

   return (
      <div>
         <canvas id="canvas"></canvas>
      </div>
   );
}
