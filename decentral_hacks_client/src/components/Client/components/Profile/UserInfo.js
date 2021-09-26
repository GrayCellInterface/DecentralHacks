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
                                    <p><b>Wallet Address:</b></p>
                                </div>
                                <div className="me-profile-data-right">
                                    <p>{window.localStorage.getItem("address")}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <MyWallet
                    handleOpenCredit={props.handleOpenCredit}
                    handleOpenDebit={props.handleOpenDebit}
                />
            </div>

        </>
    );
}

export default UserInfo;