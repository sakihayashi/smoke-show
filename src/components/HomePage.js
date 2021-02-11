import React, { useEffect, useState, Fragment, useRef, Suspense } from 'react'
import {Helmet} from "react-helmet"
import { Row, Col, Form, FormControl, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import * as Realm from "realm-web"
import { youtubeAPI } from '../utils/youtubeAPI'
import { carTempData } from './carTempData'
import { commentsTempData } from './commentsTempData' 
// import Comments from './Comments'
import Avatar from 'react-avatar'
import { v4 as uuidv4 } from 'uuid';
import powerIcon from '../assets/global/Horsepower.png'
import pistonIcon from '../assets/global/piston.png'
import priceIcon from '../assets/global/Price-Tag-icon.png'
import Layout from './Layout/Layout'
import '../scss/spinner.css'

const Comments = React.lazy(() => import('./Comments'))

const HomePage = (props) =>{
    
// const childRef = useRef();
const videoEmbedURL = 'https://www.youtube.com/embed/'
const EddieXChannelId = 'UCdOXRB936PKSwx0J7SgF6SQ'
const [searchKeyword, setSearchKeyword] = useState('')
const [titleStr, setTitleStr] = useState('Your search result')
const [searchedCarData, setSearchedCarData] = useState([])

const appConfig = {
    id: process.env.REACT_APP_REALM_APP_ID,
    // timeout: 10000, 
    // timeout in number of milliseconds
    };
const app = new Realm.App(appConfig);
//     items: Array(5)
// 0:
// etag: "IPLLqa9ikvoy_gLqxEcoiqqavC4"
// id: {kind: "youtube#channel", channelId: "UCdOXRB936PKSwx0J7SgF6SQ"}
// kind: "youtube#searchResult"
// snippet:
// channelId: "UCdOXRB936PKSwx0J7SgF6SQ"
// channelTitle: "EddieX"
// description: "If you like cars, and you like hearing someone with too much knowledge about cars talk about them, you should check out my Youtube channel! I'm planning on ..."
// liveBroadcastContent: "upcoming"
// publishTime: "2015-06-11T02:01:04Z"
// publishedAt: "2015-06-11T02:01:04Z"
// thumbnails:
// default: {url: "https://yt3.ggpht.com/a/AATXAJzxcCWM9He6uumiLOa71zR_7mR3feUT_MG2IfBY=s88-c-k-c0xffffffff-no-rj-mo"}
// high: {url: "https://yt3.ggpht.com/a/AATXAJzxcCWM9He6uumiLOa71zR_7mR3feUT_MG2IfBY=s800-c-k-c0xffffffff-no-rj-mo"}
// medium: {url: "https://yt3.ggpht.com/a/AATXAJzxcCWM9He6uumiLOa71zR_7mR3feUT_MG2IfBY=s240-c-k-c0xffffffff-no-rj-mo"}
// __proto__: Object
// title: "EddieX"

// id:
// kind: "youtube#video"
// videoId: "ifi5cGgJa7s"
// __proto__: Object
// kind: "youtube#searchResult"
// snippet:
// channelId: "UCdOXRB936PKSwx0J7SgF6SQ"
// channelTitle: "EddieX"
// description: "Use my referral link to get 12% off your BlendMount Radar Detector mount order! http://blendmount.refr.cc/eddiex Follow me on IG and FB at @eddiex616 to see ..."
// liveBroadcastContent: "none"
// publishTime: "2020-11-10T20:00:04Z"
// publishedAt: "2020-11-10T20:00:04Z"
// thumbnails: {default: {…}, medium: {…}, high: {…}}
// title: "The Best Mercedes AMG Ever! | SLS Black Series Review"

  
    const handleChangeKeyword = (e) =>{
        setSearchKeyword(e.target.value)
    }
    const handleVideoSearch = async e =>{
        e.preventDefault()
        await youtubeAPI.get('/search', {
            params: {
                q: searchKeyword,
                channelId: EddieXChannelId
            }
        }).then(res =>{
            console.log('res from youtube', res)
            setTitleStr("EddieX " + searchKeyword)
            const searchResult = res.data.items
            console.log('is this array?', res.data.items)
            const datayoutube =[]
            searchResult.map(data =>{
                datayoutube.push({
                    videoId: data.id.videoId,
                    youtube:{
                        snippet: {title: data.snippet.title}
                    }
                })
                return
            })
            setSearchedCarData(datayoutube)
            console.log('use state check: ', searchedCarData)
            
            
// etag: "DGXOPdigGW4SFrRywMEE_lwUuwY"
// id:
// kind: "youtube#video"
// videoId: "iXrO7LJTUkE"
// __proto__: Object
// kind: "youtube#searchResult"
// snippet:
// channelId: "UCdOXRB936PKSwx0J7SgF6SQ"
// channelTitle: "EddieX"
// description: "Follow me on IG and FB at @eddiex616 to see daily posts and updates! The Dodge Durango SRT and Ford Explorer ST are two 3 row SUVs that offer some ..."
// liveBroadcastContent: "none"
// publishTime: "2020-02-17T20:00:10Z"
// publishedAt: "2020-02-17T20:00:10Z"
// thumbnails: {default: {…}, medium: {…}, high: {…}}
// title: "2020 Dodge Durango SRT vs 2020 Ford Explorer ST | Is The V8 Worth $20,000 More?"

        })
    }
 
    const loginCheck = async () =>{
        const isLoggedIn = sessionStorage.getItem('session_token')
        // if(isLoggedIn){
        //     const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        //     const collectionComments = mongo.db("smoke-show").collection("comments")

        // }else{
        //     const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
        //     try {
        //         // an authenticated user is required to access a MongoDB instance
        //         await app.logIn(credentials).then( async user =>{
        //           const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
        //           const mongoCollection = mongo.db("smoke-show").collection("comments");
        //           const filter = {videoId: 'QHLojVxs'} 
        //           await mongoCollection.find(filter).then(resAll =>{
        //               console.log('find all', resAll);
        //           })
                 
        //         }
        //         )
            
        //        }catch(error){console.log(error)}
        // }
        

       
    }

    useEffect( () => {
        loginCheck()

      })

    return(
            <Layout >
            <Helmet>
                <meta charSet="utf-8" />
                <title>Home | The Smoke Show</title>
                <meta name="description" content="Place the meta description text here." />
                <meta name="robots" content="noindex, nofollow" />
                {/* <link rel="canonical" href="http://mysite.com/example" /> */}
            </Helmet>
                <div className="main-wrapper">
                <div className="spacer-4rem"></div>
                <h2 className="title">New Today</h2>
                <Row style={{paddingLeft:'-7px', paddingRight:'-7px'}}>
                {
                    carTempData.map((car, index) =>{
                        const uuid = uuidv4()
                        return(
                            <Fragment key={uuid}>
                                <Col sm={6} className="main-col" >
                                    <Row >
                                        <Col sm={8} >
                                            <div className="videoWrapper">
                                                <iframe src={videoEmbedURL + car.videoId}
                                                        frameBorder='0'
                                                        allow='autoplay; encrypted-media'
                                                        allowFullScreen
                                                        title='video'
                                                />
                                
                                            </div>
                                            <h3 style={{marginTop:'10px'}} >{car.youtube.snippet.title}</h3>
                                            <Row className="comment-wrapper" >
                                                <div className="col-1" style={{margin:0,padding:0}} >
                                                {car.profile_pic ? <img src={car.profile_pic} 
                                                
                                                className="creator-profile-pic" alt="car"/> :
                                                <Avatar color={Avatar.getRandomColor('sitebase', ['red', 'green', 'teal'])} className="creator-profile-pic" name={car.creator} />
                                                }
                                                    
                                                </div>
                                                <div className="col-11" style={{paddingRight:0, margin: 'auto'}} >
                                                <div className="creator-name"><strong>{car.creator}</strong><br /> <span style={{color:'gray', fontSize: '13px'}}>{' '} {car.fans} fans</span></div>

                                                </div>
                                            </Row>
                                            <Suspense fallback={<div class="loader">Loading...</div>}>
                                                <Comments comments={commentsTempData[index]} videoId={car.videoId} />
                                            </Suspense>
                                            
                                        </Col>
                                        <Col sm={4} className="spec-col"  >
                                            <div className="spec-wrapper" key={'spec-wrapper' + uuid}>
                                            <img alt={car.name} src={require(`../assets/car-brand-logos/${car.logoUrl}`).default} className="icon-s" />{' '}<span className="spec-text" ><strong >{car.name}</strong></span><br/>
                                            <img alt="price" src={priceIcon} className="icon-s" /><span className="spec-text" >{' '}${car.price}</span><br />
                                            <img alt="power " src={powerIcon} className="icon-s" /><span  className="spec-text">{' '}{car.engine}</span><br />
                                            <img alt="piston" key={pistonIcon} src={pistonIcon}  className="icon-s" /><span className="spec-text">{' '}{car.hoursepower}</span><br />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Fragment>
                        )
                    })
                }
            </Row>
            <div className="spacer-4rem"></div>
            <div className="title title-adj">
                <h2 style={{marginBottom: '-1rem'}}>{titleStr}</h2>
                <Form inline onSubmit={handleVideoSearch} style={{marginRight: '-8px'}}>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2 form-adj" onChange={handleChangeKeyword}/>
                </Form>
                </div>
                <Row style={{paddingLeft:'-7px', paddingRight:'-7px'}}>
                {searchedCarData &&
                    searchedCarData.map((car, index) =>{
                        const uuid = uuidv4()
                        return(
                            <Fragment>
                                <Col sm={6} key={uuid}>
                                    <Row >
                                        <Col sm={8} >
                                            <div className="videoWrapper">
                                                <iframe src={videoEmbedURL + car.videoId}
                                                        frameBorder='0'
                                                        allow='autoplay; encrypted-media'
                                                        allowFullScreen
                                                        title='video'
                                                />
                                    
                                            </div>
                                            <h3 style={{marginTop:'10px'}}>{car.youtube.snippet.title}</h3>
                                        </Col>
                                        <Col sm={4} style={{paddingLeft:0}} >
                                            <div className="spec-wrapper">
                                            {/* <img alt={car.name} key={car.logoUrl} src={require(`../assets/car-brand-logos/${car.logoUrl}`).default} className="icon-s" />{' '}<span className="spec-text"><strong>{car.name}</strong></span><br/>
                                            <img alt="price" key={priceIcon} src={priceIcon} className="icon-s" /><span className="spec-text">{' '}${car.price}</span><br />
                                            <img alt="power " key={powerIcon} src={powerIcon} className="icon-s" /><span className="spec-text">{' '}{car.engine}</span><br />
                                            <img alt="piston" key={pistonIcon} src={pistonIcon} className="icon-s" /><span className="spec-text">{' '}{car.hoursepower}</span><br /> */}
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Fragment>

                        )
                    
                })
                }
                </Row>
            </div>
            </Layout>
    )
}
const mapStateToProps = (state) => {
    //syntax is propName: state.key of combineReducer.key
    return{
      username: state.user.username,
    }
  }

export default connect(mapStateToProps)(HomePage)

// --data '{"personalizations": [{"to": [{"email": "saki@musicofsnow.io"}]}],"from": {"email": "saki@thehoongroup.com"},"subject": "Hello, World!","content": [{"type": "text/plain", "value": "Heya!"}]}'
