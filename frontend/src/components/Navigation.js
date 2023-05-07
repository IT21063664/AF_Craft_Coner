import React, { useRef, useState } from 'react'
import { Navbar, Button, Nav, NavDropdown, Container } from 'react-bootstrap'
import './Navigation.css';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout, resetNotifications } from "../features/userSlice";
import axios from "../axios";


function Navigation() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const bellRef = useRef(null);
  const notificationRef = useRef(null);
  const [bellPos, setBellPos] = useState({});

  function handleLogout() {
    dispatch(logout());
  }

  const unreadNotifications = user?.notifications?.reduce((acc, current) => {
    if (current.status == "unread") return acc + 1;
    return acc;
}, 0);

function handleToggleNotifications() {
    const position = bellRef.current.getBoundingClientRect();
    setBellPos(position);
    notificationRef.current.style.display = notificationRef.current.style.display === "block" ? "none" : "block";
    dispatch(resetNotifications());
    if (unreadNotifications > 0) 
    axios.post(`/users/${user._id}/updateNotifications`);
}




  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>

        <LinkContainer to="/">
            <Navbar.Brand >Craft Coner</Navbar.Brand>
        
        </LinkContainer>

        <Navbar.Brand href="#home"></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#features">About us</Nav.Link>
            <Nav.Link href="#pricing">Services</Nav.Link>
            
            <NavDropdown title="Help With" id="collasible-nav-dropdown">
             {/*} <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
  </NavDropdown.Item>*/}
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
  </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>

            {/* if no user */}
            {!user && (
              <LinkContainer to="/login">
                <Nav.Link >Login</Nav.Link>
              </LinkContainer> 
            )}

            {user && !user.isAdmin && (
              <LinkContainer to="/cart">
                  <Nav.Link>
                      <i className="fas fa-shopping-cart"></i>
                      {user?.cart.count > 0 && (
                          <span className="badge badge-warning" id="cartcount">
                              {user.cart.count}
                          </span>
                      )}
                  </Nav.Link>
              </LinkContainer>
              )}


            {/* if user */}

            { user && ( 
              <>

                <Nav.Link style={{ position: "relative" }} onClick={handleToggleNotifications}>
                  <i className="fas fa-bell" ref={bellRef} data-count={unreadNotifications || null}></i>
                 </Nav.Link>
              
              <NavDropdown title={`${user.email}`} id="collasible-nav-dropdown">
                
              {user.isAdmin && (
                <>

                  <LinkContainer to="/admin">
                  <NavDropdown.Item >Dashboard</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/new-product">
                  <NavDropdown.Item >Create Product</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/new-product">
                  <NavDropdown.Item >Profile</NavDropdown.Item>
                  </LinkContainer>

                </>
              )}

                {!user.isAdmin && (
                <>

                  <LinkContainer to="/cart">
                  <NavDropdown.Item >Cart</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orders">
                  <NavDropdown.Item >My Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orders">
                  <NavDropdown.Item >Profile</NavDropdown.Item>
                  </LinkContainer>

                </>
              )}

              <NavDropdown.Divider />
              <Button variant="danger" onClick={handleLogout} className="logout-btn">
              Logout</Button>
              
            </NavDropdown>
            </>
            )}
            


           {/*} <Nav.Link eventKey={2} href="#memes">
              Cart
                </Nav.Link>*/}
          </Nav>
        </Navbar.Collapse>
      </Container>


      {/*notification */}

      <div className="notifications-container" ref={notificationRef} style={{ position: "absolute", top: bellPos.top + 30, left: bellPos.left, display: "none" }}>
                {user?.notifications.length > 0 ? (
                    user?.notifications.map((notification) => (
                        <p className={`notification-${notification.status}`}>
                            {notification.message}
                            <br />
                            <span>{notification.time.split("T")[0] + " " + notification.time.split("T")[1]}</span>
                        </p>
                    ))
                ) : (
                    <p>No notifcations yet</p>
                )}
            </div>

    </Navbar>
  )
}

export default Navigation;
