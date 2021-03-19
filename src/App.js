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
import Terms from './components/Terms'
import Privacy from './components/Privacy'
// import CarImgUpload from './components/Admin/CarImgUpload'
import UpdateDB from './components/Admin/UpdateDB'
import CarStatsVideo from './components/CarStatsVideo'
import CarStatsListsYear from './components/CarStatsListsYear'
import CarStatsListsModel from './components/CarStatsListsModel'
import CarStatsListsResults from './components/CaStatsListsResults'
// import CreateSiteMap from './components/Admin/CreateSiteMap'


function App() {

  return (
    <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          
          <Route path="/email-confirmation" component={EmailConfirmation}/>
          <Route path="/reset-password" component={ResetPassword}/>
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/car-stats/search/:id" component={CarStats} />
          <Route exact path="/car-search" component={CarSearch} />
          <Route exact path="/car-stats/:make" component={CarStatsListsYear} />
          <Route exact path="/car-stats/:make/:year" component={CarStatsListsModel} />
          <Route exact path="/car-stats/:make/:year/:model" component={CarStatsListsResults} />

          <Route exact path="/giveaways" component={Giveaways} />
          <Route exact path="/swagg" component={Swagg} />
          <Route path="/user/:id" component={BioPage} />

          <Route exact path="/influencers" component={InfluencerIndexPage} />
          <Route exact path="/influencer/:username" component={BioPageInfluencer} />
          <Route exact path="/influencer/:username/social" component={Social} />
          <Route exact path="/influencer/:username/swagg" component={SwaggInfluencer} />
          <Route exact path="/influencer/:username/all-videos" component={AllVideos} />
          <Route exact path="/influencer/:username/garage" component={Garage} />
          
          {/* <Route path="/all-videos/:id" component={AllVideos} /> */}
          <Route path="/add-car-data" component={AddCarData} />
          <Route path="/edit-video-data" component={EditVideoData} />
          <Route path="/edit-video-data-kirk" component={EditVideoDataKirk} />
          <Route path="/privacy-policy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/car-stats/:make/:year/:model/:id" component={CarStatsVideo} />
          <Route path="/check-data" component={CheckCarData} />
          <Route path="/update-db" component={UpdateDB} />
          {/* <Route exact path="/create-sitemap" component={CreateSiteMap} /> */}

          <Route path="/update-video" component={QueryVideoData} />
          {/* <Route path="/img-upload" component={CarImgUpload} /> */}
          <Route component={NotFoundPage} />
        </Switch>
    </Router>    
  );
}

export default App;
