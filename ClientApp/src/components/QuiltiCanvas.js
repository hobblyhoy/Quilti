import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';

export function QuiltiCanvas({ color, width, drawMode, background, setHasInteractedWithCanvas, size }) {
   const [canvas, setCanvas] = useState();

   useEffect(() => {
      setCanvas(
         new fabric.Canvas('canvas', {
            width: size,
            height: size,
            backgroundColor: background.color,
            isDrawingMode: true,
         })
      );
   }, []);

   useEffect(() => {
      if (canvas) {
         canvas.on('mouse:up', event => {
            setHasInteractedWithCanvas(true);
         });
      }
   }, [canvas]);

   useEffect(() => {
      if (!canvas) return;

      canvas.freeDrawingBrush = new fabric[drawMode + 'Brush'](canvas);
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = width;
      canvas.renderAll();
   }, [color, width, drawMode, canvas]);

   useEffect(() => {
      if (!canvas) return;

      canvas.clear();
      canvas.setBackgroundColor(background.color);
   }, [background]);

   return <canvas id="canvas"></canvas>;
}
