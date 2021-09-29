import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Form, Container, Row, Col } from "react-bootstrap";

const EditConfirmationModel = (props) => {
	const errorObj = {
		descriptionError:
			"Description length should be between 10 to 20 characters.",
		priceError: "Price should be greater than 0.",
		deliveryError: "Number of Delivery Days should be greater than 0.",
		countError: "Product count should be greater than 0",
	};

	let errorHandlerObj;

	const [data, setData] = props.functions;
	const [errors, setErrors] = useState({});

	// Handler to handle state change
	const handleChange = (e) => {
		const value = e.target.value;
		setData({
			...data,
			[e.target.name]: value,
		});
	};

	const handleEditProduct = async (e) => {
		e.preventDefault();
		console.log(data);

		errorHandlerObj = {
			descriptionError: "",
			priceError: "",
			deliveryError: "",
			countError: "",
		};

		setErrors({});

		// Validation
		if (
			data["p_description"].length < 10 ||
			data["p_description"].length > 60
		) {
			errorHandlerObj["descriptionError"] = errorObj["descriptionError"];
		}
		if (Number(data["p_price"] <= 0)) {
			errorHandlerObj["priceError"] = errorObj["priceError"];
		}
		if (Number(data["p_delivery"] <= 0)) {
			errorHandlerObj["deliveryError"] = errorObj["deliveryError"];
		}
		if (Number(data["p_count"] < 0)) {
			errorHandlerObj["countError"] = errorObj["countError"];
		}
		if (
			errorHandlerObj["descriptionError"] === "" &&
			errorHandlerObj["countError"] === "" &&
			errorHandlerObj["deliveryError"] === "" &&
			errorHandlerObj["priceError"] === ""
		) {
			await axios
				.post(`${process.env.REACT_APP_BACKEND_API}/shop/edit-product`, {
					_id: data["_id"],
					link: data["p_link"],
					description: data["p_description"],
					delivery: data["p_delivery"],
					price: data["p_price"],
					count: data["p_count"],
				})
				.then((res) => {
					console.log(res.data.msg);
					window.location.href = "/admin/products";
				})
				.catch((error) => {
					console.log(error.response.message);
				});
		} else {
			setErrors({ ...errorHandlerObj });
			console.log("Edit product Failed");
			console.log(errorHandlerObj);
		}
	};

	return (
		<>
			<Modal
				show={props.openEditConfirmation}
				onHide={props.handleCloseEditConfirmation}
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header>
					<Modal.Title>EDIT PRODUCT INFORMATION</Modal.Title>
					<button
						className="float-right close-btn"
						onClick={props.handleCloseEditConfirmation}
					>
						X
					</button>
				</Modal.Header>

				{/* Body */}
				<Modal.Body>
					<Form>
						<h5>Name: {data["p_name"]}</h5>

						{/* Description */}
						<Form.Group className="mb-3" controlId="formBasicNumber">
							<Form.Label>Product Description:</Form.Label>
							<Form.Control
								value={data["p_description"]}
								name="p_description"
								onChange={handleChange}
								placeholder="Enter Product Description"
							/>
							{errors["descriptionError"] === "" ? (
								<></>
							) : (
								<div className="error-msg">{errors["descriptionError"]}</div>
							)}
						</Form.Group>

						{/* link */}
						<Form.Group className="mb-3" controlId="formBasicNumber">
							<Form.Label>Product Image Link:</Form.Label>
							<Form.Control
								value={data["p_link"]}
								defaultValue={data["p_link"]}
								name="link"
								onChange={handleChange}
								placeholder="Enter a valid image link or keep empty"
							/>
						</Form.Group>

						{/* price */}
						<Form.Group className="mb-3" controlId="formBasicNumber">
							<Form.Label>Product Price:</Form.Label>
							<Form.Control
								value={data["p_price"]}
								name="p_price"
								onChange={handleChange}
								placeholder="Enter Product Price"
								type="number"
							/>
							{errors["priceError"] === "" ? (
								<></>
							) : (
								<div className="error-msg">{errors["priceError"]}</div>
							)}
						</Form.Group>

						{/* count */}
						<Form.Group className="mb-3" controlId="formBasicNumber">
							<Form.Label>Product Count:</Form.Label>
							<Form.Control
								value={data["p_count"]}
								name="p_count"
								onChange={handleChange}
								placeholder="Enter Product Model Number"
								type="number"
							/>
							{errors["countError"] === "" ? (
								<></>
							) : (
								<div className="error-msg">{errors["countError"]}</div>
							)}
						</Form.Group>

						{/* delivery */}
						<Form.Group className="mb-3" controlId="formBasicNumber">
							<Form.Label>Product Delivery Days:</Form.Label>
							<Form.Control
								value={data["p_delivery"]}
								name="p_delivery"
								onChange={handleChange}
								placeholder="Enter Product Delivery Days"
							/>
							{errors["deliveryError"] === "" ? (
								<></>
							) : (
								<div className="error-msg">{errors["deliveryError"]}</div>
							)}
						</Form.Group>

						{/* Button */}
						<div className="text-center">
							<button
								className="me-btn"
								style={{ backgroundColor: "orange" }}
								onClick={handleEditProduct}
							>
								Confirm Edit
							</button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default EditConfirmationModel;
