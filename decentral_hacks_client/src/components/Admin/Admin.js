import React from "react";
import "./css/Dashboard.css";
import SelectRoute from "./SelectRoute";
import Auth from "./Auth";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	useRouteMatch,
} from "react-router-dom";
import Navbar from "./Navbar";

const Admin = () => {
	let { path, url } = useRouteMatch();

	return (
		<>
			<Router>
				<Switch>
					<Route path={path} exact>
						<Auth url={url} />
					</Route>
					<Route path={`${path}/:selectedRoute`}>
						<Navbar url={url} />
						<SelectRoute />
					</Route>
				</Switch>
			</Router>
		</>
	);
};

export default Admin;
