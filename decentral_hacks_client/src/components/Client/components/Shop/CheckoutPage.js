import React, { useState } from 'react';
import ConfirmationCheckout from './ConfirmCheckout';
import { Card } from "react-bootstrap";
import './css/CheckoutPage.css'

const CheckoutPage = (props) => {

    const [checkoutBody, setCheckoutBody] = useState({})
    const [transferBody, setTransferBody] = useState({})
    const [openCheckoutConfirmation, setOpenCheckoutConfirmation] = useState(false)

    const handleCloseCheckoutConfirmation = () => {
        setOpenCheckoutConfirmation(false)
    }

    const handleBackToShop = () => {
        setOpenCheckoutConfirmation(false)
        props.handleGoBackToShop()
    }

    const handlePayment = () => {
        if (parseFloat(props.selectedProduct.p_price) > parseFloat(window.localStorage.getItem('balance'))) {
            console.log("You do not have enough balance to make this payment.") //Still left
        } else {
            setTransferBody({
                tot_amount: parseFloat((props.selectedProduct.p_price).toFixed(2)),
                fee: parseFloat((parseFloat(props.selectedProduct.p_price) * 0.035).toFixed(2)),
                email: window.localStorage.getItem('email')
            })
            setCheckoutBody({
                p_id: props.selectedProduct._id,
                email: window.localStorage.getItem('email'),
                name: window.localStorage.getItem('username'),
                amount: props.selectedProduct.p_price,
                orderName: props.selectedProduct.p_name
            })
            setOpenCheckoutConfirmation(true)
        }
    }

    return (
        <>
            <Card className="checkout-page" style={{ marginBottom: "30px" }}>
                <Card.Header className="checkout-header text-center"><div className="checkout-heading">CHECKOUT</div></Card.Header>
                <Card.Body className="text-center">
                    <div className="row">
                        <div className="col-12">
                            <Card.Title><br />PRODUCT DETAILS</Card.Title>
                            <Card.Text style={{ marginTop: "30px" }}>
                                <div className="d-flex justify-content-center">
                                    <div className="col-6">
                                        <span style={{ float: "left" }}><b>Product Name: </b></span>
                                        <span style={{ float: "right" }}>{props.selectedProduct.p_name}</span>
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
                                        <span style={{ float: "left" }}><b>Delivery time: </b></span>
                                        <span style={{ float: "right" }}>{props.selectedProduct.p_delivery} DAYS</span>
                                    </div>
                                </div>
                                <br />
                                <div className="d-flex justify-content-center">
                                    <div className="col-6">
                                        <span style={{ float: "left" }}><b>Product Price : </b></span>
                                        <span style={{ float: "right" }}>{props.selectedProduct.p_price} USDC</span>
                                    </div>
                                </div>
                                <br />
                                <div className="d-flex justify-content-center">
                                    <div className="col-6">
                                        <span style={{ float: "left" }}><b>Transaction Fee: </b></span>
                                        <span style={{ float: "right" }}>{(parseFloat(props.selectedProduct.p_price) * 0.035).toFixed(2)} USDC</span>
                                    </div>
                                </div>
                                <hr />
                                <br />
                                <div className="d-flex justify-content-center">
                                    <div className="col-6" style={{ fontSize: "22px" }}>
                                        <span style={{ float: "left" }}><b>Total Product Price : </b></span>
                                        <span style={{ float: "right" }}>{(parseFloat(props.selectedProduct.p_price) + (parseFloat(props.selectedProduct.p_price) * 0.035)).toFixed(2)} USDC</span>
                                    </div>
                                </div>
                                <br />
                                <hr />
                            </Card.Text>
                            <strong>YOUR BALANCE: {window.localStorage.getItem('balance')} USDC</strong>
                        </div>
                    </div>
                    <br />
                    <div className="d-flex justify-content-center">
                        <button onClick={handlePayment} className="me-btn" style={{ float: "left", marginRight: "10px" }}>Pay Now</button>
                        <button onClick={props.handleGoBackToShop} className="me-btn" style={{ float: "right" }}>Back</button>
                    </div>
                </Card.Body>
            </Card>
            <ConfirmationCheckout
                openCheckoutConfirmation={openCheckoutConfirmation}
                handleBackToShop={handleBackToShop}
                handleCloseCheckoutConfirmation={handleCloseCheckoutConfirmation}
                transferBody={transferBody}
                checkoutBody={checkoutBody}
            />
        </>
    );
}

export default CheckoutPage