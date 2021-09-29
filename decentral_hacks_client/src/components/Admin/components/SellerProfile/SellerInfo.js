import React, { useEffect, useState } from 'react';
import Guidelines from './Guidelines';
const TronWeb = require('tronweb')
const fullNode = 'https://api.shasta.trongrid.io';
const solidityNode = 'https://api.shasta.trongrid.io';
const eventServer = 'https://api.shasta.trongrid.io';
const privateKey = process.env.REACT_APP_BENEFICIARY_PRIVATE_KEY;
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

const USDC_SMART_CONTRACT = "TFGBSrddCjLJAwuryZ9DUxtEmKv13BPjnh"

const SellerInfo = (props) => {

    const [sellerBalance, setSellerBalance] = useState()

    useEffect(() => {
        const getBalance = async () => {
            const contract = await tronWeb.contract().at(USDC_SMART_CONTRACT)
            const balance = await contract.balanceOf("TVyXtKiMoG2PZpSsAnMaLZW747PSvRAQmT").call()
            setSellerBalance(tronWeb.fromSun(balance.toString()))
        }

        getBalance()
    }, [])

    return (
        <>
            <div className="col-lg-6">
                <div className="me-my-account-profile" style={{ height: "280px" }}>
                    <div className="me-my-profile-head">
                        <div className="me-profile-name">
                            <h4>Admin Details</h4>
                        </div>
                    </div>
                    <div className="me-my-profile-body">
                        <ul>
                            <li>
                                <div className="me-profile-data">
                                    <p><b>Seller Name:</b></p>
                                </div>
                                <div className="me-profile-data-right">
                                    <p>GCE Corp</p>
                                </div>
                            </li>
                            <li>
                                <div className="me-profile-data">
                                    <p><b>Email:</b></p>
                                </div>
                                <div className="me-profile-data-right">
                                    <p>support@gcecorp.com</p>
                                </div>
                            </li>
                            <li>
                                <div className="me-profile-data">
                                    <p><b>Balance:</b></p>
                                </div>
                                <div className="me-profile-data-right">
                                    <p>{sellerBalance} USDC</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <Guidelines />
            </div>

        </>
    );
}

export default SellerInfo;