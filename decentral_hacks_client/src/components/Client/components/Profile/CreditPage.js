import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import DatePicker from "react-datepicker";
import dateFormat from "dateformat";
import { Form } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import encrypt from '../../../../assets/js/encryptPGP';
import './css/CreditPage.css'
var valid = require("card-validator");

//Gray Cell Interface API : QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==

const CreditPage = (props) => {

    const errorObj = {
        invalidAmountError: "Invalid amount.",
        thresholdAmountError: "The amount should be between $1 and $100.",
        numberError: "Invalid card number.",
        nameError: "Invalid card holder name.",
        expiryError: "Invalid expiry date.",
        cvvError: "Invalid CVV."
    }

    const [cardValues, setCardValues] = useState({
        cvv: '',
        expiryMonth: '',
        expiryYear: '',
        expiry: '',
        focus: '',
        name: '',
        number: '',
        amount: '',
    })

    const [expiryDate, setExpiryDate] = useState(new Date())
    const [errors, setErrors] = useState({})
    const [publicKey, setPublicKey] = useState({})

    let handlerObj;
    let errorHandlerObj;

    useEffect(() => {
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization:
                "Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
        };
        //get publick key and store in local storage
        const getPublicKey = async () => {

            const url = 'https://api-sandbox.circle.com/v1/encryption/public'

            await axios.get(url, { headers }).then((res) => {
                setPublicKey(res.data.data)
                window.localStorage.setItem('publicKey', res.data.data.publicKey + '$' + res.data.data.keyId)
                window.localStorage.setItem('publicKeyExpiry', Date.now())
            }).catch((err) => {
                console.log(err)
            })
        }

        if (!window.localStorage.getItem('publicKey') || parseInt(Date.now()) - parseInt(window.localStorage.getItem('publicKeyExpiry')) > 86400000) {
            getPublicKey();
        } else {
            const openpgpPublicKey = window.localStorage.getItem('publicKey')
            const keyArray = openpgpPublicKey.split("$")
            setPublicKey({
                keyId: keyArray[1],
                publicKey: keyArray[0]
            })
        }

    }, [])

    const handleCardChange = (selectedInput) => (e) => {
        handlerObj = { ...cardValues };
        handlerObj[selectedInput] = e.target.value;
        setCardValues({ ...handlerObj })
    }

    const handleExpiryChange = (date) => {
        setExpiryDate(date)
        handlerObj = { ...cardValues };
        handlerObj['expiry'] = dateFormat(date, "mm/yy");
        handlerObj['expiryMonth'] = dateFormat(date, "mm");
        handlerObj['expiryYear'] = dateFormat(date, "yyyy");
        setCardValues({ ...handlerObj })
    }

    const handleCredit = async (e) => {
        e.preventDefault();
        setErrors({})
        const validAmount = /[+-]?([0-9]*[.])?[0-9]+/
        errorHandlerObj = {
            invalidAmountError: "",
            thresholdAmountError: "",
            numberError: "",
            nameError: "",
            expiryError: "",
            cvvError: "",
        }
        if (cardValues['amount'].length === 0 || !validAmount.test(cardValues['amount'])) {
            errorHandlerObj['invalidAmountError'] = errorObj['invalidAmountError']
        } else {
            if (parseFloat(cardValues['amount']) < 1.00 || parseFloat(cardValues['amount']) > 500.00) {
                errorHandlerObj['thresholdAmountError'] = errorObj['thresholdAmountError']
            }
        }
        if (!valid.number(cardValues['number']).isValid) {
            errorHandlerObj['numberError'] = errorObj['numberError']
        }
        if (!valid.cardholderName(cardValues['name']).isValid) {
            errorHandlerObj['nameError'] = errorObj['nameError']
        }
        if (!valid.expirationDate(cardValues['expiry']).isValid) {
            errorHandlerObj['expiryError'] = errorObj['expiryError']
        }
        if (!valid.cvv(cardValues['cvv']).isValid) {
            errorHandlerObj['cvvError'] = errorObj['cvvError']
        }
        if (
            errorHandlerObj['nameError'] === "" &&
            errorHandlerObj['numberError'] === "" &&
            errorHandlerObj['expiryError'] === "" &&
            errorHandlerObj['cvvError'] === "" &&
            errorHandlerObj['invalidAmountError'] === "" &&
            errorHandlerObj['thresholdAmountError'] === ""
        ) {
            const cardDetails = {
                number: cardValues['number'],
                cvv: cardValues['cvv']
            }
            const cvv = {
                cvv: cardValues['cvv']
            }

            const encryptedDataCvv = await encrypt(cvv, publicKey)

            const encryptedData = await encrypt(cardDetails, publicKey)
            const { encryptedMessage, keyId } = encryptedData

            props.handleCreateCreditBody({
                choice: "new",
                email: `${window.localStorage.getItem("email")}`,
                expiryMonth: `${cardValues['expiryMonth']}`,
                expiryYear: `${cardValues['expiryYear']}`,
                amount: `${cardValues['amount']}`,
                keyId: `${keyId}`,
                encryptedData: `${encryptedMessage}`,
                encryptedCvv: `${encryptedDataCvv.encryptedMessage}`
            })
        } else {
            setErrors({ ...errorHandlerObj })
            console.log("Credit Failed")
            console.log(errorHandlerObj)
        }

    }

    const handleFocus = (selectedInput) => (e) => {
        handlerObj = { ...cardValues };
        handlerObj['focus'] = selectedInput;
        setCardValues({ ...handlerObj })
    }

    return (
        <>
            <div className="col-lg-6 col-md-6">
                <div className="form-position">
                    <Cards
                        cvc={cardValues['cvv']}
                        expiry={cardValues['expiry']}
                        focused={cardValues['focus']}
                        name={cardValues['name']}
                        number={cardValues['number']}
                    />
                </div>
            </div>
            <div className="col-lg-6 col-md-6">
                <h3 style={{ marginBottom: "20px" }}>Credit Card Details</h3>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicNumber">
                        <Form.Label>Amount:</Form.Label>
                        <Form.Control value={cardValues['amount']} onChange={handleCardChange('amount')} placeholder="Enter credit amount" />
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
                        <Form.Label>Card Number:</Form.Label>
                        <Form.Control value={cardValues['number']} onFocus={handleFocus("number")} onChange={handleCardChange('number')} placeholder="Enter card number" />
                        {errors['numberError'] === "" ? <></> : <div className='error-msg'>{errors['numberError']}</div>}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Card Holder Name:</Form.Label>
                        <Form.Control value={cardValues['name']} onFocus={handleFocus("name")} onChange={handleCardChange('name')} placeholder="Enter card holder name" />
                        {errors['nameError'] === "" ? <></> : <div className='error-msg'>{errors['nameError']}</div>}
                    </Form.Group>
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <Form.Group className="mb-3" controlId="formBasicExpiry">
                                <Form.Label>Expiry Date</Form.Label>
                                <DatePicker
                                    selected={expiryDate}
                                    onChange={(date) => handleExpiryChange(date)}
                                    onFocus={handleFocus("expiry")}
                                    placeholderText="MM/YY"
                                    dateFormat="MM/yy"
                                    showMonthYearPicker
                                />
                                {errors['expiryError'] === "" ? <></> : <div className='error-msg'>{errors['expiryError']}</div>}
                            </Form.Group>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <Form.Group className="mb-3" controlId="formBasicCVV">
                                <Form.Label>CVV</Form.Label>
                                <Form.Control value={cardValues['cvv']} onFocus={handleFocus("cvc")} onChange={handleCardChange('cvv')} placeholder="Enter CVV" />
                                {errors['cvvError'] === "" ? <></> : <div className='error-msg'>{errors['cvvError']}</div>}
                            </Form.Group>
                        </div>
                    </div>
                    <button className="me-btn inner-text" type="submit" style={{ float: 'left', marginRight: '20px' }} onClick={handleCredit}>
                        Add Credit
                    </button>
                    <button className="me-btn inner-text" type="submit" style={{ float: 'right' }} onClick={props.handleBackToProfile}>
                        Back
                    </button>
                </Form>
            </div>
        </>
    );
}

export default CreditPage;