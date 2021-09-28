import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import "./css/Dashboard.css";

import auth from "../../assets/images/Admin/auth.png";

const Auth = (props) => {
	console.log(props);
	const [passCode, setPassCode] = useState("");
	const [err, setErr] = useState(false);

	const handlePassCode = (e) => {
		setPassCode(e.target.value);
	};

	const verifyPassCodeHandler = (e) => {
		e.preventDefault();
		if (passCode == process.env.REACT_APP_ADMIN_AUTH) {
			setErr(false);
			window.localStorage.setItem("sellerAuth", passCode);
			window.location.href = `/admin/profile`;
		} else {
			setErr(true);
		}
	};

	return (
		<div className="home">
			<Container fluid="md">
				<Row>
					{/* Password */}
					<Col sm={6} className="text-center mt-4 p-4">
						<h2>Admin Login 🔐</h2>
						<Form>
							<Form.Group className="mb-3" controlId="formBasicPostal">
								<Form.Control
									value={passCode}
									onChange={handlePassCode}
									placeholder="Enter Pass Code"
									type="password"
								/>
							</Form.Group>
							<button
								className="me-btn inner-text"
								type="submit"
								style={{ float: "left", marginRight: "20px" }}
								onClick={verifyPassCodeHandler}
							>
								Login
							</button>
							{err ? (
								<div className="error-msg add-error-style">
									"Invalid Passcode"
								</div>
							) : (
								<></>
							)}
						</Form>
					</Col>

					{/* Image */}
					<Col sm={6}>
						<img src={auth} alt="Logo" className="authImage" />
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Auth;
