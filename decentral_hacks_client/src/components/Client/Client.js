import React, { useState } from "react";
import SelectRoute from "./SelectRoute";
import Footer from "./Footer";
import Shop from "./components/Shop/Shop";
import Home from "./components/Home/Home";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	useRouteMatch,
} from "react-router-dom";
import Navigation from "./Navigation";

const Client = () => {
	const [loginModalOpen, setLoginModalOpen] = useState(false);

	const handleLoginModalOpen = () => {
		setLoginModalOpen(true);
	};
	const handleCloseLoginModal = () => {
		setLoginModalOpen(false);
	};

	let { path, url } = useRouteMatch();

	return (
		<>
			<Router>
				<Navigation
					url={url}
					handleLoginModalOpen={handleLoginModalOpen}
					loginModalOpen={loginModalOpen}
					handleCloseLoginModal={handleCloseLoginModal}
				/>
				<Switch>
					<Route path={path} exact>
						<Home />
					</Route>
					<Route path={`${path}/shop`} exact>
						<Shop handleLoginModalOpen={handleLoginModalOpen} />
					</Route>
					<Route path={`${path}/:selectedRoute`}>
						<SelectRoute handleLoginModalOpen={handleLoginModalOpen} />
					</Route>
				</Switch>

				<hr style={{ marginTop: "0px" }} />
				<Footer />
			</Router>
		</>
	);
};

export default Client;
