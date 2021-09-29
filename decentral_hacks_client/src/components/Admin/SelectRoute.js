import React, { useState, useEffect } from "react";
import forbidden from '../../assets/images/Forbidden.gif'
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import AddProduct from "./components/AddProduct/AddProduct";
import SellerProfile from "./components/SellerProfile/SellerProfile";
import OrderStatus from "./components/OrderStatus/OrderStatus";
import Products from "./components/Products/Products";

const SelectRoute = (props) => {
	let { selectedRoute } = useParams();

	const [authenticated, setAuthenticated] = useState(false);

	useEffect(() => {
		if (window.localStorage.getItem("sellerAuth")) {
			setAuthenticated(true);
		} else {
			setAuthenticated(false);
		}
	}, []);

	const renderPage = () => {
		let page;
		if (authenticated) {
			switch (selectedRoute) {
				case "completed": {
					page = <OrderStatus type="completed" />;
					break;
				}
				case "pending": {
					page = <OrderStatus type="pending" />;
					break;
				}
				case "products": {
					page = <Products />;
					break;
				}
				case "cancel": {
					page = <OrderStatus type="cancel" />;
					break;
				}
				case "add-product": {
					page = <AddProduct />;
					break;
				}
				case "profile": {
					page = <SellerProfile />;
					break;
				}
				default: {
					return <div>Error 404 : Page Not Found</div>;
				}
			}
		} else {
			return (
				<>
					<div className="text-center" style={{ marginTop: "100px" }}>
						<img src={forbidden} alt="forbidden" />
						<h5><strong>You are not authorized to view this page.</strong></h5>
					</div>
				</>
			);
		}

		return (
			<>
				<Navbar url={props.url} />
				{page}
			</>
		);
	};

	return <>{renderPage()}</>;
};

export default SelectRoute;
