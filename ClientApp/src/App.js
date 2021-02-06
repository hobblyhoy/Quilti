import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { MainView } from './components/MainView';
import { MainDraw } from './components/MainDraw';

import './custom.css';
import { CounterTwo } from './components/CounterTwo';

export default function App() {
   return (
      <Layout>
         <Route exact path="/" component={MainView} />
         <Route path="/view/:patchIdParam" component={MainView} />
         <Route path="/draw/:patchIdParam" component={MainDraw} />

         <Route path="/counter" component={Counter} />
         <Route path="/countertwo" component={CounterTwo} />
         <Route path="/fetch-data" component={FetchData} />
      </Layout>
   );
}
