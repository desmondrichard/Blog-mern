import React, { createContext, useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import GlobalHeader from "./components/GlobalHeader";
import GlobalFooter from "./components/GlobalFooter";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import About from "./pages/About";
import PostDetail from "./pages/PostDetail";
import Cart from "./pages/Cart";
import axios from "axios";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { authContext } from "./context/AuthContext";
import api from "./api/axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

export const cartContext = createContext(null);
export const modalContext = createContext(null);
function App() {
  const [cartCount, setCartCount] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const location = useLocation();
  const { user, authLoading } = useContext(authContext);
  const hideLayout =
    location.pathname === "/home" ||
    location.pathname === "/" ||
    (!user && !authLoading);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (authLoading || !user) {
        setCartCount(0);
        return;
      }

      try {
        const response = await api.get("/cart");

        setCartCount(response.data.length);
      } catch (error) {
        console.log(error.response?.data?.message);
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [user, authLoading, location.pathname]);

  // useEffect(() => {
  //   const fetchCartCount = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:8000/api/cart");

  //       setCartCount(response.data.length);
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   };

  //   fetchCartCount();
  // }, []);
  return (
    <div className="appOuterContainer">
      <cartContext.Provider value={{ cartCount, setCartCount }}>
        <modalContext.Provider value={{ modalShow, setModalShow }}>
          {!authLoading && !hideLayout && <GlobalHeader />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts"
              element={
                <ProtectedRoute>
                  <Posts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:id"
              element={
                <ProtectedRoute>
                  <PostDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
          </Routes>
          {!authLoading && !hideLayout && <GlobalFooter />}
        </modalContext.Provider>
      </cartContext.Provider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}

export default App;
