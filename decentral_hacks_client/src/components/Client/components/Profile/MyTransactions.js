import React from 'react';
import './css/MyTransactions.css'

const MyTransactions = () => {

    return (
        <>
            <div className="col-lg-6">
                <div className="me-my-transactions-profile">
                    <div className="me-my-transactions-head">
                        <div className="me-transactions-name">
                            <h4>TRANSACTIONS</h4>
                        </div>
                    </div>
                    <div className="me-my-transactions-body">

                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">To/From</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default MyTransactions;