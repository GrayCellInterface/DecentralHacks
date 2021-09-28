import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import AddProduct from "./components/AddProduct/AddProduct";
import SellerProfile from "./components/SellerProfile/SellerProfile";
import OrderStatus from "./components/OrderStatus/OrderStatus";

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
					<div>Error 403 : Forbidden Request</div>
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
