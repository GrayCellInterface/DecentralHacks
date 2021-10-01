import React, { useEffect, useState } from "react";
import axios from "axios";
import CheckoutPage from "./CheckoutPage";
import OutOfStockPrompt from "./OutOfStockPrompt";
import defaultImage from "../../../../assets/images/defaultProduct.png";
import { Card, ListGroup, ListGroupItem, Spinner } from "react-bootstrap";

const Shop = (props) => {

	const [isLoading, setIsLoading] = useState(true)
	const [products, setProducts] = useState([]);
	const [hasLoggedIn, setHasLoggedIn] = useState(false);
	const [authenticated, setAuthenticated] = useState(false);
	const [openCheckOut, setOpenCheckout] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState({});
	const [openOutOfStock, setOpenOutOfStock] = useState(false);

	useEffect(() => {
		if (window.localStorage.getItem("email")) {
			setAuthenticated(true);
		} else {
			setAuthenticated(false);
		}

		if (authenticated) {
			setHasLoggedIn(true);
		} else {
			setHasLoggedIn(false);
		}

		const getBalance = async () => {
			await axios
				.get(
					`${process.env.REACT_APP_BACKEND_API
					}/accounts/get-walletId/${window.localStorage.getItem("email")}`
				)
				.then((res) => {
					window.localStorage.setItem("balance", res.data.balance);
					console.log(res.data);
				})
				.catch((error) => {
					console.log(error.response);
				});
		};

		const getProducts = async () => {
			await axios
				.get(`${process.env.REACT_APP_BACKEND_API}/shop/all-products`)
				.then((res) => {
					setProducts(res.data.data.slice(0).reverse());
				});
		};

		const getInfo = async () => {
			await getProducts();
			await getBalance();
			setIsLoading(false)
		}

		getInfo()

	}, [authenticated]);

	const handleCloseOutOfStock = () => {
		setOpenOutOfStock(false);
	};

	const handleGotoCheckOut = (selectedProductIndex) => {
		if (products[selectedProductIndex].p_count === 0) {
			setOpenOutOfStock(true);
		} else {
			if (!hasLoggedIn) {
				props.handleLoginModalOpen();
			} else {
				setSelectedProduct(products[selectedProductIndex]);
				setOpenCheckout(true);
			}
		}
	};

	const handleGoBackToShop = () => {
		setOpenCheckout(false);
	};

	const renderShop = () => {
		if (isLoading === true) {
			return (
				<div className="container text-center">
					<Spinner
						style={{ marginTop: "340px", marginBottom: "10px", color: "orange" }}
						animation="border"
					/>
					<div style={{ marginBottom: "700px" }}>
						<p>Getting Shop Items...</p>
					</div>
				</div>
			)
		} else {
			if (openCheckOut) {
				return (
					<CheckoutPage
						selectedProduct={selectedProduct}
						handleGoBackToShop={handleGoBackToShop}
					/>
				);
			} else {
				return (
					<>
						<div className="row" style={{ marginTop: "120px" }}>
							{products.map((product, index) => {
								let image;
								if (product.p_link === "") {
									image = defaultImage;
								} else {
									image = product.p_link;
								}
								let stockJSX;
								let stock = parseInt(product.p_count);
								if (stock < 10) {
									if (stock === 0) {
										stockJSX = (
											<p style={{ float: "left", color: "red" }}>
												<b>OUT OF STOCK</b>
											</p>
										);
									} else {
										stockJSX = (
											<p style={{ float: "left", color: "red" }}>
												<b>ONLY {stock} LEFT IN STOCK</b>
											</p>
										);
									}
								} else {
									stockJSX = (
										<p style={{ float: "left", color: "green" }}>
											<b>IN STOCK</b>
										</p>
									);
								}
								return (
									<div
										className="col-sm-12 col-md-6 col-lg-4"
										key={index}
										style={{ margin: "30px 0px" }}
									>
										<Card style={{ width: "23rem", height: "773px" }} key={index}>
											<Card.Img
												style={{ height: "340px", objectFit: "contain" }}
												variant="top"
												src={image}
											/>
											<Card.Body>
												<div className="row">
													<div className="col-7">
														<Card.Title style={{ float: "left", height: "30px" }}>
															{product.p_name}
														</Card.Title>
													</div>
													<div className="col-5">
														<Card.Title style={{ float: "right" }}>
															<strong>{product.p_price} USDC</strong>
														</Card.Title>
													</div>
												</div>
												<Card.Text style={{ height: "90px" }}>
													<br />
													<b>Description: </b>
													{product.p_description}
												</Card.Text>
											</Card.Body>
											<ListGroup className="list-group-flush">
												<ListGroupItem>
													<div className="row">{stockJSX}</div>
												</ListGroupItem>
												<ListGroupItem>
													<div className="row">
														<div className="col-6">
															<p style={{ float: "left" }}>
																<b>Delivery Time :</b>
															</p>
														</div>
														<div className="col-6">
															<p style={{ float: "right" }}>
																{product.p_delivery} DAYS
															</p>
														</div>
													</div>
												</ListGroupItem>
												<ListGroupItem>
													<div className="row">
														<div className="col-12">
															<p style={{ float: "left" }}>
																<b>Seller Address :</b>
															</p>
														</div>
														<div className="col-12">
															<p style={{ float: "left" }}>
																TVyXtKiMoG2PZpSsAnMaLZW747PSvRAQmT
															</p>
														</div>
													</div>
												</ListGroupItem>
											</ListGroup>
											<Card.Body className="text-center">
												<button
													onClick={() => handleGotoCheckOut(index)}
													className="me-btn"
													size="lg"
													style={{
														width: "70%",
														height: "40px",
													}}
												>
													Buy Now
												</button>
											</Card.Body>
										</Card>
									</div>
								);
							})}
						</div>
					</>
				);
			}
		}

	};

	return (
		<>
			<div className="container">{renderShop()}</div>
			<OutOfStockPrompt
				handleCloseOutOfStock={handleCloseOutOfStock}
				openOutOfStock={openOutOfStock}
			/>
		</>
	);
};

export default Shop;
