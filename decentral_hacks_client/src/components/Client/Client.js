import React from 'react';
import SelectRoute from './SelectRoute';
import Home from './components/Home/Home';
import { BrowserRouter as Router, Switch, Route, useRouteMatch } from 'react-router-dom';
import Navigation from './Navigation';


const Client = () => {

    let { path, url } = useRouteMatch()

    return (
        <>
            <Router>
                <Navigation url={url} />
                <Switch>
                    <Route path={path} exact >
                        <Home url={url} />
                    </Route>
                    <Route path={`${path}/:selectedRoute`}>
                        <SelectRoute />
                    </Route>
                </Switch>
            </Router>
        </>
    );
}

export default Client;