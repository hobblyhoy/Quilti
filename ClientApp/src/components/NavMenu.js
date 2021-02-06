import React, { useState } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh } from '@fortawesome/free-solid-svg-icons';

export function NavMenu(props) {
   const [collapsed, setCollapsed] = useState(true);

   let toggleNavbar = () => {
      setCollapsed(collapsed => !collapsed);
   };

   let test = () => {
      console.log('test');
   };

   return (
      <header>
         <Navbar id="nav" className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow" light>
            <Container>
               <NavbarBrand tag={Link} to="/">
                  <FontAwesomeIcon icon={faTh} /> Quilti
               </NavbarBrand>
               <NavbarToggler onClick={toggleNavbar} className="mr-2" />
               <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
                  <ul className="navbar-nav flex-grow">{props.children}</ul>
               </Collapse>
            </Container>
         </Navbar>
      </header>
   );
}
