import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { MainView } from './components/MainView';
import { MainDraw } from './components/MainDraw';

import './custom.css';

export default function App() {
   return (
      <Layout>
         <Route exact path="/" component={MainView} />
         <Route path="/view/:patchId" component={MainView} />
         <Route path="/draw/:patchId" component={MainDraw} />

         <Route path="/counter" component={Counter} />
         <Route path="/fetch-data" component={FetchData} />
         <Route path="/home-old" component={Home} />
      </Layout>
   );
}
