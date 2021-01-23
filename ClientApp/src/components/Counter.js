import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';

export function Counter() {
   const [canvas, setCanvas] = useState();
   const [testImage, setTestImage] = useState();

   useEffect(() => {
      setCanvas(
         new fabric.Canvas('canvas', {
            width: 500,
            height: 500,
            backgroundColor: 'grey',
         })
      );
   }, []);

   useEffect(() => {
      if (canvas) {
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
      }
   }, [canvas]);

   useEffect(() => {
      fetch('api/Patch').then(data => {
         console.log({ data });
         data.json().then(data2 => {
            console.log({ data2 });
            setTestImage(data2.creatorIp);
         });
      });
   }, []);

   // let getTest = async () => {
   //    return await response.json();
   // };

   let saveTest = () => {
      // do NOT use the canvas object here, theres a bug(?) where fabricjs will silently always save as image/png
      let canvasEl = document.getElementById('canvas');

      //let dataUrl = canvas.toDataURL('image/jpeg', 0.01); //can pass a 2nd param here 0 to 1 to represent quality
      console.log({ dataUrl });
   };

   let saveTest2 = () => {
      var canvas2 = document.getElementById('canvas');
      if (canvas2.getContext) {
         var ctx = canvas2.getContext('2d');

         ctx.fillStyle = 'rgb(200, 0, 0)';
         ctx.fillRect(10, 10, 50, 50);

         ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
         ctx.fillRect(30, 30, 50, 50);
      }
      let dataUrl = canvas2.toDataURL('image/jpeg', 0.5); //can pass a 2nd param here 0 to 1 to represent quality
      console.log({ dataUrl });
   };

   return (
      <div>
         <div>
            <canvas id="canvas"></canvas>

            <button onClick={saveTest}>SaveTest</button>
         </div>

         <div>
            <canvas id="tutorial" width="150" height="150"></canvas>

            <button onClick={saveTest2}>SaveTest2</button>
         </div>
         <div>{testImage && <img src={testImage}></img>}</div>
      </div>
   );
}
