import React from 'react'
import { Nav, Navbar } from 'react-bootstrap';
import {Link} from 'react-router-dom';

const Navibar = () => {


    return(
        <Navbar collapseOnSelect expand='lg' bg="#40b48e" variant='light'>
            <Navbar.Brand>Recipe Search App</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link>
                        <Link to="/">Main</Link>
                    </Nav.Link>
                    <Nav.Link>
                        <Link to="/favorite">Favorite</Link>
                    </Nav.Link>
                    <Nav.Link>
                        <Link to="/story">Story</Link>
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Navibar;