import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { useParams } from "react-router-dom";
// import axios from "axios";
import api from "../api/axios";
import "./PostDetail.css";

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  const fetchPost = async () => {
    try {
      // const response = await axios.get(`http://localhost:8000/api/posts/${id}`);
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  // Show loading until API response arrives
  if (!post) {
    return <p className="m-0 text-center">Loading...</p>;
  }

  // Format date
  const formattedDate = Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(post.createdAt));

  return (
    <div className="postDetailContainer container">
      {/* 3D FLIP CONTAINER */}
      <div className="postDetailFlipContainer">
        {/* ELEMENT THAT ROTATES */}
        <div className="postDetailFlipCard">
          {/* FRONT */}

          <Card className="postDetailCard front">
            <Card.Img
              src={post.image}
              className="postDetailCardImage"
              alt={post.title}
            />

            <Card.Body className="postDetailCardBody">
              <Card.Title className="postDetailCardTitle">
                {post.title.toUpperCase()}
              </Card.Title>

              <Card.Text className="postDetailCardContentText">
                {post.content}
              </Card.Text>

              <Card.Text className="postDetailCardDateText">
                {formattedDate} by {post.author}
              </Card.Text>
            </Card.Body>
          </Card>

          {/*  BACK */}

          <Card
            className="postDetailCard back"
            style={{
              backgroundImage: `url(${post.image})`,
            }}
          >
            {/* Dark + glass overlay */}
            <div className="backOverlay">
              <h3>{post.title.toUpperCase()}</h3>

              <p>Read the complete article</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
