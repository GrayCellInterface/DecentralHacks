import React from "react";
import SellerInfo from "./SellerInfo";
import adminImage from "../../../../assets/images/Admin/admin_profile.gif";

const SellerProfile = () => {
	return (
		<div>
			<div className="me-my-account">
				<h4
					className="text-center"
					style={{ marginBottom: "30px", marginTop: "-55px" }}
				>
					<strong>• SELLER PROFILE •</strong>
				</h4>
				<div className="container" style={{ margin: "  0 80px 0 80px  " }}>
					<div className="row">
						<SellerInfo />
						<div className="col-lg-6">
							<img src={adminImage} alt="admin profile" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SellerProfile;
