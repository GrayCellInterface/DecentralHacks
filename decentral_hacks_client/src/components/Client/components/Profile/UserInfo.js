import React from 'react';
import MyWallet from './MyWallet';
import './css/UserInfo.css'

const UserInfo = (props) => {

    return (
        <>
            <div className="col-lg-6">
                <div className="me-my-account-profile">
                    <div className="me-my-profile-head">
                        <div className="me-profile-name">
                            <h4>Account Details</h4>
                        </div>
                    </div>
                    <div className="me-my-profile-body">
                        <ul>
                            <li>
                                <div className="me-profile-data">
                                    <p><b>Username:</b></p>
                                </div>
                                <div className="me-profile-data-right">
                                    <p>{window.localStorage.getItem("username")}</p>
                                </div>
                            </li>
                            <li>
                                <div className="me-profile-data">
                                    <p><b>Email:</b></p>
                                </div>
                                <div className="me-profile-data-right">
                                    <p>{window.localStorage.getItem("email")}</p>
                                </div>
                            </li>
                            <li>
                                <div className="me-profile-data">
                                    <p><b>Balance:</b></p>
                                </div>
                                <div className="me-profile-data-right">
                                    <p>{window.localStorage.getItem("balance")} USDC</p>
                                </div>
                            </li>
                        </ul>
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
                <MyWallet />
            </div>

        </>
    );
}

export default UserInfo;