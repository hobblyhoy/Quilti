import React, { useEffect } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { MainView } from './components/MainView';
import { MainDraw } from './components/MainDraw';
import GlobalErrorDialog from './components/GlobalErrorDialog';
import GeneralDialog from './components/GeneralDialog';

import './custom.css';
import './components/Global.css';

export default function App() {
   useEffect(() => {
      let displayedGreeting = localStorage.getItem('displayedGreeting');
      if (!displayedGreeting && window.QuiltiDialog) {
         window.QuiltiDialog(
            'Welcome!',
            'Welcome to Quilti! Navigate around using the arrow buttons on the edge of the quilt and click on an empty space to add your artwork there!'
         );
         localStorage.setItem('displayedGreeting', true);
      }
   }, []);

   return (
      <Layout>
         <Route exact path="/" component={MainView} />
         <Route path="/view/:patchIdParam" component={MainView} />
         <Route path="/draw/:patchIdParam" component={MainDraw} />
         <GlobalErrorDialog />
         <GeneralDialog />
      </Layout>
   );
}
