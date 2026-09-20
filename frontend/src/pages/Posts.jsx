import React, { useContext } from "react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
// import axios from "axios";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { cartContext, modalContext } from "../App";
import MyVerticallyCenteredModal from "../components/VerticallyCenteredModal";
import { authContext } from "../context/AuthContext";
import api from "../api/axios";
import { toast } from "react-toastify";
import "./Posts.css";

const Posts = () => {
  const { modalShow, setModalShow } = useContext(modalContext);
  const { cartCount, setCartCount } = useContext(cartContext);
  const { user } = useContext(authContext);
  const [addedPosts, setAddedPosts] = useState([]); //for cart
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); //to store selected post
  const [category, setCategory] = useState(""); //form value
  const [categories, setCategories] = useState([]); //list of categories coming from backend
  const navigate = useNavigate();
  // pagination:
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 2;
  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postPerPage);
  const paginate = (page) => {
    setCurrentPage(page);
  };

  const fetchPosts = async () => {
    try {
      // const response = await axios.get("http://localhost:8000/api/posts", {
      const response = await api.get("/posts", {
        params: {
          category: category,
        },
      });
      setPosts(response.data);
      // Go back to page 1 whenever the category changes:
      setCurrentPage(1);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      // const response = await axios.get(
      //   "http://localhost:8000/api/posts/categories",
      // );
      const response = await api.get("/posts/categories");

      setCategories(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleAddToCart = async (postId) => {
    try {
      await api.post("/cart", {
        postId: postId,
      });

      setAddedPosts((prev) => [...prev, postId]);
      setCartCount((prev) => prev + 1);

      toast.success("Post added to cart!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add post to cart",
      );
    }
  };

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      const cartPostIds = response.data.map((item) => item.postId._id);
      setAddedPosts(cartPostIds);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  useEffect(() => {
    fetchCategories();
    fetchCart();
  }, []);

  return (
    <section className="postsContainer">
      <Container>
        <div className="postsAddButtonWrapper"></div>
        <Form.Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="categoryFilter"
        >
          <option value="">All Categories</option>

          {categories.map((categoryItem) => (
            <option key={categoryItem} value={categoryItem}>
              {categoryItem}
            </option>
          ))}
        </Form.Select>
        {console.log("posts", posts)}
        {posts.length === 0 ? (
          <p className="m-0 text-center">No Posts available</p>
        ) : (
          currentPosts.map((post, index) => (
            <Card className="postsCardContainer" key={index}>
              <Card.Img
                variant="top"
                src={post.image}
                className="postsCardImage"
              />
              <Card.Body className="postsCardBody">
                <Card.Title className="postsCardTitle ">
                  {post.title}{" "}
                  <Button className="postsCardPriceButton">
                    Rs. {post.price}
                  </Button>
                </Card.Title>
                <Card.Text className="postsCardText">
                  {post.content.slice(0, 40)}...
                </Card.Text>
                <div className="postsCardButtonWrapper">
                  <Button
                    variant="primary"
                    className="postsCardButton"
                    onClick={() => navigate(`/posts/${post._id}`)}
                  >
                    Read More
                  </Button>
                  <Button
                    variant="danger"
                    className="postsCardButton"
                    onClick={() => handleAddToCart(post._id)}
                    disabled={addedPosts.includes(post._id)}
                  >
                    {addedPosts.includes(post._id) ? "Added" : "Add To Cart"}
                  </Button>
                  {user?.usertype === "admin" && (
                    <Button
                      className="postsCardEditPostButton"
                      variant="success"
                      onClick={() => {
                        setSelectedPost(post);
                        setModalShow(true);
                      }}
                    >
                      Edit Post
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))
        )}
        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          post={selectedPost}
          fetchPosts={fetchPosts} //after db update to remove old data
        />
        <div className="paginationWrapper">
          {/* FIRST */}

          <button onClick={() => paginate(1)} disabled={currentPage === 1}>
            First
          </button>

          {/* PREVIOUS */}

          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {/* PAGE NUMBERS */}

          {new Array(totalPages).fill(0).map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}

          {/* NEXT */}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>

          {/* LAST */}

          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      </Container>
    </section>
  );
};

export default Posts; 