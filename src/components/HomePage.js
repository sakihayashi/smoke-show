import React, { useEffect, useState, Fragment, Suspense } from 'react'
import {Helmet} from "react-helmet"
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
// import { youtubeAPI } from '../utils/youtubeAPI'
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
import jwt from 'jsonwebtoken'
import * as Realm from "realm-web"


const Comments = React.lazy(() => import('./Comments'))

const HomePage = (props) =>{
const app = new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID })
const videoEmbedURL = 'https://www.youtube.com/embed/'
const [latestVideos, setLatestVideos] = useState([])
// const EddieXChannelId = 'UCdOXRB936PKSwx0J7SgF6SQ'
// const [searchKeyword, setSearchKeyword] = useState('')
// const [titleStr, setTitleStr] = useState('Your search result')
// const [searchedCarData, setSearchedCarData] = useState([])
const [currentUser, setCurrentUser] = useState('')
const [influencerObj, setInfluencerObj] = useState([])

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
        const days = 6
        let dates = []
        let str = now.toISOString()
        let cleaned = str.split("T")
        dates.push(cleaned[0])
        for(let i =0; i<days; i++){
            now.setDate(now.getDate() - 1);
            now.getDate()
            let temp = now.toISOString()
            let res = temp.split("T")
            dates.push(res[0])
        }
    
        try {
            await app.logIn(credentials).then(async user =>{
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const collectionVideos = mongo.db("smoke-show").collection("youtube-videos")
                
                const filter = null
                let temp=[]
                let influencers = []
                const options = {sort: {"snippet.publishedAt": -1}, limit: 20,  }
                await collectionVideos.find(filter, options).then(async videos =>{
                    videos.map(async video =>{
                        
                        influencers.push(video.userId)
                        dates.map(date =>{
                            if(video.snippet.publishedAt.includes(date)){
                                temp.push(video)
                                return 
                            }
                        })
                        
                    })
                    let unique = [...new Set(influencers)]
                    
                    return {data: temp, id: unique}
                }).then(async obj =>{
                    let influencerArr = []
                    const collectionInfluencer = mongo.db("smoke-show").collection("influencers")
                    const collectionCars = mongo.db("smoke-show").collection("cars")
                    const collectionManual = mongo.db("smoke-show").collection("cars-manual")
                    const result = obj.data.map(async video =>{
                        const filterCar = {_id: {"$oid": video.carDataId}}
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
                    obj.id.map(async id =>{
                        const filter = {userId: id}
                        try {
                            await collectionInfluencer.findOne(filter).then(user =>{
                                influencerArr.push(user)
                            })
                        } catch (error) {
                            console.log(error)
                        }
                        
                    })
                    setInfluencerObj(influencerArr)
                    
                })
            })
        } catch (error) {
            
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
        loginCheck()

      }, [])

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
                <h2 className="title">Latest 7 days</h2>
                <Row className="parent-row">
                {latestVideos &&
                    latestVideos.map((video, index) =>{
                        const str = video.carData.model
                        const id = video.videoId
                        const model = str.charAt(0).toUpperCase() +str.slice(1)
                        const name = video.carData.make
                        const titleCase = name.charAt(0).toUpperCase() +name.slice(1)
                        console.log(titleCase)
                        let price;
                        if(video.carData.price && video.carData.price.baseMSRP){
                            price = numberWithCommas(video.carData.price.baseMSRP)
                        }else{ price = ''}
                        const uuid = uuidv4()
                        let theInfluencer;
                        if(influencerObj){
                            theInfluencer = influencerObj.filter(obj => obj.userId === video.userId)
                        }
                        return(
                            <Fragment key={uuid}>
                                <Col sm={6} className="main-col" >
                                    <Row >
                                        <Col sm >
                                            <div className="videoWrapper">
                                                <iframe src={videoEmbedURL + id}
                                                frameBorder='0'
                                                allow='autoplay; encrypted-media'
                                                allowFullScreen
                                                title='video'
                                                />
                                
                                            </div>
                                            <h3 style={{marginTop:'10px'}} className="video-title">{video.snippet.title}</h3>
                                            <Row className="comment-wrapper" >
                                                <div className="col-1" style={{margin:0,padding:0}} >
                                                {theInfluencer[0] ? <img src={theInfluencer[0].profilePic} 
                                                
                                                className="creator-profile-pic" alt="car"/> :
                                                <Avatar color={Avatar.getRandomColor('sitebase', ['red', 'green', 'teal'])} 
                                                style={{width:'46px', height: '46px'}}
                                                className="creator-profile-pic" name={video.snippet.channelTitle} />
                                                }
                                                    
                                                </div>
                                                <div className="col-11" style={{paddingRight:0, margin: 'auto'}} >
                                                <div className="creator-name"><strong>{video.snippet.channelTitle}</strong><br /> <span style={{color:'gray', fontSize: '13px'}}>{' '} {''} fans</span></div>

                                                </div>
                                            </Row>
                                            <Suspense fallback={<div className="loader">Loading...</div>}>
                                                <Comments comments={commentsTempData[index]} videoId={video.videoId} currentUser={currentUser} />
                                            </Suspense>
                                            
                                        </Col>
                                        <Col sm="auto" className="spec-col"  >
                                        <div className="ad-size">
                                        
                                            <div className="spec-wrapper" key={'spec-wrapper' + uuid}>
                                            <img alt={video.carData.name} src={require(`../assets/maker_logos/${titleCase}_Logo.png`).default} className="icon-s" />{' '}<span className="spec-text" ><strong >{video.carData.year}{' '}{titleCase}{' '}{model}</strong></span><br/>
                                            <img alt="price" src={priceIcon} className="icon-s" /><span className="spec-text" >{' '}${video.carData.price.baseMSRP}</span><br />
                                            <img alt="power " src={powerIcon} className="icon-s" /><span  className="spec-text">{' '}{video.carData.features.Engine.Torque}</span><br />
                                            <img alt="piston" key={pistonIcon} src={pistonIcon}  className="icon-s" /><span className="spec-text">{' '}{video.carData.features.Engine.Horsepower}</span><br />
                                            </div>
                                            <div className="ad-container">
                                                <p style={{color: 'gray'}}>ads will go here</p>
                                                <p style={{color: 'gray'}}> 160px x 600px <br/>for above 576px</p>
                                                <p style={{color: 'gray'}}> 300px x 250px <br/> for above 1400px </p>
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

// --data '{"personalizations": [{"to": [{"email": "saki@musicofsnow.io"}]}],"from": {"email": "saki@thehoongroup.com"},"subject": "Hello, World!","content": [{"type": "text/plain", "value": "Heya!"}]}'
