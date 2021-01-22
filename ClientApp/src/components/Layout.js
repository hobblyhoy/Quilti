import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export function Layout() {
   return (
      <div>
         <NavMenu />
         <Container>{this.props.children}</Container>
      </div>
   );
}
