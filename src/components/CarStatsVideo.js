import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from './Layout/Layout'
import { Row, Col, Button} from 'react-bootstrap'
import './carStats.scss'
import * as Realm from "realm-web"
import jwt from 'jsonwebtoken'

import loadable from '@loadable/component'
import beforeIcon from '../assets/global/before.svg'
import moment from 'moment'
import { switchTabs } from './functionsStats'

import { Helmet } from 'react-helmet'

const CarStatsCard = loadable(() => import('./CarStatsCard'))
const VideoDiv = loadable(()=> import('./VideoDiv'))

const CarStatsVideo = (props) =>{
    const statsArr = ['Main Stats', 'Engine', 'Measurements', 'Comfort & Convenience', 'Drive Train', 'Suspension', 'Color', 'Warranty']
    const [carImages, setCarImages] = useState([])
    const [carData, setCarData] = useState()
    const [original, setOriginal] = useState(null)
    const [videos, setVideos] = useState(null)
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
      };
    const app = new Realm.App(appConfig);
    const carDataId = props.match.params.id
    const carMake = props.match.params.make
    const carModel = props.match.params.model
    const carYear = props.match.params.year
    let today = new Date()
    const timeISO = today.toISOString()
    let published = new Date('2021-03-01')
    const publishedISO = published.toISOString()
    const s3BaseUrl = 'https://s3.amazonaws.com/smokeshow.users/'

    const handleTabClick = (tab, index) =>{
       let tempCarArr = [...carData]
       
       tempCarArr[index].activeTab = tab
       setCarData(tempCarArr)
    }
    const handleTabClickOriginal = (tab, index) =>{
        setOriginal({...original, activeTab: tab})
    }
    
    const loginCheck = () =>{
        const tokenUser = sessionStorage.getItem('session_user')
        if(tokenUser){
            jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, (err, decoded)=>{
                if(err){
                    const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    getCarData(credentials)
                }else{
                    getCarData(decoded.cre)
                }
            })
        }else{
            const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW)
            getCarData(credentials)

        }

    }
    const getCarData = async (cre) =>{
        const filterMany = {make: carMake, year: Number(carYear), model: carModel}
        
        try {
            await app.logIn(cre).then(async user =>{
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const collectionCars = mongo.db("smoke-show").collection("cars")
                const collectionYoutube = mongo.db("smoke-show").collection("youtube-videos")
                let tempArr = []
      
                const relatedCars = await collectionCars.find(filterMany)
                relatedCars.map(car =>{
                    car.tabs= statsArr 
                    car.activeTab = 'Main Stats'
                    if(car._id.toString() === carDataId){
                        setOriginal(car)
                    }else{
                        tempArr.push(car)
                    }
                })
                setCarData(tempArr)
                const filterVido = {carDataId: carDataId}
                const relatedVideos = await collectionYoutube.find(filterVido)
                if(relatedVideos){
                    setVideos(relatedVideos)
                }else{
                    setVideos(null)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
       loginCheck()

    }, [])
    return(
        <Layout>
            <Helmet  >
 
                <title>{typeof(carMake) !== 'undefined' && `${carMake.toUpperCase()}, ${carYear}, ${carModel.toUpperCase()} all types car statictics | The Smoke Show`}</title>
                <meta name="description" content={`${carMake.toUpperCase()} ${carYear} ${carModel.toUpperCase()} car statistics | engines, price, warranty, color, and more information`} />
                
                <link rel="canonical" href={`https://thesmokeshow.com/car-stats/${carMake}/${carYear}/${carModel}/${carDataId}`} />

                <script src="https://lib.tashop.co/the_smoke_show/adengine.js" async data-tmsclient="The Smoke Show" data-layout="searches" data-debug="true"></script>
                <script>{`window.TAS = window.TAS.reload() || { cmd: [] }`}</script>

                 <script type="application/ld+json">
            {`
                    {
                        "@context": "http://schema.org",
                        "@graph": [{"@type":"WebSite","@id":"https://thesmokeshow.com/#website",
                        "url":"https://thesmokeshow.com/",
                        "name":"The Smoke Show",
                        "description":"",
                        "potentialAction":[{"@type":"SearchAction","target":"https://thesmokeshow.com/search?s={search_term_string}","query-input":"required name=search_term_string"}],
                        "inLanguage":"en"},
                        {"@type": "WebPage",
                        "@id": "https://thesmokeshow.com/giveaways/#webpage", "url": "https://thesmokeshow.com/giveaways/", "name": "Giveaways | The Smoke Show","isPartOf":{"@id":"https://thesmokeshow.com/#website"}, "datePublished": "${publishedISO}", "dateModified": "${timeISO}", "description": "${carMake.toUpperCase()} ${carYear} ${carModel.toUpperCase()} car statistics | engines, price, warranty, colors, and more information.", "breadcrumb":{"@id":"https://thesmokeshow.com/car-stats/${carMake}/${carYear}/${carModel}/${carDataId}/#breadcrumb"},"inLanguage":"en","potentialAction":[{"@type":"ReadAction","target":["https://thesmokeshow.com/car-stats/${carMake}/${carYear}/${carModel}/${carDataId}/"]}]},
                        {"@type":"BreadcrumbList","@id":"https://thesmokeshow.com/#breadcrumb",
                        "itemListElement":[{
                            "@type":"ListItem","position":1,
                            "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/","url":"https://thesmokeshow.com/","name":"Home"}
                            },
                            {
                                "@type":"ListItem",
                                "position":2,
                                "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/car-search/","url":"https://thesmokeshow.com/car-search/","name":"Car statistics search"}
                            },
                            {
                                "@type":"ListItem",
                                "position":3,
                                "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/car-stats/${carMake}","url":"https://thesmokeshow.com/car-stats/${carMake}","name":"Search statistics for ${carMake} cars"}
                            },
                            {
                                "@type":"ListItem",
                                "position":4,
                                "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/car-stats/${carMake}/${carYear}","url":"https://thesmokeshow.com/car-stats/${carMake.toUpperCase()}/${carYear}","name":"Search statistics for ${carMake.toUpperCase()} cars released in ${carYear}"}
                            },
                            {
                                "@type":"ListItem",
                                "position":5,
                                "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/car-stats/${carMake}/${carYear}","url":"https://thesmokeshow.com/car-stats/${carMake}/${carYear}/${carModel}","name":"See all statistics for ${carMake} ${carModel}cars released in ${carYear}"}
                            }
                            ]}
                        ]
                    }
                `}
        </script>
            </Helmet>
            <div className="main-wrapper stats-container" style={{minHeight: 'calc(100vh - 21rem'}}>
                <div className="spacer-4rem"></div>
                <div onClick={()=>props.history.goBack()} className="goback-btn">
                    <img src={beforeIcon} alt="go back" width="24"/>Go Back
                </div>
                <div className="spacer-2rem"></div>
                {original && <CarStatsCard car={original} index="0" handleTabClick={handleTabClickOriginal} switchTabs={switchTabs} />}
                
                <div className="spacer-4rem"></div>
                
                <h2  style={{ marginBottom: 0, borderBottom: '1px solid gray', borderTop: '1px solid gray'}} >Related car data</h2>
                <div className="spacer-2rem"></div>
                {carData ? carData.map((car, index) =>{
                    car.tabs = statsArr
                    {/* console.log('check', carImages) */}
                    let carImg;
                    if(carImages[0]){
                        carImg = carImages[0].link
                    }else{
                        carImg = 'https://smoke-show.s3.amazonaws.com/car-photos/Ferrari-F8_Spider-2020-1280-01.jpg'
                        }
                    return(
                        <CarStatsCard car={car} index={index} handleTabClick={handleTabClick} switchTabs={switchTabs} />
                    )
                }) : <p>No related cars</p>
                }
                <h2  style={{ marginBottom: 0, borderBottom: '1px solid gray', borderTop: '1px solid gray'}} >Related Vlogs</h2>
                <div className="spacer-1rem"></div>
                <Row>
                    {videos && videos.map(video =>{
                        const date = moment(video.snippet.publishedAt).fromNow()
                        return(
                            <Col key={video.videoId}>
                                <VideoDiv video={video} videoId={video.videoId} />
                                <h3 style={{marginTop:'10px'}} className="video-title">{video.snippet.title}</h3>
                                {/* <small>{date}</small> */}
                                <Row>
                                    <div className="col-12">
                                        <Link to={`/influencer/${video.userId}`}>
                                            <img src={`${s3BaseUrl}${video.userId}/profile/thumbnail`} className="creator-profile-pic" alt={`Vlogger ${video.snippet.channelTitle}`}  />
                                            
                                        </Link>
                                    
                                        <div className="creator-name" style={{display: 'inline-flex', height: '100%'}}>
                                            <span style={{margin: 'auto auto auto 5px'}}>
                                            <Link to={`/influencer/${video.userId}`}>
                                            {video.snippet.channelTitle} 
                                            </Link>
                                            
                                            <small style={{marginLeft: '1rem'}}>{date}</small>
                                            </span>
                                            
                                        </div>
                                    </div>
                                </Row>
                            </Col>
                        )
                        
                    })
                    }
                </Row>
                <div className="spacer-4rem"></div>
                <div className="ad-on-search" style={{minHeight: '90px', marginBottom: '1rem'}}>
                    <div id="unit-1620778820240" class="tmsads"></div>
                </div>
                <Link to="/car-search">
                    <Button className="login-btn">Search other cars</Button>
                </Link>
                
            </div>
            
        </Layout>
    )
}

export default CarStatsVideo