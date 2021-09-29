import React, { useState } from "react";
import { Modal, Form } from 'react-bootstrap';
import './css/Prompt.css'

const Prompt = (props) => {

    const errorObj = {
        invalidAmountError: "Invalid amount.",
        cardAmountError: "The amount should be between $1 and $500.",
        bankAmountError: "You do not have sufficient balance",
    }

    const [openSameCard, setOpenSameCard] = useState(false)
    const [openSameBank, setOpenSameBank] = useState(false)
    const [cardAmount, setCardAmount] = useState("")
    const [bankAmount, setBankAmount] = useState("")
    const [errors, setErrors] = useState({})

    let errorHandlerObj;

    const handleSameCredit = async (e) => {
        e.preventDefault()
        setErrors({})
        const validAmount = /^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$/
        errorHandlerObj = {
            invalidAmountError: "",
            cardAmountError: "",
        }
        if (cardAmount.length === 0 || !validAmount.test(cardAmount)) {
            errorHandlerObj['invalidAmountError'] = errorObj['invalidAmountError']
        } else {
            if (parseFloat(cardAmount) < 1.00 || parseFloat(cardAmount) > 500.00) {
                errorHandlerObj['cardAmountError'] = errorObj['cardAmountError']
            }
        }
        if (
            errorHandlerObj['invalidAmountError'] === "" &&
            errorHandlerObj['cardAmountError'] === ""
        ) {
            setOpenSameCard(false)
            props.handleCreateCreditBody({
                choice: "old",
                email: `${window.localStorage.getItem("email")}`,
                amount: `${cardAmount}`
            })
        } else {
            setErrors({ ...errorHandlerObj })
        }

    }

    const handleSameDebit = async (e) => {
        e.preventDefault()
        setErrors({})
        const validAmount = /^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$/
        errorHandlerObj = {
            invalidAmountError: "",
            bankAmountError: "",
        }
        if (bankAmount.length === 0 || !validAmount.test(bankAmount)) {
            errorHandlerObj['invalidAmountError'] = errorObj['invalidAmountError']
        } else {
            if (!(parseFloat(bankAmount) < parseFloat(window.localStorage.getItem('balance')))) {
                errorHandlerObj['bankAmountError'] = errorObj['bankAmountError']
            }
        }
        if (
            errorHandlerObj['invalidAmountError'] === "" &&
            errorHandlerObj['bankAmountError'] === ""
        ) {
            props.handleCreateDebitBody({
                choice: "old",
                email: `${window.localStorage.getItem("email")}`,
                amount: `${bankAmount}`
            })
        } else {
            setErrors({ ...errorHandlerObj })
        }
    }

    const handleBackToProfile = (e) => {
        setOpenSameCard(false)
        setOpenSameBank(false)
        props.handleBackToProfile(e)
    }

    const handleSameCard = () => {
        setOpenSameCard(true)
    }

    const handleSameBank = () => {
        setOpenSameBank(true)
    }

    const handleCardAmountChange = (e) => {
        setCardAmount(e.target.value)
    }

    const handleBankAmountChange = (e) => {
        setBankAmount(e.target.value)
    }

    const renderModalContent = () => {
        if (props.choice === "credit") {
            if (openSameCard) {
                return (
                    <>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicNumber">
                                <Form.Label>Amount:</Form.Label>
                                <Form.Control value={cardAmount} onChange={handleCardAmountChange} placeholder="Enter credit amount" />
                                {
                                    errors['invalidAmountError'] === ""
                                        ? (
                                            errors['cardAmountError'] === ""
                                                ? <></>
                                                : <div className='error-msg'>{errors['cardAmountError']}</div>
                                        )
                                        : <div className='error-msg'>{errors['invalidAmountError']}</div>
                                }
                            </Form.Group>
                            <button onClick={handleSameCredit} className="me-btn" style={{ float: 'left' }}>
                                Add Credit
                            </button>
                            <button onClick={handleBackToProfile} className="me-btn" style={{ float: 'right' }}>
                                Cancel
                            </button>
                        </Form>
                    </>
                )
            }
            return (
                <>
                    <p>Do you want to use the same card as previous credit transaction?</p>
                    <button onClick={handleSameCard} className="me-btn" style={{ float: 'left' }}>
                        Use Same Card
                    </button>
                    <button onClick={props.handleDifferentCredit} className="me-btn" style={{ float: 'right' }}>
                        Use Different Card
                    </button>
                </>
            )
        } else {
            if (openSameBank) {
                return (
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicNumber">
                            <Form.Label>Amount:</Form.Label>
                            <Form.Control value={bankAmount} onChange={handleBankAmountChange} placeholder="Enter credit amount" />
                            {
                                errors['invalidAmountError'] === ""
                                    ? (
                                        errors['bankAmountError'] === ""
                                            ? <></>
                                            : <div className='error-msg'>{errors['bankAmountError']}</div>
                                    )
                                    : <div className='error-msg'>{errors['invalidAmountError']}</div>
                            }
                        </Form.Group>
                        <button onClick={handleSameDebit} className="me-btn" style={{ float: 'left' }}>
                            Withdraw
                        </button>
                        <button onClick={handleBackToProfile} className="me-btn" style={{ float: 'right' }}>
                            Cancel
                        </button>
                    </Form>
                )
            } else {
                return (
                    <>
                        <p>Do you want to use the same bank as previous debit transaction?</p>
                        <button onClick={handleSameBank} className="me-btn" style={{ float: 'left' }}>
                            Use Same Bank
                        </button>
                        <button onClick={props.handleDifferentDebit} className="me-btn" style={{ float: 'right' }}>
                            Use Different Bank
                        </button>
                    </>
                )
            }

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