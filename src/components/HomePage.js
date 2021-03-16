import React, { useEffect, useState, Fragment } from 'react'
import {Helmet} from "react-helmet"
import { Row, Col, Spinner } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
// import wheelImg from '../assets/global/smoke-wheel.png'
// import { youtubeAPI } from '../utils/youtubeAPI'

// import Avatar from 'react-avatar'
import Head from './Layout/Head'
import Layout from './Layout/Layout'
import '../scss/spinner.css'
import './homepage.scss'
import jwt from 'jsonwebtoken'
import * as Realm from "realm-web"
import moment from 'moment'
import loadable from '@loadable/component'

const Comments = loadable(() => import('./Comments'))
const SpecDiv = loadable(() => import('./SpecDiv'))
const VideoDiv = loadable(()=> import('./VideoDiv'))

const HomePage = (props) =>{
let today = new Date()
const timeISO = today.toISOString()
let published = new Date('2021-03-01')
const publishedISO = published.toISOString()

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
        const aWeekAgo = moment(now).add(-7, 'day').format('YYYY-MM-DD')
    
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
                    
                    const results = videos.map(async video =>{
                     
                        const filterCar = {_id: {"$oid": video.carDataId}}
                        const filterInflu = {userId: video.userId}

                           const influencer = await collectionInfluencer.findOne(filterInflu)
                           if(influencer){
                            video.influencer = influencer
                            let formattedFans;
                            const collectionFans = mongo.db("smoke-show").collection(`fans-${influencer.username}`)
                            try {
                                await collectionFans.count().then(num =>{
                                    if(num > 999){
                                        formattedFans = Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k'
                                        video.fans = formattedFans
                                        
                                    }else{
                                        formattedFans = Math.sign(num)*Math.abs(num)
                                        video.fans = formattedFans
                                    }
                                })
                            } catch (error) {
                                
                            }
                            const data = await collectionCars.findOne(filterCar)
                                if(data){
                                video.carData = data
                                return video

                                }else{
                                    console.log('ever called?')
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
                           }else{
                               console.log('need data fix')
                           }
                    })
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
                
                <title>Home | The Smoke Show</title>
                
                <meta name="description" content="The Smoke Show is a home for auto fans, built by auto fans. The best place to watch Car Vloggers and find all Car Info. Learn all about giveaways and buy swag!" />
                <Head />
                {/* <base target="_blank" href="https://thesmokeshow/" /> */}
                <link rel="canonical" href="https://thesmokeshow.com" />
                <script type="application/ld+json">{`
                    {
                        "@context": "http://schema.org",
                        "@graph": [{"@type":"WebSite","@id":"https://thesmokeshow.com/#website","url":"https://thesmokeshow.com/","name":"The Smoke Show","description":"","potentialAction":[{"@type":"SearchAction","target":"https://thesmokeshow.com/?s={search_term_string}","query-input":"required name=search_term_string"}],"inLanguage":"en"},{"@type": ["WebPage","CollectionPage"],
                        "@id": "https://thesmokeshow.com/#webpage", "url": "https://thesmokeshow.com/", "name": "The Home For Auto Fans, Built By Auto Fans | The Smoke Show","isPartOf":{"@id":"https://thesmokeshow.com/#website"}, "datePublished": "${publishedISO}", "dateModified": "${timeISO}", "description": "The Smoke Show is a home for auto fans, built by auto fans. The best place to watch Car Vloggers and find all Car Info. Learn all about giveaways and buy swag!", "breadcrumb":{"@id":"https://thesmokeshow.com/#breadcrumb"},"inLanguage":"en","potentialAction":[{"@type":"ReadAction","target":["https://thesmokeshow.com/"]}]},
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
                                            <VideoDiv video={video} videoId={id} />
                                         
                                            <h3 style={{marginTop:'10px'}} className="video-title">{video.snippet.title}</h3>
                                            <small>{date}</small>
                                           
                                            <Row className="comment-wrapper" >
                                                
                                                <div className="col-1" style={{margin:0,padding:0}} >
                                                <Link to={`/influencer/${video.userId}`}>
                                                {video.influencer.profilePic ? <img src={video.influencer.profilePic} 
                                                className="creator-profile-pic" alt={`A car vlogger ${video.snippet.channelTitle} | The Smoke Show`}/> :
                                                <div
                                                style={{width:'46px', height: '46px', backgroundColor: 'teal'}}
                                                className="creator-profile-pic" name={video.snippet.channelTitle}></div>
                                                }
                                                </Link> 
                                                </div>
                                                
                                                <div className="col-11" style={{paddingRight:0, margin: 'auto'}} >
                                                    <Link to={`/influencer/${video.userId}`}>
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
                                        
                                            <SpecDiv video={video} titleCase={titleCase} price={price} model={model} dataid={video.carDataId}/>
                                            {/* <div className="ad-container">
                                            
                                            
                                                <p style={{color: 'gray'}}>ads will go here</p>
                                                <p style={{color: 'gray'}}> 160px x 600px <br/>for above 576px</p>
                                                <p style={{color: 'gray'}}> 300px x 250px <br/> for above 1400px </p>
                                            </div> */}
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

