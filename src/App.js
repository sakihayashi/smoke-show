import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"


import 'bootstrap/dist/css/bootstrap.min.css'
import './scss/App.scss'
import Header from './components/Layout/Header'
import HomePage from './components/HomePage'





function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
      </Switch>
    </Router>    
  );
}

export default App;
