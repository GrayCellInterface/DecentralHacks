import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { iso31661 } from 'iso-3166'
import './css/DebitPage.css'

var aba = require("abavalidator");
var BIC = require('swift-bic');
var IBAN = require('iban');
const TronWeb = require('tronweb');
const fullNode = 'https://api.shasta.trongrid.io';
const solidityNode = 'https://api.shasta.trongrid.io';
const eventServer = 'https://api.shasta.trongrid.io';
const privateKey = process.env.REACT_APP_PRIVATE_KEY;
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

const USDC_CONTRACT_ADDRESS = process.env.REACT_APP_USDC_TOKEN

const DebitPage = (props) => {

    const errorObj = {
        invalidAmountError: "Invalid amount.",
        thresholdAmountError: "You do not have sufficient balance",
        bankNameError: "Invalid bank name",
        cityError: "This field should not be empty",
        districtError: "The district should be a 2-character long code",
        accountNumberError: "Invalid account number",
        routingNumberError: "Invalid routing number",
        ibanError: "Invalid IBAN"
    };


    const [selectedBankType, setSelectedBankType] = useState("")
    const [countries, setCountries] = useState([])
    const [userBalance, setUserBalance] = useState(0)
    const [errors, setErrors] = useState({});
    const [bankValues, setBankValues] = useState({
        country: '',
        city: '',
        district: '',
        bankName: '',
        amount: '',
        accountNumber: '',
        routingNumber: '',
        iban: '',
    })

    let handlerObj;
    let errorHandlerObj;

    useEffect(() => {
        setCountries(iso31661);
        const getBalance = async () => {
            const contract = await tronWeb.contract().at(USDC_CONTRACT_ADDRESS);
            const balance = await contract.balanceOf(window.localStorage.getItem("address")).call();
            setUserBalance(parseInt(tronWeb.fromSun(balance.toString())))
        }

        if (window.localStorage.getItem("email")) {
            getBalance()
        }

    }, [])

    const handleBankSelection = (e) => {
        setBankValues({
            country: '',
            city: '',
            district: '',
            bankName: '',
            amount: '',
            accountNumber: '',
            routingNumber: '',
            iban: '',
        })
        if (e.target.value === "US BANK") {
            handlerObj = { ...bankValues };
            handlerObj["country"] = "US";
            setBankValues({ ...handlerObj })
        }
        setSelectedBankType(e.target.value)
    }

    const handleCountrySelection = (e) => {
        handlerObj = { ...bankValues };
        handlerObj["country"] = e.target.value;
        setBankValues({ ...handlerObj })
    }

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
        const validName = /^[a-zA-Z][a-zA-Z ]*$/
        errorHandlerObj = {
            invalidAmountError: "",
            thresholdAmountError: "",
            bankNameError: "",
            cityError: "",
            districtError: "",
            accountNumberError: "",
            routingNumberError: "",
            ibanError: ""
        }
        if (bankValues['amount'].length === 0 || !validAmount.test(bankValues['amount'])) {
            errorHandlerObj['invalidAmountError'] = errorObj['invalidAmountError']
        } else {
            if (parseFloat(bankValues['amount']) - 5000.00 < 0) {
                errorHandlerObj['thresholdAmountError'] = errorObj['thresholdAmountError']
            }
        }
        if (selectedBankType === "US BANK" || selectedBankType === "NON-IBAN") {
            if (bankValues['accountNumber'] === "") {
                errorHandlerObj['accountNumberError'] = errorObj['accountNumberError']
            }
        }
        if (selectedBankType === "IBAN" || selectedBankType === "NON-IBAN") {
            if (bankValues["city"].length === 0 || !validName.test(bankValues['city'])) {
                errorHandlerObj["cityError"] = errorObj["cityError"];
            }
        }
        if (bankValues["country"] === "US" || bankValues["country"] === "CA") {
            if (!validDistrict.test(bankValues['district'])) {
                errorHandlerObj['districtError'] = errorObj['districtError']
            }
        }
        if (selectedBankType === "US BANK") {
            if (!aba.validate(bankValues['routingNumber'])) {
                errorHandlerObj['routingNumberError'] = errorObj['routingNumberError']
            }
        }
        if (selectedBankType === "IBAN") {
            if (!IBAN.isValid(bankValues['iban'])) {
                errorHandlerObj['ibanError'] = errorObj['ibanError']
            }
        }
        if (selectedBankType === "NON-IBAN") {
            if (!BIC.isValid(bankValues['routingNumber'])) {
                errorHandlerObj['routingNumberError'] = errorObj['routingNumberError']
            }
            if (bankValues['bankName'].length === 0 || !validName.test(bankValues['bankName'])) {
                errorHandlerObj['bankNameError'] = errorObj['bankNameError']
            }
        }
        if (
            errorHandlerObj['invalidAmountError'] === "" &&
            errorHandlerObj['thresholdAmountError'] === "" &&
            errorHandlerObj["cityError"] === "" &&
            errorHandlerObj['accountNumberError'] === "" &&
            errorHandlerObj['ibanError'] === "" &&
            errorHandlerObj['routingNumberError'] === "" &&
            errorHandlerObj['bankNameError'] === "" &&
            errorHandlerObj['districtError'] === ""
        ) {
            console.log("Valid Bank Details")
        } else {
            setErrors({ ...errorHandlerObj })
            console.log("Debit failed")
            console.log(bankValues)
            console.log(errorHandlerObj)
        }

    }

    const renderForm = () => {
        if (selectedBankType === "") {
            return (
                <>
                    <Form.Text>Please select one of the bank types to continue.</Form.Text>
                    <button onClick={props.handleBackToProfile} className="me-btn inner-text" type="submit" style={{ display: "block", marginTop: "30px" }} >
                        Back
                    </button>
                </>
            )
        } else {
            let district;
            const countrySelector = (
                <>
                    <Form.Group className="mb-3" controlId="formBasicCountry">
                        <Form.Label>Country</Form.Label>
                        <select style={{ width: "100%", height: "50px", display: 'block', borderRadius: '5px', borderColor: '#D3D3D3' }}
                            onChange={handleCountrySelection}>
                            {countries.map((country, index) => {
                                return (
                                    <option value={country.alpha2} key={index} >
                                        {country.name}
                                    </option>
                                )
                            })}
                        </select>
                    </Form.Group>
                </>
            )
            const submitButton = (
                <>
                    <br />
                    <div className="btn-wrapper">
                        <button onClick={handleDebit} className="me-btn inner-text" type="submit" style={{ float: 'left', marginRight: '20px', marginBottom: "40px" }}>
                            Withdraw Now
                        </button>
                        <button onClick={props.handleBackToProfile} className="me-btn inner-text" type="submit" style={{ float: 'right', marginBottom: "40px" }} >
                            Back
                        </button>
                    </div>
                </>
            )
            const amount = (
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
            )
            if (selectedBankType === "IBAN" || selectedBankType === "NON-IBAN") {
                if (bankValues['country'] === "CA" || bankValues['country'] === "US") {
                    district = (
                        <Form.Group className="mb-3" controlId="formBasicCVV">
                            <Form.Label>District</Form.Label>
                            <Form.Control value={bankValues['district']} onChange={handleDebitChange('district')} placeholder="Enter 2-letter district code" />
                            {errors['districtError'] === "" ? <></> : <div className='error-msg'>{errors['districtError']}</div>}
                        </Form.Group>
                    )
                } else {
                    district = (
                        <></>
                    )
                }
            }
            if (selectedBankType === "US BANK") {
                return (
                    <>
                        {amount}
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
                        {submitButton}
                    </>
                )
            }
            else if (selectedBankType === "IBAN") {
                return (
                    <>
                        {amount}
                        <Form.Group className="mb-3" controlId="formBasicNumber">
                            <Form.Label>IBAN:</Form.Label>
                            <Form.Control value={bankValues['iban']} onChange={handleDebitChange('iban')} placeholder="Enter iban" />
                            {errors['ibanError'] === "" ? <></> : <div className='error-msg'>{errors['ibanError']}</div>}
                        </Form.Group>
                        <Form.Text style={{ fontSize: "17px" }}><br />Bank Address: </Form.Text>
                        <Form.Group className="mb-3" controlId="formBasicNumber">
                            <Form.Label><br />City:</Form.Label>
                            <Form.Control value={bankValues['city']} onChange={handleDebitChange('city')} placeholder="Enter city" />
                            {errors['cityError'] === "" ? <></> : <div className='error-msg'>{errors['cityError']}</div>}
                        </Form.Group>
                        {countrySelector}
                        {district}
                        {submitButton}
                    </>
                )
            }
            else {
                return (
                    <>
                        {amount}
                        <Form.Group className="mb-3" controlId="formBasicNumber">
                            <Form.Label>Account Number:</Form.Label>
                            <Form.Control value={bankValues['accountNumber']} onChange={handleDebitChange('accountNumber')} placeholder="Enter account number" />
                            {errors['accountNumberError'] === "" ? <></> : <div className='error-msg'>{errors['accountNumberError']}</div>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicNumber">
                            <Form.Label>Rounting Number (SWIFT/BIC):</Form.Label>
                            <Form.Control value={bankValues['routingNumber']} onChange={handleDebitChange('routingNumber')} placeholder="Enter routing number" />
                            {errors['routingNumberError'] === "" ? <></> : <div className='error-msg'>{errors['routingNumberError']}</div>}
                        </Form.Group>
                        <Form.Text style={{ fontSize: "17px" }}><br />Bank Address: </Form.Text>
                        <Form.Group className="mb-3" controlId="formBasicNumber">
                            <Form.Label><br />Bank Name:</Form.Label>
                            <Form.Control value={bankValues['bankName']} onChange={handleDebitChange('bankName')} placeholder="Enter bank name" />
                            {errors['bankNameError'] === "" ? <></> : <div className='error-msg'>{errors['bankNameError']}</div>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicNumber">
                            <Form.Label>City:</Form.Label>
                            <Form.Control value={bankValues['city']} onChange={handleDebitChange('city')} placeholder="Enter city" />
                            {errors['cityError'] === "" ? <></> : <div className='error-msg'>{errors['cityError']}</div>}
                        </Form.Group>
                        {countrySelector}
                        {district}
                        {submitButton}
                    </>
                )
            }

        }
    }

    return (
        <>
            <div className="col-12">
                <h3 style={{ marginBottom: "20px" }}>Bank Details</h3>
                <Form>
                    <div key={'inline-radio'} className="mb-3">
                        <Form.Check
                            inline
                            label="US BANK"
                            value="US BANK"
                            name="group1"
                            type='radio'
                            id='inline-radio-1'
                            onChange={handleBankSelection}
                        />
                        <Form.Check
                            inline
                            label="IBAN"
                            value="IBAN"
                            name="group1"
                            type='radio'
                            id='inline-radio-2'
                            onChange={handleBankSelection}
                        />
                        <Form.Check
                            inline
                            label="NON-IBAN"
                            value="NON-IBAN"
                            name="group1"
                            type='radio'
                            id='inline-radio-3'
                            onChange={handleBankSelection}
                        />
                    </div>
                    {renderForm()}
                </Form>
            </div>
        </>
    );
}

export default DebitPage;