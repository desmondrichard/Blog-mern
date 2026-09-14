import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import axios from "axios";
import { authContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const validate = (values) => {
  const errors = {};

  // Email or username validation
  if (!values.identifier) {
    errors.identifier = "Email or username is required";
  } else {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;

    if (
      !emailPattern.test(values.identifier) &&
      !usernamePattern.test(values.identifier)
    ) {
      errors.identifier = "Enter a valid email or username";
    }
  }

  // Password validation
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password should be at least 8 characters";
  }

  return errors;
};

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const { setUser } = useContext(authContext);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },

    validate,

    // onSubmit: (values) => {
    //   console.log("login form values: ", values);
    // },
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/auth/login",
          // values,
          {
            identifier: values.identifier,
            password: values.password,
          },

          {
            withCredentials: true,
          },
        );
        setUser(response.data.user);
        setErrorMessage(null);
        console.log(response.data);
        // navigate("/posts");
        if (response.data.user.usertype === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/posts");
        }
      } catch (error) {
        console.log(error.response?.data?.message);
        setErrorMessage(error.response?.data?.message);
      }
    },
  });

  return (
    <div className="loginFormContainer">
      <div className="loginFormCard">
        <h2 className="loginFormTitle">Welcome Back</h2>

        <p className="loginFormSubtitle">Login to your account</p>

        <Form onSubmit={formik.handleSubmit}>
          {/* Email */}
          <Form.Group className="loginFormGroup">
            <Form.Label htmlFor="identifier" className="loginFormLabel">
              Email or Username
            </Form.Label>

            <Form.Control
              type="text"
              id="identifier"
              name="identifier"
              placeholder="Enter your email or username"
              className={`loginFormInput ${
                formik.touched.identifier && formik.errors.identifier
                  ? "inputError"
                  : ""
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.identifier}
            />

            {formik.touched.identifier && formik.errors.identifier && (
              <p className="loginFormError">{formik.errors.identifier}</p>
            )}
          </Form.Group>

          {/* Password */}
          <Form.Group className="loginFormGroup">
            <Form.Label htmlFor="password" className="loginFormLabel">
              Password
            </Form.Label>

            <Form.Control
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className={`loginFormInput ${
                formik.touched.password && formik.errors.password
                  ? "inputError"
                  : ""
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />

            {formik.touched.password && formik.errors.password && (
              <p className="loginFormError">{formik.errors.password}</p>
            )}
          </Form.Group>

          {errorMessage && (
            <div className="loginServerError">{errorMessage}</div>
          )}

          <Button className="loginFormButton" variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
