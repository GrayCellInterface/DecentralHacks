import React, { useState } from "react";
import axios from 'axios'
import { Modal, Spinner } from 'react-bootstrap';

const ConfirmationDebit = (props) => {

    const [modalStage, setModalStage] = useState("confirm")

    const executeDebit = async () => {
        setModalStage("transfer")
        const payoutId = await executeDebitFromMaster()
        console.log(payoutId)
        setModalStage("checkingStatus")
        const status = await waitForConfirmation("payouts", payoutId)
        if (status === "success") {
            setModalStage("blockchainTansfer")
            const transferId = await executeWalletToBlockchain()
            console.log(transferId)
            const result = await waitForConfirmation("transfers", transferId)
            console.log(result)
            if (result === "success") {
                setModalStage("debitSuccess")
                console.log("Debit Successful")
            } else {
                setModalStage("debitFailed")
                console.log("Debit Failed")
            }
        } else {
            setModalStage("debitFailed")
            console.log("Debit Failed")
        }


    }

    const executeDebitFromMaster = async () => {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_API}/accounts/payout`, props.debitBody)
        return response.data.payoutId
    }

    const waitForConfirmation = async (method, checkId) => {
        let count = 0;
        let status;
        return await new Promise(resolve => {
            const getStatus = setInterval(async () => {
                count++
                status = (await circleCheck(method, checkId)).data.data.status
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

    const circleCheck = async (method, checkId) => {
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization:
                "Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
        };

        const url = `https://api-sandbox.circle.com/v1/${method}/${checkId}`

        return await axios.get(url, { headers })

    }

    const executeWalletToBlockchain = async () => {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_API}/accounts/transfer-debit`, {
            email: `${window.localStorage.getItem('email')}`,
            amount: `${props.debitBody.amount}`
        })
        return response.data.transferId
    }

    const handleCloseDebitConfirmation = () => {
        setModalStage("confirm")
        props.handleCloseDebitConfirmation()
    }

    const handleBackToProfile = (e) => {
        setModalStage('confirm')
        props.handleBackToProfile(e)
    }

    const renderModalContent = () => {
        if (modalStage === "confirm") {
            return (
                <>
                    <p>Please click on 'Confirm Debit' to debit <b>{props.debitBody.amount} USDC</b> from your wallet.</p>
                    <button onClick={executeDebit} className="me-btn" style={{ float: 'left' }}>
                        Confirm Debit
                    </button>
                    <button onClick={handleCloseDebitConfirmation} className="me-btn" style={{ float: 'right' }}>
                        Cancel
                    </button>
                </>
            )

        } else {
            let message;
            if (modalStage === "transfer") {
                message = "Executing withdrawal..."
            }
            else if (modalStage === "checkingStatus") {
                message = "Confirming payout..."
            }
            else if (modalStage === "blockchainTansfer") {
                message = "Debiting funds..."
            }
            else if (modalStage === "debitSuccess") {
                message = "Debit was successful!"
            } else {
                message = "Debit failed."
            }

            if (modalStage !== "debitFailed" && modalStage !== "debitSuccess") {
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
                                <p style={modalStage === "debitFailed" ? { color: 'red' } : { color: 'green' }}>{message}</p>
                            </div>
                            <button onClick={handleBackToProfile} className="me-btn">
                                Back To Profile
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
                show={props.openDebitConfirmation}
                onHide={handleCloseDebitConfirmation}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>DEBIT CONFIRMATION</Modal.Title>
                    <button className="float-right close-btn" onClick={handleCloseDebitConfirmation}>X</button>
                </Modal.Header>
                <Modal.Body>
                    {renderModalContent()}
                </Modal.Body>
            </Modal>

        </>
    )

}

export default ConfirmationDebit;