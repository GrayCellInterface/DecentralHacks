import './App.css';
import Navigation from './Navigation';
import Shop from './Shop/Shop';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <div className="App">
        <Navigation />
      </div>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/shop">
            <Shop />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
