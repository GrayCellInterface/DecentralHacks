import React from "react";
import axios from 'axios'
import { Modal } from 'react-bootstrap';

const DeleteConfirmationModal = (props) => {

    const handleDeleteProduct = async (e) => {
        e.preventDefault()
        await axios
            .post(`${process.env.REACT_APP_BACKEND_API}/shop/delete-product`, {
                _id: props.selectedProductId
            })
            .then((res) => {
                window.location.href = '/admin/products'
            })
            .catch((error) => {
                console.log(error.response.message);
            });
    }

    return (
        <>
            <Modal
                show={props.openDeleteConfirmation}
                onHide={props.handleCloseDeleteConfirmation}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>CONFIRM DELETE</Modal.Title>
                    <button className="float-right close-btn" onClick={props.handleCloseDeleteConfirmation}>X</button>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p>Are sure you want to delete this product?</p>
                    <button className="me-btn" style={{ backgroundColor: "red" }} onClick={handleDeleteProduct}>Confirm Delete</button>
                </Modal.Body>
            </Modal>

        </>
    )

}

export default DeleteConfirmationModal;