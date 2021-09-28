import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Container, Row, Col } from "react-bootstrap";

const AddProduct = () => {
	// State Variables

	let initialState = {
		name: "",
		description: "",
		modelNumber: "",
		link: "",
		price: "",
		count: "",
		delivery: "",
	};

	const [errors, setErrors] = useState({});
	const [productDetails, setProductDetails] = useState(initialState);

	// Error Object
	const errorObj = {
		nameError: "Invalid name.",
		descriptionError:
			"Description length should be between 10 to 20 characters.",
		modelNumberError: "Invalid model number.",
		priceError: "Price should be greater than 0.",
		deliveryError: "Number of Delivery Days should be greater than 0.",
		countError: "Product count should be greater than 0",
	};

	// Handler to handle state change
	const handleChange = (e) => {
		const value = e.target.value;
		setProductDetails({
			...productDetails,
			[e.target.name]: value,
		});
	};

	let errorHandlerObj;

	// Validate Data and sed to backend
	const handleAddProduct = async (e) => {
		e.preventDefault();
		setErrors({});
		console.log(Number(productDetails["price"]));

		const validModelNumber = /[A-Z0-9- ]{4,20}/;

		errorHandlerObj = {
			nameError: "",
			descriptionError: "",
			modelNumberError: "",
			priceError: "",
			deliveryError: "",
			countError: "",
		};

		if (productDetails["name"].length === 0) {
			errorHandlerObj["nameError"] = errorObj["nameError"];
		}
		if (
			productDetails["description"].length < 10 ||
			productDetails["description"].length > 20
		) {
			errorHandlerObj["descriptionError"] = errorObj["descriptionError"];
		}
		if (!validModelNumber.test(productDetails["modelNumber"])) {
			errorHandlerObj["modelNumberError"] = errorObj["modelNumberError"];
		}
		if (Number(productDetails["price"] <= 0)) {
			errorHandlerObj["priceError"] = errorObj["priceError"];
		}
		if (Number(productDetails["delivery"] <= 0)) {
			errorHandlerObj["deliveryError"] = errorObj["deliveryError"];
		}
		if (Number(productDetails["count"] <= 0)) {
			errorHandlerObj["countError"] = errorObj["countError"];
		}
		if (
			errorHandlerObj["nameError"] === "" &&
			errorHandlerObj["descriptionError"] === "" &&
			errorHandlerObj["modelNumberError"] === "" &&
			errorHandlerObj["countError"] === "" &&
			errorHandlerObj["deliveryError"] === "" &&
			errorHandlerObj["priceError"] === ""
		) {
			console.log(productDetails);
			await axios
				.post(`${process.env.REACT_APP_BACKEND_API}/shop/add-product`, {
					p_name: productDetails["name"],
					p_description: productDetails["description"],
					p_model_no: productDetails["modelNumber"],
					p_link: productDetails["link"],
					p_price: productDetails["price"],
					p_count: productDetails["count"],
					p_delivery: productDetails["delivery"],
				})
				.then((res) => {
					setProductDetails(initialState);
					console.log(res.data.msg);
				})
				.catch((error) => {
					console.log(error.response.message);
				});
		} else {
			setErrors({ ...errorHandlerObj });
			console.log("Add product Failed");
			console.log(errorHandlerObj);
		}
	};

	return (
		<>
			<div style={{ margin: "40px" }}>
				<h3 style={{ marginBottom: "20px" }}>Add Product</h3>
				<Form>
					{/* Name */}
					<Form.Group className="mb-3" controlId="formBasicNumber">
						<Form.Label>Product Name:</Form.Label>
						<Form.Control
							value={productDetails["name"]}
							name="name"
							onChange={handleChange}
							placeholder="Enter Product Name"
						/>
						{errors["nameError"] === "" ? (
							<></>
						) : (
							<div className="error-msg">{errors["nameError"]}</div>
						)}
					</Form.Group>

					{/* Description */}
					<Form.Group className="mb-3" controlId="formBasicNumber">
						<Form.Label>Product Description:</Form.Label>
						<Form.Control
							value={productDetails["description"]}
							name="description"
							onChange={handleChange}
							placeholder="Enter Product Description"
						/>
						{errors["descriptionError"] === "" ? (
							<></>
						) : (
							<div className="error-msg">{errors["descriptionError"]}</div>
						)}
					</Form.Group>

					<Container>
						<Row>
							<Col sm={6} lg={6}>
								{/* modelNumber */}
								<Form.Group className="mb-3" controlId="formBasicNumber">
									<Form.Label>Product Model Number:</Form.Label>
									<Form.Control
										value={productDetails["modelNumber"]}
										name="modelNumber"
										onChange={handleChange}
										placeholder="Enter Product Model Number"
									/>
									{errors["modelNumberError"] === "" ? (
										<></>
									) : (
										<div className="error-msg">
											{errors["modelNumberError"]}
										</div>
									)}
								</Form.Group>
							</Col>
							<Col sm={6} lg={6}>
								{/* link */}
								<Form.Group className="mb-3" controlId="formBasicNumber">
									<Form.Label>Product Image Link:</Form.Label>
									<Form.Control
										value={productDetails["link"]}
										name="link"
										onChange={handleChange}
										placeholder="Enter a valid image link or keep empty"
									/>
								</Form.Group>
							</Col>
						</Row>
					</Container>

					{/* price */}
					<Form.Group className="mb-3" controlId="formBasicNumber">
						<Form.Label>Product Price Number:</Form.Label>
						<Form.Control
							value={productDetails["price"]}
							name="price"
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
							value={productDetails["count"]}
							name="count"
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
							value={productDetails["delivery"]}
							name="delivery"
							onChange={handleChange}
							placeholder="Enter Product Delivery Days"
						/>
						{errors["deliveryError"] === "" ? (
							<></>
						) : (
							<div className="error-msg">{errors["deliveryError"]}</div>
						)}
					</Form.Group>
					<div className="text-center">
						<button
							className="me-btn inner-text"
							type="submit"
							onClick={handleAddProduct}
						>
							Add Product
						</button>
					</div>
				</Form>
			</div>
		</>
	);
};

export default AddProduct;
