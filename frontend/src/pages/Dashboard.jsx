import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./Dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);

  const navigate = useNavigate();

  const data = {
    labels: ["Users", "Posts"],
    datasets: [
      {
        data: [userCount, postCount],
        backgroundColor: ["blue", "green"],
        borderColor: "white",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: true,
        position: "top",
      },

      tooltip: {
        enabled: true,
      },

      datalabels: {
        color: "white",

        font: {
          size: 18,
          weight: "bold",
        },

        formatter: (value) => value,
      },
    },
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      category: "",
      author: "",
      image: "",
      price: "",
    },

    onSubmit: async (values) => {
      try {
        const response = await api.post("/posts", values);
        console.log(response.data);
        navigate("/posts");
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    },
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const userResponse = await api.get("/auth/count");
        const postResponse = await api.get("/posts/count");
        setUserCount(userResponse.data.count);
        setPostCount(postResponse.data.count);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="dashboardContainer container">
      <div className="dashboardWrapper">
        <div className="dashboardWrapperContentLeft">
          <div className="dashboardWrapperContentLeftContent">
            <h5 className="dashboardTitle">Create New Post:</h5>
            <Form
              onSubmit={formik.handleSubmit}
              className="dashboardCreatePostForm"
            >
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>

                <Form.Control
                  type="text"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={5}
                  name="content"
                  value={formik.values.content}
                  onChange={formik.handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>

                <Form.Control
                  type="text"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>

                <Form.Control
                  type="text"
                  name="author"
                  value={formik.values.author}
                  onChange={formik.handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>

                <Form.Control
                  type="text"
                  name="image"
                  value={formik.values.image}
                  onChange={formik.handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>

                <Form.Control
                  type="number"
                  name="price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="success">
                Create Post
              </Button>
            </Form>
          </div>
        </div>

        <div className="dashboardWrapperContentRight">
          <div className="dashboardWrapperContentRightContent">
            <h5 className="dashboardTitle">Statistics:</h5>
            <div className="pieChartContainer">
              <Pie data={data} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
