import React from "react";
import { Modal } from 'react-bootstrap';
import './css/Prompt.css'

const Prompt = (props) => {

    const handleSameCredit = () => {
        //send email id to payment route for particular credit id
    }

    const handleSameDebit = () => {
        //send email id to payout route for particular credit id
    }

    const renderModalContent = () => {
        if (props.choice === "credit") {
            return (
                <>
                    <p>Do you want to use the same card as previous credit transaction?</p>
                    <button onClick={handleSameCredit} className="me-btn" style={{ float: 'left' }}>
                        Use Same Card
                    </button>
                    <button onClick={props.handleDifferentCredit} className="me-btn" style={{ float: 'right' }}>
                        Use Different Card
                    </button>
                </>
            )
        } else {
            return (
                <>
                    <p>Do you want to use the same bank as previous debit transaction?</p>
                    <button onClick={handleSameDebit} className="me-btn" style={{ float: 'left' }}>
                        Use Same Bank
                    </button>
                    <button onClick={props.handleDifferentDebit} className="me-btn" style={{ float: 'right' }}>
                        Use Different Bank
                    </button>
                </>
            )
        }
    }

    return (
        <>
            <Modal
                show={props.openPrompt}
                onHide={props.handleClosePrompt}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{props.choice === "credit" ? "CREDIT" : "DEBIT"}</Modal.Title>
                    <button className="float-right close-btn" onClick={props.handleClosePrompt}>X</button>
                </Modal.Header>
                <Modal.Body>
                    {renderModalContent()}
                </Modal.Body>
            </Modal>

        </>
    )

}

export default Prompt;