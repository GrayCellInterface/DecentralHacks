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
                    <ul>
                        <li className="guide-list-items">
                            <p>• <em>Your credit will reflect in your wallet within 1-2 mins.</em></p>
                        </li>
                        <li className="guide-list-items">
                            <p>• <em>The receiving address for your wallet is always different for security purposes.</em></p>
                        </li>
                        <li className="guide-list-items">
                            <p>
                                • <em>Use the provided seller address to trace your transactions on the <a target="_blank" rel="noreferrer" style={{ textDecoration: "none" }} href="https://shasta.tronscan.org/#/contract/TFGBSrddCjLJAwuryZ9DUxtEmKv13BPjnh/transactions">blockchain explorer.</a></em>
                            </p>
                        </li>
                        <li className="guide-list-items">
                            <p>• <em>Your card and bank details expires in 24hrs for security reasons.</em></p>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default MyWallet;