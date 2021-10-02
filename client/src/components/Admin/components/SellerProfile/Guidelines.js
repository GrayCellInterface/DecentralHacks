import React from 'react';

const Guidelies = () => {

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
                            <p>• <em>Your settlement will reflect in your wallet withinin 1-2 mins.</em></p>
                        </li>
                        <li className="guide-list-items">
                            <p>
                                • <em>Use your wallet address to trace your transactions on the <a target="_blank" rel="noreferrer" style={{ textDecoration: "none" }} href="https://shasta.tronscan.org/#/contract/TFGBSrddCjLJAwuryZ9DUxtEmKv13BPjnh/transactions">blockchain explorer.</a></em>
                            </p>
                        </li>
                        <li className="guide-list-items">
                            <p>• <em>Any deletion in the products will be permanent and will require you to add the product again.</em></p>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Guidelies;