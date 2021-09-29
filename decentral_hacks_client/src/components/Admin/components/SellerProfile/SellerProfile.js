import React from 'react'
import SellerInfo from './SellerInfo'
import adminImage from '../../../../assets/images/Admin/admin_profile.gif'

const SellerProfile = () => {
    return (
        <div>
            <div className="me-my-account">
                <div className="container">
                    <div className="row">
                        <SellerInfo />
                        <div className="col-lg-6">
                            <img src={adminImage} alt="admin profile" style={{ float: "right" }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SellerProfile