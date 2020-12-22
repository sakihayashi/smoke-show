import React, { Fragment } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"


import 'bootstrap/dist/css/bootstrap.min.css'
import './scss/App.scss'
import HomePage from './components/HomePage'
import InfluencerIndexPage from './components/InfluencerIndexPage'
import BioPage from './components/Influencer/BioPage'
import EmailConfirmation from './components/EmailConfirmation';
import ResetPassword from './components/ResetPassword'
import AboutPage from './components/AboutPage'
import CarStats from './components/CarStats'
import CarSearch from './components/CarSearch'
import CreateDta from './components/CreateData'


function App() {


  return (
    <Router>
        <Fragment>
          <Route exact path="/" component={HomePage} />
          <Route path="/influencers" component={InfluencerIndexPage} />
          <Route path="/influencer/:id" component={BioPage} />
          <Route path="/email-confirmation" component={EmailConfirmation}/>
          <Route path="/reset-password" component={ResetPassword}/>
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/car-stats/:id" component={CarStats} />
          <Route exact path="/car-search" component={CarSearch} />
          <Route exact path="/get-data" component={CreateDta} />
        </Fragment>
    </Router>    
  );
}

export default App;
