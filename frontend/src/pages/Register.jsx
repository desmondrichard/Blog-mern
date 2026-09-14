import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import axios from "axios";

import "./Register.css";

const validate = (values) => {
  const errors = {};
  // name:
  if (!values.name) {
    errors.name = "Name is required";
  } else if (values.name.length > 15) {
    errors.name = "Name should be less than 15 characters";
  } else if (values.name.length < 3) {
    errors.name = "Name should be at least 3 characters";
  } else if (!values.name.match(/^[a-zA-Z]+$/)) {
    errors.name = "Name should contain only alphabets";
  }
  // email:
  if (!values.email) {
    errors.email = "Email is required";
  } else if (
    !values.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  ) {
    errors.email = "Invalid email address";
  }
  // password:
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password should be at least 8 characters";
  }

  return errors;
};

const Register = ({ onRegisterSuccess }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate,
    // onSubmit: (values) => {
    //   console.log("register form values:", values);
    // },
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/auth/register",
          values,
          {
            withCredentials: true,
          },
        );
        // Registration successful toggle to login:
        onRegisterSuccess();
        console.log(response.data);
      } catch (error) {
        console.log(error.response?.data?.message);
      }
    },
  });
  return (
    <div className="registerFormContainer">
      <Form onSubmit={formik.handleSubmit} className="registerFormCard">
        <Form.Label htmlFor="name" className="registerFormLabel">
          Name
        </Form.Label>
        <Form.Control
          type="text"
          id="name"
          name="name"
          aria-describedby="name"
          className="registerFormInput"
          onChange={formik.handleChange}
          value={formik.values.name}
          onBlur={formik.handleBlur}
        />
        {formik.errors.name && formik.touched.name && (
          <p className="registerFormError">{formik.errors.name}</p>
        )}
        <Form.Label htmlFor="email" className="registerFormLabel">
          Email
        </Form.Label>
        <Form.Control
          type="email"
          id="email"
          name="email"
          aria-describedby="email"
          className="registerFormInput"
          onChange={formik.handleChange}
          value={formik.values.email}
          onBlur={formik.handleBlur}
        />

        {formik.errors.email && formik.touched.email && (
          <p className="registerFormError">{formik.errors.email}</p>
        )}
        <Form.Label htmlFor="password" className="registerFormLabel">
          Password
        </Form.Label>
        <Form.Control
          type="password"
          id="password"
          password="password"
          aria-describedby="password"
          className="registerFormInput"
          onChange={formik.handleChange}
          value={formik.values.password}
          onBlur={formik.handleBlur}
        />
        {formik.errors.password && formik.touched.password && (
          <p className="registerFormError">{formik.errors.password}</p>
        )}
        <Button className="registerFormButton" variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </div>
  );
};

export default Register;
