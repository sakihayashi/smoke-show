import React, { useEffect, useState, Fragment } from 'react'
import {Helmet} from "react-helmet"
import { Row, Col, Spinner } from 'react-bootstrap'
import { connect } from 'react-redux'
import wheelImg from '../assets/global/smoke-wheel.png'
// import { youtubeAPI } from '../utils/youtubeAPI'
// import { carTempData } from './carTempData'
// import { commentsTempData } from './commentsTempData' 
// import Avatar from 'react-avatar'
// import { v4 as uuidv4 } from 'uuid';
import Head from './Layout/Head'
import Layout from './Layout/Layout'
import '../scss/spinner.css'
import './homepage.scss'
import jwt from 'jsonwebtoken'
import * as Realm from "realm-web"
import moment from 'moment'
// import SpecDiv from './SpecDiv'
import loadable from '@loadable/component'
import MediaNet from './MediaNet'

const Comments = loadable(() => import('./Comments'))
const SpecDiv = loadable(() => import('./SpecDiv'))
const VideoDiv = loadable(()=> import('./VideoDiv'))

// const Comments = React.lazy(() => import('./Comments'))

const HomePage = (props) =>{
const app = new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID })
// const videoEmbedURL = 'https://www.youtube.com/embed/'
const [latestVideos, setLatestVideos] = useState([])
const [isLoading, setIsloading] = useState(false)
// const EddieXChannelId = 'UCdOXRB936PKSwx0J7SgF6SQ'
// const [searchKeyword, setSearchKeyword] = useState('')
// const [titleStr, setTitleStr] = useState('Your search result')
// const [searchedCarData, setSearchedCarData] = useState([])
// const [currentUser, setCurrentUser] = useState('')
// const [influencerObj, setInfluencerObj] = useState([])

    // const handleChangeKeyword = (e) =>{
    //     setSearchKeyword(e.target.value)
    // }
    // const handleVideoSearch = async e =>{
    //     e.preventDefault()
    //     await youtubeAPI.get('/search', {
    //         params: {
    //             q: searchKeyword,
    //             channelId: EddieXChannelId
    //         }
    //     }).then(res =>{
    //         console.log('res from youtube', res)
    //         setTitleStr("EddieX " + searchKeyword)
    //         const searchResult = res.data.items
    //         console.log('is this array?', res.data.items)
    //         const datayoutube =[]
    //         searchResult.map(data =>{
    //             datayoutube.push({
    //                 videoId: data.id.videoId,
    //                 youtube:{
    //                     snippet: {title: data.snippet.title}
    //                 }
    //             })
    //             return
    //         })
    //         setSearchedCarData(datayoutube)
    //         console.log('use state check: ', searchedCarData)

    //     })
    // }
    const getVideos = async (credentials) =>{
        setLatestVideos([])
        const now = new Date()
        // const days = 7
        // let dates = []

        // const today = moment(now).format('YYYY-MM-DD')
        // dates.push(today)
        const aWeekAgo = moment(now).add(-7, 'day').format('YYYY-MM-DD')

        // for(let i =1; i < days; i++){
        //     const result = moment(now).add(-[i], 'day').format('YYYY-MM-DD')
        //     dates.push(result)
        // }
    
        try {
            await app.logIn(credentials).then(async user =>{
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const collectionVideos = mongo.db("smoke-show").collection("youtube-videos")
                
                const filter = {'snippet.publishedAt': {$gt: aWeekAgo}}
                const options = {sort: {"snippet.publishedAt": -1}  }
                await collectionVideos.find(filter, options).then(async videos =>{
                   
                    const collectionInfluencer = mongo.db("smoke-show").collection("influencers")
                    const collectionCars = mongo.db("smoke-show").collection("cars")
                    const collectionManual = mongo.db("smoke-show").collection("cars-manual")
                    
                    const result = videos.map(async video =>{
                        const filterCar = {_id: {"$oid": video.carDataId}}
                        const filterInflu = {userId: video.userId}

                        try {
                            await collectionInfluencer.findOne(filterInflu).then(async influencer =>{
                                let formattedFans;
                                const collectionFans = mongo.db("smoke-show").collection(`fans-${influencer.username}`)
                                video.influencer = influencer
                                try {
                                    collectionFans.count().then(async num =>{
                                        if(num > 999){
                                            formattedFans = Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k'
                                            video.fans = formattedFans
                                           
                                        }else{
                                            formattedFans = Math.sign(num)*Math.abs(num)
                                            video.fans = formattedFans
                                        }
                                        
                                        try {
                                            await collectionCars.findOne(filterCar).then(async data =>{
                                                if(data){
                                                video.carData = data
                                                setLatestVideos(latestVideos =>[...latestVideos, video])
                                                }else{
                                                await collectionManual.findOne(filterCar).then(data =>{
                                                    if(data){
                                                        video.carData = data
                                                        setLatestVideos(latestVideos =>[...latestVideos, video])
                                                    }else{
                                                        console.log('no data')
                                                    }
                                                   
                                                })
                                                }
                                            })
                                        } catch (error) {
                                            console.log(error)
                                        }
                                    })
                                } catch (error) {
                                    console.log(error)
                                }
                                
                            })
                        } catch (error) {
                            console.log(error)
                        }
                        
                    })
                    
                })
            })
        } catch (error) {
            console.log(error)
        }
    }
    const numberWithCommas = (x) =>{
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const loginCheck = async () =>{
        const tokenUser = sessionStorage.getItem('session_user')
        if(tokenUser){
            jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, (err, decoded)=>{
                if(err){
                    const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    getVideos(credentials)
                }else{
                    getVideos(decoded.cre)
                }
            })
        }else{
            const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
            getVideos(credentials)
        }
    }

    useEffect( () => {
        setIsloading(false)
        const res = loginCheck()
        if(res){
            setIsloading(true)
        }
        
      }, [])

    return(
        <Layout >
            <Helmet>
                <meta charSet="utf-8" />
                <title>Home | The Smoke Show</title>
                <meta name="description" content="Place the meta description text here." />
                <Head />
                {/* <link rel="canonical" href="http://mysite.com/example" /> */}
            </Helmet>
                <div className="main-wrapper" style={{minHeight: 'calc(100vh - 21rem'}}>
                <div className="spacer-4rem"></div>
                <h2 className="title">New This Week</h2>
                <Row className="bio-main-row">
                {!isLoading && <Spinner />}
                {latestVideos &&
                    latestVideos.map((video, index) =>{
                        const str = video.carData.model
                        const id = video.videoId
                        
                        const model = str.charAt(0).toUpperCase() +str.slice(1)
                        const name = video.carData.make
                        const titleCase = name.charAt(0).toUpperCase() +name.slice(1)
                        let price;
                        if(video.carData.price && video.carData.price.baseMSRP){
                            price = numberWithCommas(video.carData.price.baseMSRP)
                            console.log('price', price)
                        }else{ price = ''}
                     
                        const date = moment(video.snippet.publishedAt).fromNow()
                        return(
                            <Fragment key={video.videoId +index}>
                                <Col sm={6} className="main-col" >
                                    <Row >
                                        <Col sm >
                                            <VideoDiv video={video} videoId={id} />
                                         
                                            <h3 style={{marginTop:'10px'}} className="video-title">{video.snippet.title}</h3>
                                            <small>{date}</small>
                                           
                                            <Row className="comment-wrapper" >
                                                <div className="col-1" style={{margin:0,padding:0}} >
                                                {video.influencer.profilePic ? <img src={video.influencer.profilePic} 
                                                
                                                className="creator-profile-pic" alt={video.snippet.channelTitle}/> :
                                                <div
                                                style={{width:'46px', height: '46px', backgroundColor: 'teal'}}
                                                className="creator-profile-pic" name={video.snippet.channelTitle}></div>
                                                }
                                                    
                                                </div>
                                                <div className="col-11" style={{paddingRight:0, margin: 'auto'}} >
                                                <div className="creator-name"><strong>{video.snippet.channelTitle}</strong><br /> <span style={{color:'gray', fontSize: '13px'}}>{video.fans && video.fans} {''} fans</span></div>
                                                </div>
                                                
                                            </Row>
                                            
                                            <input className="acd-input" type="checkbox" id={`title${index}`} />
                                    
                                            <label className="show-label" htmlFor={`title${index}`} className="acd-label">Show </label>
                                            <div className="desc-box">
                                                {video.snippet.description}
                                            </div> 
                                            <div className="content">
                                                <small className="wrap-text-desc">{video.snippet.description}</small>
                                            </div>
                                           <div className="spacer-4rem"></div>
                                            <Comments videoId={video.videoId} />
                                            
                                        </Col>
                                        <Col sm="auto" className="spec-col"  >
                                        <div style={{minWidth: '160px'}}>
                                        
                                            <SpecDiv video={video} titleCase={titleCase} price={price} model={model}/>
                                            <div className="ad-container">
                                                <div className="ad-160">
                                                    <MediaNet divId='554833626' size="160x600" />
                                                </div>
                                                <div className="ad-300">
                                                    <MediaNet divId='554833626' size="300x250" />
                                                </div>
                                            
                                                {/* <p style={{color: 'gray'}}>ads will go here</p>
                                                <p style={{color: 'gray'}}> 160px x 600px <br/>for above 576px</p>
                                                <p style={{color: 'gray'}}> 300px x 250px <br/> for above 1400px </p> */}
                                            </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Fragment>
                        )
                    })
                
                }
                
            </Row>
           
            {/* <div className="spacer-4rem"></div> */}
            {/* <div className="title title-adj">
                <h2 style={{marginBottom: '-1rem'}}>{titleStr}</h2>
                <Form inline onSubmit={handleVideoSearch} style={{marginRight: '-8px'}}>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2 form-adj" onChange={handleChangeKeyword}/>
                </Form>
            </div> */}
            {/* <Row style={{paddingLeft:'-7px', paddingRight:'-7px'}}>
                {searchedCarData &&
                    searchedCarData.map((car, index) =>{
                        const uuid = uuidv4()
                        return(
                            <Fragment key={uuid} >
                                <Col sm={6}>
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
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Fragment>
                        )
                })
                }
                </Row> */}
                
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

