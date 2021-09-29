import React, { useState, useEffect } from 'react';
import axios from 'axios'
import CreditPage from './CreditPage';
import DebitPage from './DebitPage';
import UserInfo from './UserInfo';
import ConfirmationModal from './ConfirmationModal';
import ConfirmationDebit from './ConfirmationDebit';
import Prompt from './Prompt';
import MyTransactions from './MyTransactions';
import './css/Profile.css'
//const { v4: uuidv4 } = require("uuid");

const Profile = () => {

    const [openCredit, setOpenCredit] = useState(false);
    const [openPrompt, setOpenPrompt] = useState(false)
    const [openDebit, setOpenDebit] = useState(false);
    const [creditBody, setCreditBody] = useState({})
    const [debitBody, setDebitBody] = useState({})
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false)
    const [openDebitConfirmation, setOpenDebitConfirmation] = useState(false)
    const [choice, setChoice] = useState("")
    const [creditId, setCreditId] = useState("")
    const [debitId, setDebitId] = useState("")

    useEffect(() => {

        // const headers = {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //     Authorization:
        //         "Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
        // };

        // const url = "https://api-sandbox.circle.com/v1/transfers"
        // axios.post(url, {
        //     idempotencyKey: uuidv4(),
        //     source: {
        //         type: "wallet",
        //         id: "1000177235"
        //     },
        //     destination: {
        //         type: "blockchain",
        //         address: "TEGmWL8QsLqe7ivG3Rir9wPoPVJGLCvtMC",
        //         chain: "TRX"
        //     },
        //     amount: {
        //         amount: "1000",
        //         currency: "USD"
        //     }
        // }, { headers }).then((res) => {
        //     console.log(res)
        // }).catch((error) => {
        //     console.log(error.response.data)
        // })
        const getAccountDetails = async () => {
            await axios.get(`${process.env.REACT_APP_BACKEND_API}/accounts/get-walletId/${window.localStorage.getItem('email')}`)
                .then((res) => {
                    window.localStorage.setItem('balance', res.data.balance)
                    console.log(res.data)
                }).catch((error) => {
                    console.log(error.response)
                })

            await axios.get(`${process.env.REACT_APP_BACKEND_API}/auth/get-id/${window.localStorage.getItem('email')}`)
                .then((res) => {
                    setCreditId(res.data.data.cardId)
                    setDebitId(res.data.data.bankId)
                }).catch((error) => {
                    console.log(error.response)
                })
        }

        getAccountDetails()

    })

    const handleOpenCredit = () => {
        if (creditId === "false") {
            setOpenCredit(true);
        } else {
            handleOpenPrompt("credit")
        }

    }

    const handleOpenDebit = () => {
        if (debitId === "false") {
            setOpenDebit(true);
        } else {
            handleOpenPrompt("debit")
        }
    }

    const handleOpenPrompt = (choice) => {
        if (choice === "credit") {
            setChoice("credit")
            setOpenPrompt(true)
        } else {
            setChoice("debit")
            setOpenPrompt(true)
        }
    }

    const handleClosePrompt = () => {
        setOpenPrompt(false)
    }

    const handleDifferentCredit = () => {
        handleClosePrompt();
        setOpenCredit(true);
    }

    const handleDifferentDebit = () => {
        handleClosePrompt();
        setOpenDebit(true);
    }

    const handleCreateCreditBody = (body) => {
        setCreditBody(body)
        setOpenPrompt(false)
        setOpenConfirmationModal(true)
    }

    const handleCreateDebitBody = (body) => {
        setDebitBody(body)
        setOpenPrompt(false)
        setOpenDebitConfirmation(true)
    }

    const handleCloseConfirmationModal = () => {
        setOpenConfirmationModal(false)
    }

    const handleCloseDebitConfirmation = () => {
        setOpenDebitConfirmation(false)
    }

    const handleBackToProfile = (e) => {
        e.preventDefault();
        setOpenPrompt(false);
        setOpenConfirmationModal(false);
        setOpenDebitConfirmation(false);
        setOpenCredit(false);
        setOpenDebit(false);
    }

    const renderProfile = () => {
        if (openCredit) {
            return (
                < CreditPage
                    handleBackToProfile={handleBackToProfile}
                    handleCreateCreditBody={handleCreateCreditBody}
                />
            )
        } else {
            if (openDebit) {
                return (
                    <DebitPage
                        handleBackToProfile={handleBackToProfile}
                        handleCreateDebitBody={handleCreateDebitBody}
                    />
                )
            } else {
                return (
                    <>
                        <UserInfo
                            handleOpenCredit={handleOpenCredit}
                            handleOpenDebit={handleOpenDebit}
                        />
                        <MyTransactions />
                    </>
                )
            }
        }
    }

    return (
        <>
            <div className="me-my-account">
                <div className="container">
                    <div className="row">
                        {renderProfile()}
                    </div>
                </div>
            </div>
            <Prompt
                openPrompt={openPrompt}
                handleClosePrompt={handleClosePrompt}
                handleDifferentCredit={handleDifferentCredit}
                handleDifferentDebit={handleDifferentDebit}
                handleBackToProfile={handleBackToProfile}
                handleCreateCreditBody={handleCreateCreditBody}
                handleCreateDebitBody={handleCreateDebitBody}
                choice={choice}
            />
            <ConfirmationModal
                creditBody={creditBody}
                handleCloseConfirmationModal={handleCloseConfirmationModal}
                openConfirmationModal={openConfirmationModal}
                handleBackToProfile={handleBackToProfile}
            />
            <ConfirmationDebit
                debitBody={debitBody}
                handleCloseDebitConfirmation={handleCloseDebitConfirmation}
                openDebitConfirmation={openDebitConfirmation}
                handleBackToProfile={handleBackToProfile}
            />
        </>
    );
}

export default Profile;