import './App.css';
import Client from './Client/Client';
import Admin from './Admin/Admin';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


const App = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/client">
            <Client />
          </Route>
          <Route path="/admin">
            <Admin />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
