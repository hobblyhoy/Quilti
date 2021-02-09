import React, { Component, useEffect, useState } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { MainView } from './components/MainView';
import { MainDraw } from './components/MainDraw';
import GlobalErrorDialog from './components/GlobalErrorDialog';

import './custom.css';
import './components/Global.css';

export default function App() {
   return (
      <Layout>
         <Route exact path="/" component={MainView} />
         <Route path="/view/:patchIdParam" component={MainView} />
         <Route path="/draw/:patchIdParam" component={MainDraw} />
         <GlobalErrorDialog />
      </Layout>
   );
}
