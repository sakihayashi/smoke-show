import React, { useEffect, useState, Fragment } from 'react'
import { Helmet } from "react-helmet"
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import * as Realm from "realm-web"
// import Avatar from 'react-avatar'
import './bioPage.scss'
// import * as Papa from 'papaparse'
import { youtubeAPI } from '../../utils/youtubeAPI'
import { carTempData } from '../carTempData'
import { commentsTempData } from '../commentsTempData' 
import Comments from '../Comments'
import { uid } from 'react-uid'
import Layout from '../Layout/Layout'
import SubNav from './SubNav'
import jwt from 'jsonwebtoken'

import powerIcon from '../../assets/global/Horsepower.png'
import pistonIcon from '../../assets/global/piston.png'
import priceIcon from '../../assets/global/Price-Tag-icon.png'

const BioPage = (props) =>{
    const influencerId = props.match.params.id
    const [influencer, setInfluencer] = useState({userId: '', fname: '', lname: '', username: '', fans: null, desc: '', channelId: '', banner_img: '', profile_pic: '', featuredVideo: {id: '', title: ''}})
    // const { banner_img, username, profile_pic, fans } = props.location.state.influencer
    const [formattedFans, setFormattedFans] = useState('')
    
    // const { params: { id } } = props.match
    const videoEmbedURL = 'https://www.youtube.com/embed/'
    // const EddieXChannelId = 'UCdOXRB936PKSwx0J7SgF6SQ'
    const [searchKeyword, setSearchKeyword] = useState('')
    const [titleStr, setTitleStr] = useState('Your search result')
    const [searchedCarData, setSearchedCarData] = useState([])
    const [latestVideos, setLatestVideos] = useState([])
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
      };
    const app = new Realm.App(appConfig);
    // const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
    // const handleChangeKeyword = (e) =>{
    //     setSearchKeyword(e.target.value)
    // }
    // const handleVideoSearch = async e =>{
    //     e.preventDefault()
    //     await youtubeAPI.get('/search', {
    //         params: {
    //             q: searchKeyword,
    //             channelId: influencer.channelId
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
    //         })
    //         setSearchedCarData(datayoutube)
    //         console.log('use state check: ', searchedCarData)
            
    //     })
    // }
    const numberWithCommas = (x) =>{
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const getInfluencer = async (mongo) =>{

            try {
                const mongoCollection = mongo.db("smoke-show").collection("influencers");
                const filter = {userId: influencerId} 
                await mongoCollection.findOne(filter).then( async res =>{
                    console.log('res', res)
                    setInfluencer(res)
                    const collectionFans = mongo.db("smoke-show").collection(`fans-${res.username}`)
                    try{
                        await collectionFans.count().then(num =>{
                            if(num > 999){
                                setFormattedFans(Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k')
                            }else{
                                setFormattedFans(Math.sign(num)*Math.abs(num))
                            }
                        })
                    }catch(err){console.log(err)}
                    
                })
             }catch(error){console.log(error)}
        
    }
    const getVideos = async (mongo) =>{
        setLatestVideos([])
        const collectionVideos = mongo.db("smoke-show").collection("youtube-videos")
        const collectionCars = mongo.db("smoke-show").collection("cars")
        const collectionManual = mongo.db("smoke-show").collection("cars-manual")
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
        const filter = {userId: influencerId}
        const options = {sort: {"snippet.publishedAt": -1}, limit: 5 }
        let temp=[]
        try {
            await collectionVideos.find(filter, options).then(videos =>{
                console.log(videos)
                videos.map(video =>{
                    dates.map(date =>{
                        if(video.snippet.publishedAt.includes(date)){
                            temp.push(video)
                            return
                        }
                    })
                })
                return temp
            }).then(async filtered =>{
                filtered.map(async video =>{
                    const filterCar = {_id: {"$oid": video.carDataId}}
                    try {
                        await collectionCars.findOne(filterCar).then(async data =>{
                            if(data){
                            video.carData = data
                            console.log('video', video)
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
            })
        } catch (error) {
            
        }
    }

    const checkToken = async () =>{
        const token = sessionStorage.getItem('session_user')
        if(token){
            jwt.verify(token, process.env.REACT_APP_JWT_SECRET, async( err, decoded) =>{
                if(err){
                    const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    await app.logIn(credentials).then( user =>{
                    const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                    return mongo
                }).then( mongo => {
                    getInfluencer(mongo)
                    getVideos(mongo)
                })
                }else{
                    const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                    getInfluencer(mongo)
                    getVideos(mongo)
                }
            })
        }else{
            const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    await app.logIn(credentials).then( user =>{
                    const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                    return mongo
                }).then( mongo => {
                    getInfluencer(mongo)
                    getVideos(mongo)
                })
        }
    }
      useEffect(() => {
        checkToken()
        
      }, [])

    return(
        <Layout>
            <Helmet>
                <title>Influencer {`${influencer.username}`} Bio | The Smoke Show</title>
            </Helmet>
            <div className="main-wrapper">
   
                <SubNav influencer={influencer} formattedFans={formattedFans} />

                <div className="spacer-2rem"></div>
                <Row className="bio-main-row">
                    <Col sm={6}>
                        <div className="videoWrapper">
                            <iframe src={ typeof(influencer.featuredVideo.id) == 'undefined' ? '' : videoEmbedURL + influencer.featuredVideo.id}
                                    frameBorder='0'
                                    allow='autoplay; encrypted-media'
                                    allowFullScreen
                                    title='video'
                            />
                            
                        </div>
                        <h3 style={{marginTop:'10px'}}>{influencer.featuredVideo.title}</h3>
                    </Col>
                    <Col sm={6}>
                        <div className="bio-desc-wrapper">
                            <p>{influencer.desc}</p>
                        </div>
                        
                    </Col>
                </Row>
                <div className="spacer-4rem"></div>
                <h2 className="title">New This Week</h2>
                <Row className="bio-main-row">
                { latestVideos && 
                    latestVideos.map((video, index) =>{
                        const str = video.carData.model
                        const model = str.charAt(0).toUpperCase() +str.slice(1)
                        const name = video.carData.make
                        const titleCase = name.charAt(0).toUpperCase() +name.slice(1)
                        let price;
                        const car = video.carData
                        console.log('price', video.carData.price)
                        if(video.carData.price && video.carData.price.baseMSRP){
                            price = numberWithCommas(video.carData.price.baseMSRP)
                        }else{ price = ''}
                        return (
                        <Fragment key={video.videoId}>
                        <Col sm={6} >
                        <Row>
                            <Col sm >
                                <div className="videoWrapper">
                                    <iframe src={videoEmbedURL + video.videoId}
                                            frameBorder='0'
                                            allow='autoplay; encrypted-media'
                                            allowFullScreen
                                            title='video'
                                    
                                    />
                                </div>
                                <h3 style={{marginTop:'10px'}}>{video.snippet.title}</h3>
                                
                                <input className="acd-input" type="checkbox" id={`title${index}`} />
                                    
                                <label htmlFor={`title${index}`} className="acd-label">Show </label>
                                <div className="desc-box">
                                    {video.snippet.description}
                                </div> 
                                <div className="content">
                                    <small>{video.snippet.description}</small>
                                </div>
                                <div className="spacer-4rem"></div>
                                <Comments videoId={video.videoId}/>
                            </Col>
                            <Col sm="auto" className="bio-stats">
                                <div className="ad-size">
                                <div className="spec-wrapper">
                                <img alt={car.name}  src={require(`../../assets/maker_logos/${titleCase}_Logo.png`).default} className="icon-s" />{' '}<span className="spec-text"><strong>{car.name}</strong></span><br/>
                                <img alt="price" key={priceIcon} src={priceIcon} className="icon-s" /><span className="spec-text">{' '}${price.baseMSRP}</span><br />
                                <img alt="power " key={powerIcon} src={powerIcon} className="icon-s" /><span className="spec-text">{' '}{car.features.Engine.Torque}</span><br />
                                <img alt="piston" key={pistonIcon} src={pistonIcon} className="icon-s" /><span className="spec-text">{' '}{car.features.Engine.Horsepower}</span><br />
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
                    </Fragment>)
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
        
                        return <>
                        <Col sm={6} key={uid(car)}>
                        <Row>
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
                            <Col sm={4} style={{paddingLeft:0}}>
                                <div className="spec-wrapper">
                 
                                </div>
                            </Col>
                        </Row>
                    </Col>
                        </>
                })
                }
                </Row> */}
            </div>
        </Layout>
        
    )
}


const mapDispatchToProps = (dispatch) =>{
    return{
        
    }
}
const mapStateToProps = (state) => {
    console.log('no state?', state.auth.mongo)
    //syntax is propName: state.key of combineReducer.key
    return{
      username: state.user.username,
      mongo: state.auth.mongo
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(BioPage)

