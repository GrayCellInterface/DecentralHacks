import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Form } from 'react-bootstrap';
import './css/DebitPage.css'

var aba = require("abavalidator");

const DebitPage = (props) => {

    const errorObj = {
        invalidAmountError: "Invalid amount.",
        thresholdAmountError: "You do not have sufficient balance",
        districtError: "The district should be a 2-character long code",
        accountNumberError: "Invalid account number",
        routingNumberError: "Invalid routing number",
    };


    const [errors, setErrors] = useState({});
    const [bankValues, setBankValues] = useState({
        country: '',
        district: '',
        amount: '',
        accountNumber: '',
        routingNumber: '',
    })

    let handlerObj;
    let errorHandlerObj;

    const handleDebitChange = (selectedInput) => (e) => {
        handlerObj = { ...bankValues };

        if (selectedInput === "district") {
            handlerObj[selectedInput] = (e.target.value).toUpperCase();
        } else {
            handlerObj[selectedInput] = e.target.value;
        }

        setBankValues({ ...handlerObj });
    }

    const handleDebit = (e) => {
        e.preventDefault()
        setErrors({})
        const validAmount = /[+-]?([0-9]*[.])?[0-9]+/
        const validDistrict = /[A-Z]{2}/
        errorHandlerObj = {
            invalidAmountError: "",
            thresholdAmountError: "",
            districtError: "",
            accountNumberError: "",
            routingNumberError: ""
        }
        if (bankValues['amount'].length === 0 || !validAmount.test(bankValues['amount'])) {
            errorHandlerObj['invalidAmountError'] = errorObj['invalidAmountError']
        } else {
            if (parseFloat(window.localStorage.getItem('balance')) - parseFloat(bankValues['amount']) < 0) {
                errorHandlerObj['thresholdAmountError'] = errorObj['thresholdAmountError']
            }
        }
        if (bankValues['accountNumber'] === "") {
            errorHandlerObj['accountNumberError'] = errorObj['accountNumberError']
        }
        if (!validDistrict.test(bankValues['district'])) {
            errorHandlerObj['districtError'] = errorObj['districtError']
        }

        if (!aba.validate(bankValues['routingNumber'])) {
            errorHandlerObj['routingNumberError'] = errorObj['routingNumberError']
        }

        if (
            errorHandlerObj['invalidAmountError'] === "" &&
            errorHandlerObj['thresholdAmountError'] === "" &&
            errorHandlerObj['accountNumberError'] === "" &&
            errorHandlerObj['routingNumberError'] === "" &&
            errorHandlerObj['districtError'] === ""
        ) {
            console.log(bankValues)
            axios.post(`${process.env.REACT_APP_BACKEND_API}/accounts/payout`, {
                country: "US",
                district: `${bankValues['district']}`,
                amount: `${bankValues['amount']}`,
                accountNumber: `${bankValues['accountNumber']}`,
                routingNumber: `${bankValues['routingNumber']}`,
                email: `${window.localStorage.getItem('email')}`,
                choice: "new"
            }).then((res) => {
                console.log(res.data)
            }).catch((error) => {
                console.log(error.response.data)
            })
        } else {
            setErrors({ ...errorHandlerObj })
            console.log("Debit failed")
            console.log(bankValues)
            console.log(errorHandlerObj)
        }

    }



    return (
        <>
            <div className="col-12">
                <h3 style={{ marginBottom: "20px" }}>Bank Details</h3>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicNumber">
                        <Form.Label>Debit Amount:</Form.Label>
                        <Form.Control value={bankValues['amount']} onChange={handleDebitChange('amount')} placeholder="Enter amount to withdraw" />
                        {
                            errors['invalidAmountError'] === ""
                                ? (
                                    errors['thresholdAmountError'] === ""
                                        ? <></>
                                        : <div className='error-msg'>{errors['thresholdAmountError']}</div>
                                )
                                : <div className='error-msg'>{errors['invalidAmountError']}</div>
                        }
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicNumber">
                        <Form.Label>Account Number:</Form.Label>
                        <Form.Control value={bankValues['accountNumber']} onChange={handleDebitChange('accountNumber')} placeholder="Enter account number" />
                        {errors['accountNumberError'] === "" ? <></> : <div className='error-msg'>{errors['accountNumberError']}</div>}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicNumber">
                        <Form.Label>Rounting Number (ABA):</Form.Label>
                        <Form.Control value={bankValues['routingNumber']} onChange={handleDebitChange('routingNumber')} placeholder="Enter routing number" />
                        {errors['routingNumberError'] === "" ? <></> : <div className='error-msg'>{errors['routingNumberError']}</div>}
                    </Form.Group>
                    <Form.Text style={{ fontSize: "17px" }}><br />Bank Address: </Form.Text>
                    <Form.Group className="mb-3" controlId="formBasicNumber">
                        <Form.Label><br />Country:</Form.Label>
                        <Form.Control value="United States of America" disabled />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCVV">
                        <Form.Label>District</Form.Label>
                        <Form.Control value={bankValues['district']} onChange={handleDebitChange('district')} placeholder="Enter 2-letter district code" />
                        {errors['districtError'] === "" ? <></> : <div className='error-msg'>{errors['districtError']}</div>}
                    </Form.Group>
                    <br />
                    <div className="btn-wrapper">
                        <button onClick={handleDebit} className="me-btn inner-text" type="submit" style={{ float: 'left', marginRight: '20px', marginBottom: "40px" }}>
                            Withdraw Now
                        </button>
                        <button onClick={props.handleBackToProfile} className="me-btn inner-text" type="submit" style={{ float: 'right', marginBottom: "40px" }} >
                            Back
                        </button>
                    </div>
                </Form>
            </div>
        </>
    );
}

export default DebitPage;