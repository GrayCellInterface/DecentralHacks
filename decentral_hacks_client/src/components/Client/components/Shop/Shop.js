import React, { useEffect, useState } from "react";
import CheckoutPage from "./CheckoutPage";
import OutOfStockPrompt from "./OutOfStockPrompt";
import { sampleProducts } from "./sampleProducts";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";

const Shop = (props) => {
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

		const getProducts = () => {
			// axios.get(`${process.env.REACT_APP_BACKEND_API}/auth/get-products`).then((res) => {
			//     setProducts(res.data.products)
			// })
			setProducts(sampleProducts);
		};

		getProducts();
	}, [authenticated]);

	const handleCloseOutOfStock = () => {
		setOpenOutOfStock(false);
	};

	const handleGotoCheckOut = (selectedProductIndex) => {
		if (products[selectedProductIndex].stock === "0") {
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
		if (openCheckOut) {
			return (
				<CheckoutPage
					productName={selectedProduct["productName"]}
					productPrice={selectedProduct["productPrice"]}
					deliveryTime={selectedProduct["deliveryTime"]}
					handleGoBackToShop={handleGoBackToShop}
				/>
			);
		} else {
			return (
				<>
					<div className="row">
						{products.map((product, index) => {
							let stockJSX;
							let stock = parseInt(product.stock);
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
									<Card style={{ width: "23rem" }} key={index}>
										<Card.Img variant="top" src={product.productImage} />
										<Card.Body>
											<div className="row">
												<div className="col-6">
													<Card.Title style={{ float: "left" }}>
														{product.productName}
													</Card.Title>
												</div>
												<div className="col-6">
													<Card.Title style={{ float: "right" }}>
														<strong>{product.productPrice}</strong>
													</Card.Title>
												</div>
											</div>
											<Card.Text>
												<br />
												<b>Description: </b>
												{product.productDescription}
												<br />
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
															{product.deliveryTime} DAYS
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
												style={{ width: "70%", height: "60%" }}
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
