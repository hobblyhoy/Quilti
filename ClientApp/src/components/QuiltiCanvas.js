import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';

export function QuiltiCanvas({ color, width, drawMode, background, canvasState, setCanvasState }) {
   const [canvas, setCanvas] = useState();
   const [eventListenerAttached, setEventListenerAttached] = useState(false);

   useEffect(() => {
      setCanvas(
         new fabric.Canvas('canvas', {
            width: 500,
            height: 500,
            backgroundColor: background.color,
            isDrawingMode: true,
         })
      );
   }, []);

   useEffect(() => {
      if (canvas && !eventListenerAttached) {
         canvas.on('mouse:up', event => {
            setCanvasState(JSON.stringify(canvas));
         });
         setCanvasState(JSON.stringify(canvas));
         setEventListenerAttached(true);
      }
   }, [canvas]);
   useEffect(() => {
      // If we've been pipped in a new canvasState then apply it
      if (canvas && canvasState && JSON.stringify(canvas) != canvasState) {
         console.log('parent updated canvas state');
         canvas.loadFromJSON(canvasState, () => canvas.renderAll());
      }
   }, [canvasState]);

   useEffect(() => {
      if (!canvas) return;
      console.log({ color, width, drawMode });

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