import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import Header from './components/Layout/Header';
import HomePage from './components/HomePage'
// import DataController from './components/DataController';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        {/* <Route exact path="/data" component={DataController} /> */}
      </Switch>
    </Router>
  );
}

export default App;
