import React, { Component } from 'react';
import { NavMenu } from './NavMenu';

export function Layout(props) {
   return (
      <div>
         <NavMenu />
         <div>{props.children}</div>
      </div>
   );
}
