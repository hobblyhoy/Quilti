import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import axios from 'axios';

export function Counter() {
   const [canvas, setCanvas] = useState();
   const [testImageMini, setTestImageMini] = useState();
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

   // useEffect(() => {
   //    fetch('api/Patch').then(data => {
   //       console.log({ data });
   //       data.json().then(data2 => {
   //          console.log({ data2 });
   //          setTestImage(data2.creatorIp);
   //       });
   //    });
   // }, []);

   // let getTest = async () => {
   //    return await response.json();
   // };

   // let offscreenCanvasMaker = base64 => {
   //    // create an off-screen canvas
   //    var offscreenCanvas = document.createElement('canvas'),
   //       ctx = offscreenCanvas.getContext('2d');

   //    // set its dimension to target size
   //    offscreenCanvas.width = 100;
   //    offscreenCanvas.height = 100;

   //    // let img = document.createElement('img');
   //    // img.src = base64;

   //    // draw source image into the off-screen canvas:
   //    ctx.drawImage(img, 0, 0, 100, 100);

   //    // encode image to data-uri with base64 version of compressed image
   //    return offscreenCanvas.toDataURL('image/jpeg', 0.1);
   // };

   // Looks like 0.01 is the lowest it will go...
   // var test = [1, 0.5, 0.25, 0.1, 0.01, 0.001, 0.0001, 0.00001];
   // test.forEach(num => {
   //    console.log(num + ' - ' + canvasEl.toDataURL('image/jpeg', num).length);
   // });

   let saveTest = () => {
      // do NOT use the canvas object here, theres a bug(?) where fabricjs will silently always save as image/png
      let canvasEl = document.getElementById('canvas');

      //copnstruct an off-screen canvas for building a mini version of our image
      var fullSize = canvasEl.toDataURL();
      var imageRegular = canvasEl.toDataURL('image/jpeg', 0.5);
      // resize for our mini

      var osCanvas = document.createElement('canvas');
      var osCtx = osCanvas.getContext('2d');
      osCanvas.width = 100;
      osCanvas.height = 100;

      var image = new Image();
      image.onload = () => {
         osCtx.drawImage(image, 0, 0, 100, 100);
         var imageMini = osCanvas.toDataURL('image/jpeg', 0.1);

         let toSend = {
            image: imageRegular,
            imageMini,
         };
         axios.post('/api/Patch', toSend).then(resp => {
            console.log(resp);
            //setTestImage(ret.data.patchImage.image);
            setTestImageMini(resp.data.imageMini);

            axios.get('/api/PatchImage/' + resp.data.patchId).then(resp2 => {
               setTestImage(resp2.data);
            });
         });
      };
      image.src = fullSize;
   };

   // let saveTest2 = () => {
   //    var canvas2 = document.getElementById('canvas');
   //    if (canvas2.getContext) {
   //       var ctx = canvas2.getContext('2d');

   //       ctx.fillStyle = 'rgb(200, 0, 0)';
   //       ctx.fillRect(10, 10, 50, 50);

   //       ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
   //       ctx.fillRect(30, 30, 50, 50);
   //    }
   //    let dataUrl = canvas2.toDataURL('image/jpeg', 0.5); //can pass a 2nd param here 0 to 1 to represent quality
   //    console.log({ dataUrl });
   // };

   return (
      <div>
         <div>
            <canvas id="canvas"></canvas>

            <button onClick={saveTest}>SaveTest</button>
         </div>

         {/* <div>
            <canvas id="tutorial" width="150" height="150"></canvas>

            <button onClick={saveTest2}>SaveTest2</button>
         </div> */}
         {testImage && testImageMini && (
            <div>
               <div>
                  Regular:
                  <img src={testImage} height="100" width="100"></img>
                  <img src={testImage}></img>
               </div>
               <div>
                  Mini:
                  <img src={testImageMini} height="100" width="100"></img>
                  <img src={testImageMini}></img>
               </div>
            </div>
         )}
      </div>
   );
}
