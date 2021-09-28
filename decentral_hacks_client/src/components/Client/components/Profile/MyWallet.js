import React from 'react';
import './css/MyWallet.css';

const MyWallet = (props) => {

    return (
        <>
            <div className="me-my-wallet-profile">
                <div className="me-my-wallet-head">
                    <div className="me-wallet-name">
                        <h4>Guidelines</h4>
                    </div>
                </div>
                <div className="me-my-wallet-body">
                    <p className="me-wallet-instructions">Formal instructions</p>

                </div>
            </div>
        </>
    );
}

export default MyWallet;