import React, { useContext, useState } from "react";
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
  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      // console.log(response.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    } finally {
      setUser(null);
      setExpanded(false);
      navigate("/");
    }
  };

  const handleNavLinkClick = () => {
    setExpanded(false);
  };
  return (
    <div className="globalHeaderContainer">
      <Navbar
        bg="primary"
        expand="lg"
        expanded={expanded}
        onToggle={setExpanded}
      >
        <Container className="headerWrapper">
          <Navbar.Brand
            as={Link}
            to="/"
            className="headerTitle text-white"
            onClick={handleNavLinkClick}
          >
            My Blog
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="main-navbar-nav"
            className="headerToggle"
          />

          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="headerPageLinksWrapper">
              {!user && (
                <Nav.Link
                  as={Link}
                  to="/"
                  className="headerLinks"
                  onClick={handleNavLinkClick}
                >
                  Home
                </Nav.Link>
              )}

              {user?.usertype === "admin" && (
                <Nav.Link
                  as={Link}
                  to="/dashboard"
                  className="headerLinks"
                  onClick={handleNavLinkClick}
                >
                  Dashboard
                </Nav.Link>
              )}

              <Nav.Link
                as={Link}
                to="/posts"
                className="headerLinks"
                onClick={handleNavLinkClick}
              >
                Posts
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/about"
                className="headerLinks"
                onClick={handleNavLinkClick}
              >
                About
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/cart"
                className="headerLinks"
                onClick={handleNavLinkClick}
              >
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
                  <Nav.Link
                    as={Link}
                    to="/login"
                    className="headerLinks"
                    onClick={handleNavLinkClick}
                  >
                    Login
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/register"
                    className="headerLinks"
                    onClick={handleNavLinkClick}
                  >
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
