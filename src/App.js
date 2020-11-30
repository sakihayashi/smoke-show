import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"
import { withRouter } from "react-router";


import 'bootstrap/dist/css/bootstrap.min.css'
import './scss/App.scss'
import Header from './components/Layout/Header'
import HomePage from './components/HomePage'
import InfluencerIndexPage from './components/InfluencerIndexPage'
import BioPage from './components/Influencer/BioPage'

const HeaderWithRouter = withRouter(Header);

function App() {
  return (
    <Router>
      <HeaderWithRouter />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/influencers" component={InfluencerIndexPage} />
        <Route exact path="/influencer/:id" component={BioPage} />
      </Switch>
    </Router>    
  );
}

export default App;
