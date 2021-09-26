import React, { useState, useEffect } from 'react';
import './css/MyWallet.css';
const TronWeb = require('tronweb');
const fullNode = 'https://api.shasta.trongrid.io';
const solidityNode = 'https://api.shasta.trongrid.io';
const eventServer = 'https://api.shasta.trongrid.io';
const privateKey = process.env.REACT_APP_PRIVATE_KEY;
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

const USDC_CONTRACT_ADDRESS = process.env.REACT_APP_USDC_TOKEN

const MyWallet = (props) => {

    const [userBalance, setUserBalance] = useState(0)

    useEffect(() => {

        const getBalance = async () => {
            const contract = await tronWeb.contract().at(USDC_CONTRACT_ADDRESS);
            const balance = await contract.balanceOf(window.localStorage.getItem("address")).call();
            setUserBalance(parseInt(tronWeb.fromSun(balance.toString())))
        }

        if (window.localStorage.getItem("email")) {
            getBalance()
        }

    }, [])

    return (
        <>
            <div className="me-my-wallet-profile">
                <div className="me-my-wallet-head">
                    <div className="me-wallet-name">
                        <h4>Wallet</h4>
                    </div>
                </div>
                <div className="me-my-wallet-body">
                    <p className="me-wallet-balance">BALANCE : {userBalance} USDC</p>
                    <div className="me-btns me-padder-top-low">
                        <div className="me-verify-btn">
                            <button className="me-btn" onClick={props.handleOpenCredit}>Credit</button>
                        </div>
                        <div className="me-back-btn">
                            <button className="me-btn" onClick={props.handleOpenDebit}>Debit</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyWallet;