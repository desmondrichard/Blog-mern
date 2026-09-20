import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { cartContext } from "../App";
import { authContext } from "../context/AuthContext";
// import axios from "axios";
import api from "../api/axios";
import "./GlobalHeader.css";

const GlobalHeader = () => {
  const { cartCount } = useContext(cartContext);
  const { user, setUser } = useContext(authContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      // console.log(response.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  return (
    <div className="globalHeaderContainer">
      <Navbar bg="primary" expand="lg" collapseOnSelect>
        <Container className="headerWrapper">
          <Navbar.Brand as={Link} to="/" className="headerTitle text-white">
            My Blog
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="main-navbar-nav"
            className="headerToggle"
          />

          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="headerPageLinksWrapper">
              {!user && (
                <Nav.Link as={Link} to="/" className="headerLinks">
                  Home
                </Nav.Link>
              )}

              {user?.usertype === "admin" && (
                <Nav.Link as={Link} to="/dashboard" className="headerLinks">
                  Dashboard
                </Nav.Link>
              )}

              <Nav.Link as={Link} to="/posts" className="headerLinks">
                Posts
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="headerLinks">
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/cart" className="headerLinks">
                Cart
                <sup>
                  <span className="cartCount">{cartCount}</span>
                </sup>
              </Nav.Link>
            </Nav>

            <Nav className="headerAuthLinks">
              {user ? (
                <>
                  <Nav.Link className="headerLinks">
                    Welcome {user.name}
                  </Nav.Link>
                  <Nav.Link className="headerLinks" onClick={handleLogout}>
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="headerLinks">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register" className="headerLinks">
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default GlobalHeader;
