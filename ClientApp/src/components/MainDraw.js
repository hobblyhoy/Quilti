import React, { useEffect, useState } from 'react';
import { NavMenu } from './NavMenu';
import { NavItem, NavLink } from 'reactstrap';
import { useParams, useHistory } from 'react-router-dom';
import './MainDraw.css';
import { db_init, db_patch_get } from '../DB';

export function MainDraw() {
   const { patchIdParam } = useParams();
   const [mainAreaHeight, setMainAreaHeight] = useState(1);
   const [mainAreaWidth, setMainAreaWidth] = useState(1);
   const [dbIsInitialized, setDbIsInitialized] = useState(false);

   //// Init \\\\
   useEffect(() => {
      (async () => {
         console.log('init');
         if (!dbIsInitialized) {
            db_init();
            // only needed because of HMR, if this is a prod build we can pull it out
            setDbIsInitialized(true);
         }

         setMainAreaHeight(window.innerHeight - document.getElementById('nav').offsetHeight);
         setMainAreaWidth(window.innerWidth);
      })();
   }, []);
   // use our existing method to figure out the surrounding patches
   // Get the surrounding Patch Images
   // do whatever we need to do to enable our canvas

   //// User interaction / onClick bindings \\\\
   // TODO paintbrush, pencil, etc
   // TODO brush size
   // TODO color picker
   // TODO Im Done! button

   return (
      <div>
         <NavMenu>
            <NavItem>
               <NavLink href="#" className="text-dark" onClick={() => console.log('hi')}>
                  {/* <FontAwesomeIcon icon={faPlus} /> */}
               </NavLink>
            </NavItem>
            <NavItem>
               <NavLink href="#" className="text-dark" onClick={() => console.log('hi')}>
                  {/* <FontAwesomeIcon icon={faMinus} /> */}
               </NavLink>
            </NavItem>
         </NavMenu>
         <div className="force-center" style={{ height: mainAreaHeight + 'px', width: mainAreaWidth + 'px' }}>
            <div className="layout-container">
               <div className="column-left row-top grid-right-align grid-bottom-align"> top left</div>
               <div className="column-mid row-top grid-bottom-align">
                  <img src="https://via.placeholder.com/500" />
               </div>
               <div className="column-right row-top grid-left-align grid-bottom-align"> top right</div>
               <div className="column-left row-mid grid-right-align">
                  {' '}
                  <img src="https://via.placeholder.com/500" />
               </div>
               <div className="column-mid row-mid">
                  <img src="https://via.placeholder.com/500" />
               </div>
               <div className="column-right row-mid grid-left-align">
                  {' '}
                  <img src="https://via.placeholder.com/500" />
               </div>
               <div className="column-left row-bottom grid-right-align grid-top-align"> bottom left</div>
               <div className="column-mid row-bottom grid-top-align">
                  <img src="https://via.placeholder.com/500" />
               </div>
               <div className="column-right row-bottom grid-left-align grid-top-align"> bottom right</div>
            </div>
         </div>
      </div>
   );
}
