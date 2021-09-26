import React from 'react';
import './css/MyWallet.css';

const MyWallet = (props) => {

    return (
        <>
            <div className="me-my-wallet-profile">
                <div className="me-my-wallet-head">
                    <div className="me-wallet-name">
                        <h4>Wallet</h4>
                    </div>
                </div>
                <div className="me-my-wallet-body">
                    <p className="me-wallet-balance">BALANCE : {window.localStorage.getItem('balance')} USDC</p>
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