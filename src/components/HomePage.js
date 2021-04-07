import React, { useEffect, useState, Fragment } from 'react'
import {Helmet} from "react-helmet"
import { Row, Col, Spinner } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
// import VisibilitySensor from 'react-visibility-sensor'
// import wheelImg from '../assets/global/smoke-wheel.png'

import Layout from './Layout/Layout'
import '../scss/spinner.css'
import '../scss/index.scss'
import './homepage.scss'
import jwt from 'jsonwebtoken'
import * as Realm from "realm-web"
import moment from 'moment'
import loadable from '@loadable/component'
import ReactPlayer from 'react-player/lazy'
import { adHome } from './adData'
const Comments = loadable(() => import('./Comments'))
const SpecDiv = loadable(() => import('./SpecDiv'))

const HomePage = () =>{
const videoWatchURL = 'https://www.youtube.com/watch?v='
const seoDesc = 'The Smoke Show is a home for auto fans, built by auto fans. The best place to watch Car Vloggers and find all Car Info. Learn all about giveaways and buy swag!'
let today = new Date()
const timeISO = today.toISOString()
let published = new Date('2021-03-01')
const publishedISO = published.toISOString()
const s3BaseUrl = 'https://dwdlqiq3zg6k6.cloudfront.net/'
// const [visibleOn, setVisibleOn] = useState(null)
const app = new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID })
// const videoEmbedURL = 'https://www.youtube.com/embed/'
const [latestVideos, setLatestVideos] = useState([])
const [isLoading, setIsloading] = useState(false)
const [isImg, setIsImg] = useState(false)
    const swapImg = () =>{
        
    }
    const getVideos = async (credentials) =>{
        setLatestVideos([])
        const now = new Date()
        const aWeekAgo = moment(now).add(-7, 'day').format('YYYY-MM-DD')
        let tempArr = []
        try {
            await app.logIn(credentials).then(async user =>{
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const collectionVideos = mongo.db("smoke-show").collection("youtube-videos")
                const collectionKirk = mongo.db("smoke-show").collection(`fans-Lexurious Fleet`)
                const collectionEddie = mongo.db("smoke-show").collection(`fans-EddieX`)
                let kirkFans = await collectionKirk.count()
                if(kirkFans > 999){
                    kirkFans = Math.sign(kirkFans)*((Math.abs(kirkFans)/1000).toFixed(1)) + 'k'
                    
                }else{
                    kirkFans = Math.sign(kirkFans)*Math.abs(kirkFans)
                }
                let eddieFans = await collectionEddie.count()
                if(eddieFans > 999){
                    eddieFans = Math.sign(eddieFans)*((Math.abs(eddieFans)/1000).toFixed(1)) + 'k'
                    
                }else{
                    eddieFans = Math.sign(eddieFans)*Math.abs(eddieFans)
                }
                const filter = {'snippet.publishedAt': {$gt: aWeekAgo}}
                const options = {sort: {"snippet.publishedAt": -1}  }
                await collectionVideos.find(filter, options).then(async videos =>{
             
                    const collectionCars = mongo.db("smoke-show").collection("cars")
                    const collectionManual = mongo.db("smoke-show").collection("cars-manual")
                    
                    const results = videos.map(async video =>{
                        tempArr.push(false)
                        if(video.userId === '60230361f63ff517d4fdad14'){
                            video.fans = eddieFans
                            
                        }else if(video.userId === '602303890ff2832f7d19a2af'){
                            video.fans = kirkFans
                        }else{
                            video.fans = 0
                        }

                        const filterCar = {_id: {"$oid": video.carDataId}}
                        const data = await collectionCars.findOne(filterCar)
                        if(data){
                        video.carData = data
                        return video

                        }else{
                        const data = await collectionManual.findOne(filterCar)
                            if(data){
                                video.carData = data
                                return video

                            }else{
                                console.log('no data')
                                video.carData = {make: '', year: null, price: {baseMSRP: ''}}
                                return video
                            }
                        }
                    })
                    
                    // setVisibleOn(tempArr)
                    Promise.all(results).then(videos =>{
                        setLatestVideos(videos)
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
            <Helmet encodeSpecialCharacters={true} >
                
                <title>The Smoke Show -The Home For Auto Fans, Built By Auto Fans</title>
                
                <meta name="description" content={seoDesc} />

                <link rel="canonical" href="https://thesmokeshow.com" />
                <script type="application/ld+json">{`
                    {
                        "@context": "http://schema.org",
                        "@graph": [{"@type":"WebSite","@id":"https://thesmokeshow.com/#website","url":"https://thesmokeshow.com/","name":"The Smoke Show","description":"${seoDesc}","potentialAction":[{"@type":"SearchAction","target":"https://thesmokeshow.com/search?s={search_term_string}","query-input":"required name=search_term_string"}],"inLanguage":"en"},{"@type": ["WebPage","CollectionPage"],
                        "@id": "https://thesmokeshow.com/#webpage", "url": "https://thesmokeshow.com/", "name": "The Home For Auto Fans, Built By Auto Fans | The Smoke Show","isPartOf":{"@id":"https://thesmokeshow.com/#website"}, "datePublished": "${publishedISO}", "dateModified": "${timeISO}", "description": "${seoDesc}", "breadcrumb":{"@id":"https://thesmokeshow.com/#breadcrumb"},"inLanguage":"en","potentialAction":[{"@type":"ReadAction","target":["https://thesmokeshow.com/"]}]},
                        {"@type":"BreadcrumbList","@id":"https://thesmokeshow.com/#breadcrumb","itemListElement":[{"@type":"ListItem","position":1,"item":{"@type":"WebPage","@id":"https://thesmokeshow.com/","url":"https://thesmokeshow.com/","name":"Home"}}]}
                        ]
                    }
                `}</script>
                
            </Helmet>
                <div className="main-wrapper" style={{minHeight: 'calc(100vh - 21rem'}}>
                <h1 className="h1-seo">The Home For Auto Fans, Built By Auto Fans</h1>
                <div className="spacer-4rem"></div>
                <h2 className="title">New This Week</h2>
                <Row className="bio-main-row">
                {!isLoading && <Spinner />}
                {latestVideos &&
                    latestVideos.map((video, index) =>{
                        const str = video.carData.model
                        const id = video.videoId
                        let linkUsername = ''
                        let weight = video.carData.features.Measurements["Curb weight"]
                        if(video.userId === '602303890ff2832f7d19a2af'){
                            linkUsername = 'Lexurious-Fleet'
                        }else if(video.userId === '60230361f63ff517d4fdad14'){
                            linkUsername = 'EddieX'
                        }else{
                            console.log('you have to add new user')
                        }
                        if(weight){
                            weight = numberWithCommas(weight)
                        }else{
                            weight= 'N/A'
                        }
                        const model = str.charAt(0).toUpperCase() +str.slice(1)
                        const name = video.carData.make
                        const titleCase = name.charAt(0).toUpperCase() +name.slice(1)
                        let price;
                        if(video.carData.price && video.carData.price.baseMSRP){
                            price = numberWithCommas(video.carData.price.baseMSRP)
                        }else{ price = ''}
                     
                        const date = moment(video.snippet.publishedAt).fromNow()
                        return(
                            <Fragment key={video.videoId +index}>
                                <Col sm={6} className="main-col" >
                                    <Row >
                                        <Col sm >
                                            <div className="videoWrapper">
                                                <ReactPlayer
                                                width="560" 
                                                height="315"
                                                url={videoWatchURL + video.videoId}
                                                controls={true}
                                                />
                                            </div>

                                            <h3 style={{marginTop:'10px'}} className="video-title">{video.snippet.title}</h3>
                                            <small>{date}</small>
                                           
                                            <Row className="comment-wrapper" >
                                                
                                                <div className="col-1" style={{margin:0,padding:0}} >
                                                <Link to={`/influencer/${linkUsername}`}>
                                                <img src={`${s3BaseUrl}${video.userId}/profile/thumbnail`} 
                                                className="creator-profile-pic" alt={`A car vlogger ${video.snippet.channelTitle} | The Smoke Show`}/> 

                                                </Link> 
                                                </div>
                                                
                                                <div className="col-11" style={{paddingRight:0, margin: 'auto'}} >
                                                    <Link to={`/influencer/${linkUsername}`}>
                                                        <div className="creator-name">
                                                        <strong>{video.snippet.channelTitle}</strong><br /> <span style={{color:'gray', fontSize: '13px'}}>{video.fans && video.fans} {''} fans</span>
                                                        </div>
                                                    </Link>
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
                                        
                                            <SpecDiv video={video} titleCase={titleCase} price={price} model={model} dataid={video.carDataId} weight={weight}/>
                                            <div className="ad-container">
                                           
                                            <div id={`unit-${adHome[index]}`} className="tmsads"></div>

                                            
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

