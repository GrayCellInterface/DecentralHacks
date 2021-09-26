import React, { useState, useEffect } from 'react';
import { Card } from "react-bootstrap";
import './css/CheckoutPage.css'
const TronWeb = require('tronweb')
const fullNode = 'https://api.shasta.trongrid.io';
const solidityNode = 'https://api.shasta.trongrid.io';
const eventServer = 'https://api.shasta.trongrid.io';
const privateKey = process.env.REACT_APP_PRIVATE_KEY;
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);


const USDC_CONTRACT_ADDRESS = process.env.REACT_APP_USDC_TOKEN

const CheckoutPage = (props) => {

    const [userBalance, setUserBalance] = useState(0)

    useEffect(() => {

        const getBalance = async () => {
            const contract = await tronWeb.contract().at(USDC_CONTRACT_ADDRESS);
            const balance = await contract.balanceOf(window.localStorage.getItem("address")).call();
            //const balance = await contract.balanceOf("TEGmWL8QsLqe7ivG3Rir9wPoPVJGLCvtMC").call();
            setUserBalance(parseInt(tronWeb.fromSun(balance.toString())))

        }

        if (window.localStorage.getItem("email")) {
            getBalance()
        }

    }, [])

    const handlePayment = () => {
        if (userBalance < parseInt(props.productPrice)) {
            console.log("Balance Not sufficient")
        } else {
            console.log("Transfer completed!")
        }
    }

    return (
        <>
            <Card className="checkout-page">
                <Card.Header className="checkout-header text-center"><div className="checkout-heading">CHECKOUT</div></Card.Header>
                <Card.Body className="text-center">
                    <div className="row">
                        <div className="col-12">
                            <Card.Title><br />PRODUCT DETAILS</Card.Title>
                            <Card.Text style={{ marginTop: "30px" }}>
                                <div className="d-flex justify-content-center">
                                    <div className="col-6">
                                        <span style={{ float: "left" }}><b>Product Name: </b></span>
                                        <span style={{ float: "right" }}>{props.productName}</span>
                                    </div>
                                </div>
                                <br />
                                <div className="d-flex justify-content-center">
                                    <div className="col-6">
                                        <span style={{ float: "left" }}><b>Quantity: </b></span>
                                        <span style={{ float: "right" }}>1</span>
                                    </div>
                                </div>
                                <br />
                                <div className="d-flex justify-content-center">
                                    <div className="col-6">
                                        <span style={{ float: "left" }}><b>Product Price: </b></span>
                                        <span style={{ float: "right" }}>{props.productPrice}</span>
                                    </div>
                                </div>
                                <br />
                                <div className="d-flex justify-content-center">
                                    <div className="col-6">
                                        <span style={{ float: "left" }}><b>Delivery time: </b></span>
                                        <span style={{ float: "right" }}>{props.deliveryTime} DAYS</span>
                                    </div>
                                </div>
                            </Card.Text>
                            <strong>YOUR BALANCE: {userBalance} USDC</strong>
                        </div>
                    </div>
                    <br />
                    <div className="d-flex justify-content-center">
                        <button onClick={handlePayment} className="me-btn" style={{ float: "left", marginRight: "10px" }}>Pay Now</button>
                        <button onClick={props.handleGoBackToShop} className="me-btn" style={{ float: "right" }}>Back</button>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
}

export default CheckoutPage