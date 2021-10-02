import React, { useState } from "react";
import axios from 'axios'
import { GoCheck, GoX } from "react-icons/go";
import { Modal, Spinner } from 'react-bootstrap';
const TronWeb = require('tronweb')
const fullNode = 'https://api.shasta.trongrid.io';
const solidityNode = 'https://api.shasta.trongrid.io';
const eventServer = 'https://api.shasta.trongrid.io';
const privateKey = process.env.REACT_APP_REFUND_PRIVATE_KEY;
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

const USDC_SMART_CONTRACT = "TFGBSrddCjLJAwuryZ9DUxtEmKv13BPjnh"

const RefundConfirmationModal = (props) => {

    const [modalStage, setModalStage] = useState("confirm")

    const executeRefund = async () => {
        setModalStage("transfer")
        const transactionId = await executeRefundToBuyer()
        setModalStage("checkingStatus")
        setTimeout(async () => {
            const result = await confirmBlockchainTansaction(transactionId)
            console.log(result)
            if (result === "SUCCESS") {
                setModalStage("refund")
                const status = await updateDatabase()
                console.log(status)
                if (status === "Refund Successful") {
                    setModalStage("refundSuccess")
                    window.location.href = '/client/orders'
                } else {
                    setModalStage("refundFailed")
                }
            } else {
                setModalStage("refundFailed")
            }
        }, 10000)
    }

    const executeRefundToBuyer = async () => {
        const refundAmount = tronWeb.toSun(props.refundProduct.amount)
        const usdcContract = await tronWeb.contract().at(USDC_SMART_CONTRACT)
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/accounts/get-wallet-id/${window.localStorage.getItem('email')}`)
            .catch((error) => {
                console.log(error.response.message)
            })
        const transactionId = await usdcContract.transfer(response.data.walletAddress, refundAmount).send()
        return transactionId
    }


    const confirmBlockchainTansaction = async (transactionId) => {
        const result = await tronWeb.trx.getTransaction(transactionId)
        return result.ret[0].contractRet
    }

    const updateDatabase = async () => {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_API}/status/update_cancelled`, {
            p_id: `${props.refundProduct.productId}`,
            orderId: `${props.refundProduct.orderId}`
        }).catch((error) => {
            console.log(error.response.message)
        })

        return response.data.status
    }

    const handleCloseRefundConfirmation = () => {
        setModalStage("confirm")
        props.handleCloseRefundConfirmation()
    }

    const renderModalContent = () => {
        if (modalStage === "confirm") {
            return (
                <>
                    <p>Please click on 'Confirm Refund' to start processing the refund for this product.</p>
                    <button onClick={executeRefund} className="me-btn" style={{ float: 'right' }}>
                        Confirm Refund
                    </button>
                    <button onClick={handleCloseRefundConfirmation} className="me-btn" style={{ float: 'left' }}>
                        Cancel
                    </button>
                </>
            )

        } else {
            let message;
            if (modalStage === "transfer") {
                message = "Executing refund..."
            }
            else if (modalStage === "checkingStatus") {
                message = "Confirming refund..."
            }
            else if (modalStage === "refund") {
                message = "Refunding Amount..."
            }
            else if (modalStage === "refundSuccess") {
                message = "Refund Successful!"
            } else {
                message = "Refund failed."
            }

            if (modalStage !== "refundFailed" && modalStage !== "refundSuccess") {
                return (
                    <>
                        <div className="container text-center">
                            <Spinner style={{ margin: "20px 0", color: "orange" }} animation="border" />
                            <div>
                                <p>{message}</p>
                            </div>
                            <div>
                                <p><em>**Do <b>NOT</b> click Back or refresh the page as it may lead to loosing your funds.</em></p>
                            </div>
                        </div>
                    </>
                )
            } else {
                return (
                    <>
                        <div className="container text-center">
                            {modalStage === "refundFailed"
                                ? (
                                    <>
                                        <div style={{ color: "red" }}>
                                            <GoX style={{ fontSize: "40px", margin: "25px" }} />
                                            <p>{message}</p>
                                        </div>
                                        <button onClick={handleCloseRefundConfirmation} className="me-btn">
                                            Back
                                        </button>
                                    </>)
                                : (<div style={{ color: "green" }}>
                                    <GoCheck style={{ fontSize: "40px", margin: "25px" }} />
                                    <p>{message}</p>
                                    <br />
                                </div>)}
                        </div>
                    </>
                )
            }

        }
    }

    return (
        <>
            <Modal
                show={props.openRefundConfirmation}
                onHide={handleCloseRefundConfirmation}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>REFUND CONFIRMATION</Modal.Title>
                    <button className="float-right close-btn" onClick={handleCloseRefundConfirmation}>X</button>
                </Modal.Header>
                <Modal.Body>
                    {renderModalContent()}
                </Modal.Body>
            </Modal>

        </>
    )

}

export default RefundConfirmationModal;