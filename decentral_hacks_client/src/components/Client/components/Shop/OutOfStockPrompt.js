import React from "react";
import { Modal } from 'react-bootstrap';

const OutOfStockPrompt = (props) => {

    return (
        <>
            <Modal
                show={props.openOutOfStock}
                onHide={props.handleCloseOutOfStock}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>OUT OF STOCK</Modal.Title>
                    <button className="float-right close-btn" onClick={props.handleCloseOutOfStock}>X</button>
                </Modal.Header>
                <Modal.Body>
                    <p>This item is currently out of stock.</p>
                    <button className="me-btn" onClick={props.handleCloseOutOfStock}>Okay</button>
                </Modal.Body>
            </Modal>

        </>
    )

}

export default OutOfStockPrompt;