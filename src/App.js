import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"


import 'bootstrap/dist/css/bootstrap.min.css'
import './scss/App.scss'
import HomePage from './components/HomePage'
import InfluencerIndexPage from './components/InfluencerIndexPage'
import BioPage from './components/Fan/BioPage'
import EmailConfirmation from './components/EmailConfirmation';
import ResetPassword from './components/ResetPassword'
import AboutPage from './components/AboutPage'
import CarStats from './components/CarStats'
import CarSearch from './components/CarSearch'
// import CreateDta from './components/CreateData'
import Giveaways from './components/Giveaways'
import NotFoundPage from './components/NotFoundPage'
import Swagg from './components/Swagg'
import BioPageInfluencer from './components/Influencer/BioPage'
import Garage from './components/Influencer/Garage'
import Social from './components/Influencer/Social'
import SwaggInfluencer from './components/Influencer/Swagg'
import QueryVideoData from './components/Admin/QueryVideoData'
import EditVideoData from './components/Admin/EditVideoData'
import AddCarData from './components/Admin/AddCarData'
import CheckCarData from './components/Admin/CheckCarData'
import EditVideoDataKirk from './components/Admin/EditVideoDataKirk'
import AllVideos from './components/Influencer/AllVideos'


function App() {

  return (
    <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/influencers" component={InfluencerIndexPage} />
          <Route path="/influencer/:id" component={BioPageInfluencer} />
          <Route path="/email-confirmation" component={EmailConfirmation}/>
          <Route path="/reset-password" component={ResetPassword}/>
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/car-stats/:id" component={CarStats} />
          <Route exact path="/car-search" component={CarSearch} />
          {/* <Route exact path="/get-data" component={CreateDta} /> */}
          <Route exact path="/giveaways" component={Giveaways} />
          <Route exact path="/swagg" component={Swagg} />
          <Route path="/garage/:id" component={Garage} />
          <Route path="/user/:id" component={BioPage} />
          <Route path="/social/:id" component={Social} />
          <Route path="/swagg-influencer/:id" component={SwaggInfluencer} />
          <Route path="/all-videos/:id" component={AllVideos} />
          <Route path="/add-car-data" component={AddCarData} />
          <Route path="/edit-video-data" component={EditVideoData} />
          <Route path="/edit-video-data-kirk" component={EditVideoDataKirk} />
          
          <Route path="/check-data" component={CheckCarData} />

          <Route path="/update-video" component={QueryVideoData} />

          <Route component={NotFoundPage} />
        </Switch>
    </Router>    
  );
}

export default App;
