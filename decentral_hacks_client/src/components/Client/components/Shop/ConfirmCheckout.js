import React, { useState } from "react";
import axios from 'axios'
import { Modal, Spinner } from 'react-bootstrap';

const ConfirmationCheckout = (props) => {

    const [modalStage, setModalStage] = useState("confirm")

    const executeCheckout = async () => {
        setModalStage("transfer")
        //executeTransferToSeller()
        const transferId = await executeTransferToSeller()
        console.log(transferId)
        setModalStage("checkingStatus")
        const status = await waitForConfirmation(transferId)
        if (status === "success") {
            setModalStage("checkout")
            const deliveryStatus = await checkout()
            console.log(deliveryStatus)
            if (deliveryStatus === "Delivery Started") {
                setModalStage("checkoutSuccess")
                console.log("Checkout Successful")
            } else {
                setModalStage("checkoutFailed")
                console.log("Checkout Failed")
            }
        } else {
            setModalStage("checkoutFailed")
            console.log("Checkout Failed")
        }


    }

    const executeTransferToSeller = async () => {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_API}/shop/transfer`, props.transferBody)
        return response.data.transferIdSeller
        //console.log(props.transferBody)
    }

    const waitForConfirmation = async (transferId) => {
        let count = 0;
        let status;
        return await new Promise(resolve => {
            const getStatus = setInterval(async () => {
                count++
                status = (await circleCheck(transferId)).data.data.status
                if ((status !== "pending" && status === "complete") && count === 5) {
                    resolve("failed")
                    clearInterval(getStatus)
                }
                if (status === "pending" || status === "complete") {
                    resolve("success")
                    clearInterval(getStatus)
                }
            }, 5000)
        })


    }

    const circleCheck = async (transferId) => {
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization:
                "Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
        };

        const url = `https://api-sandbox.circle.com/v1/transfers/${transferId}`

        return await axios.get(url, { headers })

    }

    const checkout = async () => {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_API}/shop/checkout`, props.checkoutBody)
        return response.data.status
    }

    const handleCloseCheckoutConfirmation = () => {
        setModalStage("confirm")
        props.handleCloseCheckoutConfirmation()
    }

    const handleBackToShop = (e) => {
        setModalStage('confirm')
        props.handleBackToShop(e)
    }

    const renderModalContent = () => {
        if (modalStage === "confirm") {
            return (
                <>
                    <p>Please click on 'Confirm Checkout' to start processing the order.</p>
                    <button onClick={executeCheckout} className="me-btn" style={{ float: 'left' }}>
                        Confirm Checkout
                    </button>
                    <button onClick={handleCloseCheckoutConfirmation} className="me-btn" style={{ float: 'right' }}>
                        Cancel
                    </button>
                </>
            )

        } else {
            let message;
            if (modalStage === "transfer") {
                message = "Executing order..."
            }
            else if (modalStage === "checkingStatus") {
                message = "Confirming payment..."
            }
            else if (modalStage === "checkout") {
                message = "Checking out..."
            }
            else if (modalStage === "checkoutSuccess") {
                message = "Checkout Successful!"
            } else {
                message = "Checkout failed."
            }

            if (modalStage !== "checkoutFailed" && modalStage !== "checkoutSuccess") {
                return (
                    <>
                        <div className="container text-center">
                            <Spinner style={{ margin: "20px 0" }} animation="border" variant="primary" />
                            <div>
                                <p>{message}</p>
                            </div>
                        </div>
                    </>
                )
            } else {
                return (
                    <>
                        <div className="container text-center">
                            <div>
                                <p style={modalStage === "checkoutFailed" ? { color: 'red' } : { color: 'green' }}>{message}</p>
                            </div>
                            <button onClick={handleBackToShop} className="me-btn">
                                Continue Shopping
                            </button>
                        </div>
                    </>
                )
            }

        }
    }

    return (
        <>
            <Modal
                show={props.openCheckoutConfirmation}
                onHide={handleCloseCheckoutConfirmation}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>CHECKOUT CONFIRMATION</Modal.Title>
                    <button className="float-right close-btn" onClick={handleCloseCheckoutConfirmation}>X</button>
                </Modal.Header>
                <Modal.Body>
                    {renderModalContent()}
                </Modal.Body>
            </Modal>

        </>
    )

}

export default ConfirmationCheckout;