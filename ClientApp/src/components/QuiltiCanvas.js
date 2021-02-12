import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import blankCanvas from '../assets/blankCanvas';

export function QuiltiCanvas({ color, width, drawMode, background, size, canvasState, setCanvasStateHistory, canvasRef }) {
   const [canvas, setCanvas] = useState();
   const [eventListenerAttached, setEventListenerAttached] = useState(false);

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
      if (canvas && !eventListenerAttached) {
         canvasRef.current = canvas;
         canvas.on('mouse:up', event => {
            canvas.renderAll();
            // Wait for next tick as the new path the user just draw has not been rendered onto the canvas yet
            setTimeout(() => {
               let canvasImage = canvas.toDataURL();
               let historyItemsToKeep = 128; //equates to about 10mb cap in memory usage
               setCanvasStateHistory(canvasStateHistory => [...canvasStateHistory.slice(historyItemsToKeep * -1), canvasImage]);
            }, 0);
         });
         // Assign initial, blank state
         setTimeout(() => setCanvasStateHistory([blankCanvas]), 0);
         setEventListenerAttached(true);
      }
   }, [canvas]);

   useEffect(() => {
      // If we've been pipped in a new canvasState then apply it
      if (canvas && canvasState && canvasState.state) {
         fabric.Image.fromURL(canvasState.state, img => {
            img.set({ left: 0, top: 0, width: size, height: size });
            canvas.add(img);
         });
      }
   }, [canvasState]);

   useEffect(() => {
      if (!canvas) return;

      canvas.freeDrawingBrush = new fabric[drawMode + 'Brush'](canvas);
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = width;
      canvas.renderAll();
   }, [color, width, drawMode, canvas]);

   useEffect(() => {
      if (!canvas || !background) return;

      canvas.clear();
      canvas.setBackgroundColor(background.color);
      setTimeout(() => setCanvasStateHistory([blankCanvas]), 0);
   }, [background]);

   return <canvas id="canvas"></canvas>;
}
