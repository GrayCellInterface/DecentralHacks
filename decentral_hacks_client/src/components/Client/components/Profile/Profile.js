import React, { useState, useEffect } from 'react';
import axios from 'axios'
import CreditPage from './CreditPage';
import DebitPage from './DebitPage';
import UserInfo from './UserInfo';
import ConfirmationModal from './ConfirmationModal';
import Prompt from './Prompt';
import MyTransactions from './MyTransactions';
import './css/Profile.css'


const Profile = () => {

    const [openCredit, setOpenCredit] = useState(false);
    const [openPrompt, setOpenPrompt] = useState(false)
    const [openDebit, setOpenDebit] = useState(false);
    const [creditBody, setCreditBody] = useState({})
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false)
    const [choice, setChoice] = useState("")
    const [creditId, setCreditId] = useState("")
    const [debitId, setDebitId] = useState("")

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_BACKEND_API}/auth/get-id/${window.localStorage.getItem('email')}`)
            .then((res) => {
                console.log(res.data.data)
                setCreditId(res.data.data.cardId)
                setDebitId(res.data.data.bankId)
            }).catch((error) => {
                console.log(error.response.message)
            })

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

    const handleCloseConfirmationModal = () => {
        setOpenConfirmationModal(false)
    }

    const handleBackToProfile = (e) => {
        e.preventDefault();
        setOpenPrompt(false);
        setOpenConfirmationModal(false);
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
                choice={choice}
            />
            <ConfirmationModal
                creditBody={creditBody}
                handleCloseConfirmationModal={handleCloseConfirmationModal}
                openConfirmationModal={openConfirmationModal}
                handleBackToProfile={handleBackToProfile}
            />
        </>
    );
}

export default Profile;