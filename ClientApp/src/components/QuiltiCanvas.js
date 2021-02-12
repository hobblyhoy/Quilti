import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';

export function QuiltiCanvas({ color, width, drawMode, background, setHasInteractedWithCanvas, size, canvasState, setCanvasStateHistory }) {
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
         canvas.on('mouse:up', event => {
            setHasInteractedWithCanvas(true);
            // Wait for next tick so we can guarantee we're not grabbing an old state as toDataURL sometimes will
            setTimeout(() => {
               let canvasImage = document.getElementById('canvas').toDataURL();
               let historyItemsToKeep = 256; //equates to about 10mb cap in memory usage
               setCanvasStateHistory(canvasStateHistory => [...canvasStateHistory.slice(historyItemsToKeep * -1), canvasImage]);
            }, 0);
         });
         // Assign initial, blank state
         setTimeout(() => setCanvasStateHistory([document.getElementById('canvas').toDataURL()]), 0);
         setEventListenerAttached(true);
      }
   }, [canvas]);

   useEffect(() => {
      // If we've been pipped in a new canvasState then apply it
      if (canvas && canvasState && canvasState.state) {
         fabric.Image.fromURL(canvasState.state, img => {
            img.set({ left: 0, top: 0 });
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
      setTimeout(() => setCanvasStateHistory([document.getElementById('canvas').toDataURL()]), 0);
   }, [background]);

   return <canvas id="canvas"></canvas>;
}
