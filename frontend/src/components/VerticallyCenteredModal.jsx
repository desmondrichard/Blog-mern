import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import api from "../api/axios";
import "./VerticallyCenteredModal.css";

const MyVerticallyCenteredModal = (props) => {
  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      title: props.post?.title || "",
      content: props.post?.content || "",
      category: props.post?.category || "",
      author: props.post?.author || "",
      image: props.post?.image || "",
      price: props.post?.price || "",
    },

    onSubmit: async (values) => {
      try {
        const response = await api.put(`/posts/${props.post._id}`, values);

        console.log(response.data);
        await props.fetchPosts();

        props.onHide();

        props.onHide();
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    },
  });

  return (
    <Modal
      {...props}
    //   size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="customModal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Edit Post</Modal.Title>
      </Modal.Header>

      <Modal.Body className="customModalBody">
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="content"
              value={formik.values.content}
              onChange={formik.handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              name="author"
              value={formik.values.author}
              onChange={formik.handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={formik.values.image}
              onChange={formik.handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
            />
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" type="button" onClick={props.onHide}>
              Close
            </Button>

            <Button variant="success" type="submit">
              Update Post
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default MyVerticallyCenteredModal;
