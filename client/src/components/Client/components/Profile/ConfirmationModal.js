import React, { useState } from "react";
import axios from "axios";
import { GoCheck, GoX } from "react-icons/go";
import { Modal, Spinner } from "react-bootstrap";
const TronWeb = require("tronweb");
const fullNode = "https://api.shasta.trongrid.io";
const solidityNode = "https://api.shasta.trongrid.io";
const eventServer = "https://api.shasta.trongrid.io";
const privateKey = process.env.REACT_APP_BENEFICIARY_PRIVATE_KEY;
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

const USDC_SMART_CONTRACT = "TFGBSrddCjLJAwuryZ9DUxtEmKv13BPjnh";

const ConfirmationModal = (props) => {
	const [modalStage, setModalStage] = useState("confirm");

	const executeCredit = async () => {
		setModalStage("transfer");
		const paymentId = (await executeCreditToMaster()).data.paymentId;
		setModalStage("checkingStatus");
		const status = await waitForConfirmation(paymentId);
		if (status === "success") {
			setModalStage("blockchainTansfer");
			const transactionId = await executeBlockchaintoWallet();
			setTimeout(async () => {
				const result = await confirmBlockchainTansaction(transactionId);
				if (result === "SUCCESS") {
					setModalStage("paymentSuccess");
					window.location.href = "/client/profile";
				} else {
					setModalStage("paymentFailed");
				}
			}, 10000);
		} else {
			setModalStage("paymentFailed");
		}
	};

	const executeCreditToMaster = async () => {
		return await axios.post(
			`${process.env.REACT_APP_BACKEND_API}/accounts/payment`,
			props.creditBody
		);
	};

	const waitForConfirmation = async (paymentId) => {
		let count = 0;
		let status;
		return await new Promise((resolve) => {
			const getStatus = setInterval(async () => {
				count++;
				status = (await circlecheck(paymentId)).data.data.status;
				if (status !== "confirmed" && count === 5) {
					resolve("failed");
					clearInterval(getStatus);
				}
				if (status === "confirmed") {
					resolve("success");
					clearInterval(getStatus);
				}
			}, 5000);
		});
	};

	const circlecheck = async (paymentId) => {
		const headers = {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization:
				"Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
		};

		const url = `https://api-sandbox.circle.com/v1/payments/${paymentId}`;

		return await axios.get(url, { headers });
	};

	const executeBlockchaintoWallet = async () => {
		const fundAmount = tronWeb.toSun(props.creditBody.amount);
		const usdcContract = await tronWeb.contract().at(USDC_SMART_CONTRACT);
		const response = await axios
			.get(
				`${process.env.REACT_APP_BACKEND_API
				}/accounts/get-wallet-id/${window.localStorage.getItem("email")}`
			)
			.catch((error) => {
				console.log(error.response.message);
			});
		const transactionId = await usdcContract
			.transfer(response.data.walletAddress, fundAmount)
			.send();
		return transactionId;
	};

	const confirmBlockchainTansaction = async (transactionId) => {
		const result = await tronWeb.trx.getTransaction(transactionId);
		return result.ret[0].contractRet;
	};

	const handleCloseConfirmationModal = () => {
		setModalStage("confirm");
		props.handleCloseConfirmationModal();
	};

	const handleBackToProfile = (e) => {
		setModalStage("confirm");
		props.handleBackToProfile(e);
	};

	const renderModalContent = () => {
		if (modalStage === "confirm") {
			return (
				<>
					<p>
						Please click on 'Confirm Credit' to credit{" "}
						<b>{props.creditBody.amount} USDC</b> to your wallet.
					</p>
					<button
						onClick={executeCredit}
						className="me-btn"
						style={{ float: "right" }}
					>
						Confirm Credit
					</button>
					<button
						onClick={handleCloseConfirmationModal}
						className="me-btn"
						style={{ float: "left" }}
					>
						Cancel
					</button>
				</>
			);
		} else {
			let message;
			if (modalStage === "transfer") {
				message = "Executing deposit...";
			} else if (modalStage === "checkingStatus") {
				message = "Confirming payment...";
			} else if (modalStage === "blockchainTansfer") {
				message = "Transfering funds...";
			} else if (modalStage === "paymentSuccess") {
				message = "Credit was successful!";
			} else {
				message = "Credit failed.";
			}

			if (modalStage !== "paymentFailed" && modalStage !== "paymentSuccess") {
				return (
					<>
						<div className="container text-center">
							<Spinner
								style={{ margin: "20px 0", color: "orange" }}
								animation="border"
							/>
							<div>
								<p>{message}</p>
							</div>
							<div>
								<p><em>**Do <b>NOT</b> click Back or refresh the page as it may lead to loosing your funds.</em></p>
							</div>
						</div>
					</>
				);
			} else {
				return (
					<>
						<div className="container text-center">
							{modalStage === "creditFailed"
								? (
									<>
										<div style={{ color: "red" }}>
											<GoX style={{ fontSize: "40px", margin: "25px" }} />
											<p>{message}</p>
										</div>
										<button onClick={handleBackToProfile} className="me-btn">
											Back To Profile
										</button>
									</>)
								: (<div style={{ color: "green" }}>
									<GoCheck style={{ fontSize: "40px", margin: "25px" }} />
									<p>{message}</p>
									<br />
								</div>)}

						</div>
					</>
				);
			}
		}
	};

	return (
		<>
			<Modal
				show={props.openConfirmationModal}
				onHide={handleCloseConfirmationModal}
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header>
					<Modal.Title>CREDIT CONFIRMATION</Modal.Title>
					<button
						className="float-right close-btn"
						onClick={handleCloseConfirmationModal}
					>
						X
					</button>
				</Modal.Header>
				<Modal.Body>{renderModalContent()}</Modal.Body>
			</Modal>
		</>
	);
};

export default ConfirmationModal;
