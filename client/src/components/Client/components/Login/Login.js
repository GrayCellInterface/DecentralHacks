import React, { useEffect, useState } from "react";
import { Modal, Form, Container, Col, Row } from "react-bootstrap";
import { iso31661 } from "iso-3166";
import "./css/Login.css";

const Login = (props) => {
	const [countries, setCountries] = useState([]);

	useEffect(() => {
		setCountries(iso31661);
	}, []);

	const renderModalContent = () => {
		if (props.openRegister) {
			if (props.openSuccess) {
				return (
					<>
						<br />
						<br />
						<Container>
							<Row className="justify-content-md-center">
								<Col md="auto">You have been verified successfully!</Col>
							</Row>
							<br />
							<br />
							<Row className="justify-content-md-center">
								<Col md="auto">
									<button
										className="me-btn inner-text"
										type="submit"
										onClick={props.handleBackToLogin}
									>
										Login Now
									</button>
								</Col>
							</Row>
						</Container>
					</>
				);
			} else if (props.openVerify) {
				return (
					<>
						<Form>
							<Form.Text className="text-muted" style={{ display: "block" }}>
								A verification email has been sent to{" "}
								{props.registerValues["email"]}.
								<br />
								Please enter below the 6-digit OTP sent to your email.
							</Form.Text>
							<br />
							<Form.Group className="mb-3" controlId="formBasicPassword">
								<Form.Control
									type="password"
									value={props.verifyValues["otp"]}
									onChange={props.handleVerifyChange("otp")}
									placeholder="Enter 6-digit OTP"
								/>
							</Form.Group>
							<div className="text-center">
								{props.errors["otpError"] === "" ? (
									props.errors["verifyError"] === "" ? (
										<></>
									) : (
										<div className="error-msg">
											{props.errors["verifyError"]}
										</div>
									)
								) : (
									<div className="error-msg">{props.errors["otpError"]}</div>
								)}
								<button
									className="me-btn inner-text"
									type="submit"
									onClick={props.handleVerify}
								>
									Verify
								</button>
							</div>
						</Form>
					</>
				);
			} else {
				if (props.openStep2) {
					let district;
					if (
						props.billingValues["country"] === "US" ||
						props.billingValues["country"] === "CA"
					) {
						district = (
							<>
								<Form.Group className="mb-3" controlId="formBasicCity">
									<Form.Label>District</Form.Label>
									<Form.Control
										value={props.billingValues["district"]}
										onChange={props.handleBillingChange("district")}
										placeholder="Enter 2-letter district code"
									/>
									{props.errors["districtError"] === "" ? (
										<></>
									) : (
										<div className="error-msg">
											{props.errors["districtError"]}
										</div>
									)}
								</Form.Group>
							</>
						);
					} else {
						district = <></>;
					}
					return (
						<>
							<Form>
								<Form.Text
									className="text-muted"
									style={{
										fontSize: "18px",
										display: "block",
										marginBottom: "20px",
									}}
								>
									<b>Billing Details: </b>
								</Form.Text>
								<Form.Group className="mb-3" controlId="formBasicCountry">
									<Form.Label>Country</Form.Label>
									<select
										style={{
											width: "100%",
											height: "50px",
											display: "block",
											borderRadius: "5px",
											borderColor: "#D3D3D3",
										}}
										onChange={props.handleCountrySelection}
									>
										{countries.map((country, index) => {
											return (
												<option value={country.alpha2} key={index}>
													{country.name}
												</option>
											);
										})}
									</select>
								</Form.Group>
								<Form.Group className="mb-3" controlId="formBasicCity">
									<Form.Label>City</Form.Label>
									<Form.Control
										value={props.billingValues["city"]}
										onChange={props.handleBillingChange("city")}
										placeholder="Enter your city"
									/>
									{props.errors["cityError"] === "" ? (
										<></>
									) : (
										<div className="error-msg">{props.errors["cityError"]}</div>
									)}
								</Form.Group>
								{district}
								<Form.Group className="mb-3" controlId="formBasicAddress">
									<Form.Label>Address</Form.Label>
									<Form.Control
										value={props.billingValues["address"]}
										onChange={props.handleBillingChange("address")}
										placeholder="Enter your residential address"
									/>
									{props.errors["addressError"] === "" ? (
										<></>
									) : (
										<div className="error-msg">
											{props.errors["addressError"]}
										</div>
									)}
								</Form.Group>
								<Form.Group className="mb-3" controlId="formBasicPostal">
									<Form.Label>Postal Code</Form.Label>
									<Form.Control
										value={props.billingValues["postalcode"]}
										onChange={props.handleBillingChange("postalcode")}
										placeholder="Enter postal code"
									/>
									{props.errors["postalError"] === "" ? (
										<></>
									) : (
										<div className="error-msg">
											{props.errors["postalError"]}
										</div>
									)}
								</Form.Group>
								<button
									className="me-btn inner-text"
									style={{ float: "left" }}
									onClick={props.handleBackToStep1}
								>
									Back
								</button>
								<button
									className="me-btn inner-text"
									type="submit"
									style={{ float: "right" }}
									onClick={props.handleRegistration}
								>
									Register
								</button>
								{props.errors["existingError"] === "" ? (
									<></>
								) : (
									<div className="error-msg add-error-style">
										{props.errors["existingError"]}
									</div>
								)}
							</Form>
						</>
					);
				} else {
					return (
						<>
							<Form>
								<Form.Group className="mb-3" controlId="formBasicName">
									<Form.Label>Name</Form.Label>
									<Form.Control
										value={props.registerValues["name"]}
										onChange={props.handleRegisterChange("name")}
										placeholder="Enter your full name"
									/>
									{props.errors["nameError"] === "" ? (
										<></>
									) : (
										<div className="error-msg">{props.errors["nameError"]}</div>
									)}
								</Form.Group>
								<Form.Group className="mb-3" controlId="formBasicEmail">
									<Form.Label>Email address</Form.Label>
									<Form.Control
										value={props.registerValues["email"]}
										onChange={props.handleRegisterChange("email")}
										type="email"
										placeholder="Enter your email"
									/>
									{props.errors["emailError"] === "" ? (
										<></>
									) : (
										<div className="error-msg">
											{props.errors["emailError"]}
										</div>
									)}
								</Form.Group>
								<Form.Group className="mb-3" controlId="formBasicPassword">
									<Form.Label>Password</Form.Label>
									<Form.Control
										value={props.registerValues["password"]}
										onChange={props.handleRegisterChange("password")}
										type="password"
										placeholder="Enter Password"
									/>
									{props.errors["passwordError"] === "" ? (
										<></>
									) : (
										<div className="error-msg">
											{props.errors["passwordError"]}
										</div>
									)}
								</Form.Group>
								<Form.Group
									className="mb-3"
									controlId="formBasicConfirmPassword"
								>
									<Form.Label>Confirm Password</Form.Label>
									<Form.Control
										value={props.registerValues["confirm_password"]}
										onChange={props.handleRegisterChange("confirm_password")}
										type="password"
										placeholder="Confirm Password"
									/>
									{props.errors["matchError"] === "" ? (
										<></>
									) : (
										<div className="error-msg">
											{props.errors["matchError"]}
										</div>
									)}
								</Form.Group>
								<button
									className="me-btn inner-text"
									style={{ float: "left" }}
									onClick={props.handleBackToLogin}
								>
									Back
								</button>
								<button
									className="me-btn inner-text"
									type="submit"
									style={{ float: "right" }}
									onClick={props.handleGoToStep2}
								>
									Next
								</button>
							</Form>
						</>
					);
				}
			}
		} else {
			return (
				<>
					<Form>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Email address</Form.Label>
							<Form.Control
								type="email"
								value={props.loginValues["email"]}
								onChange={props.handleLoginChange("email")}
								placeholder="Enter email"
							/>
							{props.errors["emailError"] === "" ? (
								<></>
							) : (
								<div className="error-msg">{props.errors["emailError"]}</div>
							)}
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								value={props.loginValues["password"]}
								onChange={props.handleLoginChange("password")}
								placeholder="Password"
							/>
							{props.errors["passwordError"] === "" ? (
								<></>
							) : (
								<div className="error-msg">{props.errors["passwordError"]}</div>
							)}
						</Form.Group>
						<div className="text-center">
							<button
								className="me-btn inner-text"
								type="submit"
								onClick={props.handleLogin}
							>
								Login
							</button>
							{props.errors["authError"] === "" ? (
								<></>
							) : (
								<span className="error-msg">{props.errors["authError"]}</span>
							)}
							<Form.Text className="text-muted" style={{ display: "block" }}>
								Not a member?{" "}
								<a
									onClick={props.handleOpenRegister}
									href="#register"
									className="register-here"
								>
									Register Here
								</a>
							</Form.Text>
						</div>
					</Form>
				</>
			);
		}
	};

	return (
		<>
			<Modal
				show={props.loginModalOpen}
				onHide={props.handleLoginModalClose}
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header>
					<Modal.Title>{props.openRegister ? "REGISTER" : "LOGIN"}</Modal.Title>
					<button
						className="float-right close-btn"
						onClick={props.handleLoginModalClose}
					>
						X
					</button>
				</Modal.Header>
				<Modal.Body>{renderModalContent()}</Modal.Body>
			</Modal>
		</>
	);
};

export default Login;
