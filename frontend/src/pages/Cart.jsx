import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { cartContext } from "../App";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { setCartCount } = useContext(cartContext);
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      setCartItems(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //   script.async = true;
  //   document.body.appendChild(script);
  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  const handleRemove = async (cartId) => {
    try {
      await api.delete(`/cart/${cartId}`);
      setCartItems((prev) => prev.filter((item) => item._id !== cartId));
      setCartCount((prev) => prev - 1);
      toast.success("Item removed from cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  const handlePay = async () => {
    try {
      toast.info("Opening payment...");
      const response = await api.post("/cart/create-order");
      const { orderId, amount, currency } = response.data;
      const options = {
        key: "rzp_test_TeOmsbSgV7jgTN",
        amount: amount,
        currency: currency,
        name: "My Blog",
        description: "Blog Post Purchase",
        order_id: orderId,

        handler: async function (paymentResponse) {
          // 1. Update the UI FIRST — no waiting on the backend
          toast.success("Payment successful!");
          setCartItems([]);
          setCartCount(0);
          setTimeout(() => navigate("/posts"), 800);
          // 2. Verify in the background (errors don't block the user)
          try {
            await api.post("/cart/verify-payment", {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });
          } catch (error) {
            console.error(
              "Verify error:",
              error.response?.data?.message || error.message,
            );
          }
        },

        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.postId.price * item.quantity;
  }, 0);

  return (
    <section className="cartContainer">
      <Container>
        <h2>My Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div className="cartCardWrapper" key={item._id}>
                <img
                  src={item.postId.image}
                  className="cartCardImage"
                  alt={item.postId.title}
                />
                <h5 className="cartCardTitle">{item.postId.title}</h5>
                <h6 className="cartCardPrice">Rs. {item.postId.price}</h6>

                <Button
                  variant="danger"
                  className="cartRemoveButton"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </Button>
              </div>
            ))}

            <div className="cartTotal">
              <h3>Total: Rs. {totalPrice}</h3>

              <Button variant="success" onClick={handlePay}>
                Pay
              </Button>
            </div>
          </>
        )}
      </Container>
    </section>
  );
};

export default Cart;
