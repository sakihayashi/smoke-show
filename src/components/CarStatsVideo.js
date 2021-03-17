import React, { useState, Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from './Layout/Layout'
import { Row, Col, Button} from 'react-bootstrap'
import './carStats.scss'
import { v4 as uuidv4 } from 'uuid'
import * as Realm from "realm-web"
import jwt from 'jsonwebtoken'
import priceIcon from '../assets/global/Price-Tag-icon.svg'
import powerIcon from '../assets/global/Horsepower.svg'
import weightIcon from '../assets/global/weight.svg'
import pistonIcon from '../assets/global/piston.png'
// import cylinderIcon from '../assets/global/cylinder.svg'
import transmissionIcon from '../assets/global/transmission.svg'
import mileageIcon from '../assets/global/mileage.svg'
import torqueIcon from '../assets/global/torque.png'
import frontWheels from '../assets/global/front-wheels.png'
import rearWheels from '../assets/global/rear-wheels.png'
import allWheels from '../assets/global/all-wheels.png'
import loadable from '@loadable/component'
import beforeIcon from '../assets/global/before.svg'
import moment from 'moment'

import { Helmet } from 'react-helmet'
import Head from '../components/Layout/Head'

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
    // const carDataId = props.location.state.id
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
    
    const switchTabs = (car, tab) =>{
        let engine, warranty, measurements, comfort, drivetrain, suspension, mileage, weight, totalSeating, colors, baseMSRP, rearseats, driveIcon, driveType

        if(car.features['Engine'] !== undefined) engine = car.features['Engine']
        if(car.features['Warranty'] !== undefined) warranty = car.features['Warranty']
        if(car.features['Measurements'] !== undefined) measurements = car.features['Measurements']
        if(car.features['Measurements'] !== undefined) weight = car.features['Measurements']['Curb weight']
        if(car.features['Comfort & Convenience'] !== undefined) comfort = car.features['Comfort & Convenience']
        if(car.features['Drive Train'] !== undefined){
            drivetrain = car.features['Drive Train']
            driveType = drivetrain['Drive type']
        } 
        if(driveType === undefined){
            driveType = null
        }else if(driveType === 'all wheel drive' || drivetrain['Drive type'] === 'four wheel drive'){
            driveIcon = allWheels
        }else if(driveType === 'front wheel drive'){
            driveIcon = frontWheels
        }else if(driveType === 'rear wheel drive'){
            driveIcon = rearWheels
        }else{driveIcon = allWheels}

        if(car.features['Suspension'] !== undefined) suspension = car.features['Suspension']
        if(car.features['Rearseats'] !== undefined) rearseats = car.features['Rearseats'] 
        if(car.features['Fuel']['EPA mileage est'] == undefined) {
            console.log('no mileage')
        }else{mileage = car.features['Fuel']['EPA mileage est'][' (cty/hwy)']}
        if(car.totalSeating !== undefined) totalSeating = car.totalSeating
        if(car.color !== undefined) colors = car.color
     
        if(car.price === undefined){
            baseMSRP = null
        }else if(car.price.baseMSRP === undefined){
            baseMSRP = null
        }else{
            baseMSRP = car.price.baseMSRP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        
        switch(tab) {
            case 'Main Stats':
              return <Fragment>
                        {baseMSRP &&
                        <div className="stats-box">
                        <div  className="xs-txt">
                            <img src={priceIcon} alt="price" className="icon-stats" />
                            <div>MSRP</div>
                        </div>
                        <div className="stats-label">
                            ${' '} {baseMSRP}
                        </div>
                        
                        </div>}

                        {weight &&
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={weightIcon} alt="weight" className="icon-stats" />
                                <div>Curb weight</div>
                            </div>
                            <div className="stats-label">
                                {weight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </div>
                        </div>
                        }
                        {mileage &&
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={mileageIcon} alt="mileage" className="icon-stats" />
                                <div>Mileage</div>
                            </div>
                            <div className="stats-label">
                                {mileage}
                            </div>
                        </div>
                        }
                        
                        {drivetrain &&
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={transmissionIcon} alt="transmission" className="icon-stats" />
                                <div>Transmission</div>
                            </div>
                            <div className="stats-label">
                                {drivetrain['Transmission']}
                            </div>
                        </div>
                        }
                        {driveType &&
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={driveIcon} alt="drive" className="icon-stats" />
                                <div>Drive type</div>
                            </div>
                            <div className="stats-label">
                                {driveType}
                            </div>
                        </div>
                        }
                        {car.features.Engine.Torque && 
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={torqueIcon} alt="torque" className="icon-stats" />
                                Torque
                            </div>
                            <div className="stats-label">
                                { car.features.Engine.Torque }
                            </div>
                        </div>
                        }
                        {car.features.Engine.Horsepower &&
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={powerIcon} alt="hoursepower" className="icon-stats" />
                                Horsepower
                            </div>
                            <div className="stats-label">
                                { car.features.Engine.Horsepower}
                            </div>
                        </div>
                        }
                        {car.features.Engine.Cylinders &&
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={pistonIcon} alt="Cylinders" className="icon-stats" />
                                Cylinders
                            </div>
                            <div className="stats-label">
                                { car.features.Engine.Cylinders}
                            </div>
                            
                        </div>
                        }
                    </Fragment>
            case 'Engine':
                return <Fragment>
                        { engine && Object.entries(engine).map(([key, value]) =>{
                            return <div className="stats-box"><strong>{key}</strong>:  {value}</div>
                        })}
                      </Fragment>
            case 'Warranty':
                return <Fragment>
                        {warranty && Object.entries(warranty).map(([key, value]) =>{
                            return <div className="stats-box" key={key}><strong>{key}</strong>:  {value}</div>
                        })}
                      </Fragment>
            case 'Measurements':
                return <Fragment>
                        {totalSeating && 
                            <div className="stats-box">Total Seating: {totalSeating}</div>
                        }
                        {rearseats && Object.entries(rearseats).map(([key, value]) =>{
                            return <div className="stats-box" key={key}><strong>{key}</strong>:  {value}</div>
                        })
                        }
                        { measurements && Object.entries(measurements).map(([key, value]) =>{
                            return <div className="stats-box" key={key}><strong>{key}</strong>:  {value}</div>
                        })}
                          
                     
                      </Fragment>  
            case 'Comfort & Convenience':
                return <Fragment>
                        { comfort && Object.keys(comfort).map((key, index)=>{
                            return <div className="stats-box" key={key}>{key}</div>
                        })}
                          
                       
                      </Fragment> 
            case 'Drive Train':
                return <Fragment>
                        { drivetrain && Object.entries(drivetrain).map(([key, value]) =>{
                            if(value === true){
                                return <div className="stats-box" key={key}>{key}<strong></strong></div>
                            }else{
                                return <div className="stats-box" key={key}><strong>{key}</strong>:  {value}</div>
                            }
                            
                        })}
                      </Fragment>
            case 'Suspension':
                return <Fragment>
                        { suspension && Object.keys(suspension).map((key, index)=>{
                            return <div className="stats-box" key={key}>{key}</div>
                        })}
                          
                       
                      </Fragment>    
            case 'Color':
                return <Fragment>
                        <p><strong>Exterior</strong></p>
                        { colors && colors['EXTERIOR'].map((color, index)=>{
                            const uuid = uuidv4()
                            return <Fragment key={uuid}>
                                    <div className="stats-box-outline" >
                                    <div className="color-thumbnail" style={{backgroundColor: `rgb(${color.rgb})`}}></div>
                                    <div className="color-name">{color.name}</div>
                                    </div>
                                   </Fragment>
                        })}
                          <hr />
                       <p><strong>Interior</strong></p>
                       { colors && colors['INTERIOR'].map((color, index)=>{
                            return <div className="stats-box-outline" key={color.name}>
                                    <div className="color-thumbnail" style={{backgroundColor: `rgb(${color.rgb})`}}></div>
                                    <div className="color-name">{color.name}</div>
                                    </div>
                        })}
                      </Fragment>  
            default:
              return <Fragment>
                        <div className="stats-box">Error</div>
                    </Fragment>
          }
    }
    const loginCheck = () =>{
        const tokenUser = sessionStorage.getItem('session_user')
        if(tokenUser){
            jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, (err, decoded)=>{
                if(err){
                    const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    return credentials
                }else{
                    return decoded.cre
                }
            })
        }else{
            const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW)
            return credentials
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
        const credentials = loginCheck()
        getCarData(credentials)

    }, [])
    return(
        <Layout>
            <Helmet encodeSpecialCharacters={true} >
 
                <title>{typeof(carMake) !== 'undefined' && `${carMake.toUpperCase()}, ${carYear}, ${carModel.toUpperCase()} all types car statictics | The Smoke Show`}</title>
                <meta name="description" content={`${carMake.toUpperCase()} ${carYear} ${carModel.toUpperCase()} car statistics | engines, price, warranty, color, and more information`} />
                <link rel="canonical" href={`https://thesmokeshow.com/car-stats/${carMake}/${carYear}/${carModel}/${carDataId}`} />

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
                    const maker = car.make.toUpperCase()
                    const model = car.model.toUpperCase()
                    {/* console.log('check', carImages) */}
                    let carImg;
                    if(carImages[0]){
                        carImg = carImages[0].link
                    }else{
                        carImg = 'https://smoke-show.s3.amazonaws.com/car-photos/Ferrari-F8_Spider-2020-1280-01.jpg'
                        }
                    return(
                        <Fragment key={car.name +index}>
                            <h2 className="title"> {maker} {' '} {model} {' '} {car.year} </h2>
                            <p className="theme-text-p">{car.name}</p>
                            <Row style={{paddingRight: '3px'}}>
                                <Col sm={4}>
                                  
                                     <img src={typeof(car.imgUrl) === 'undefined' ?carImg : car.imgUrl} alt={car.name} style={{width: '100%'}}/> 
                                    {/* <img src={carImg} alt={car.name} style={{width: '100%'}}/> */}
                                </Col>
                                <Col sm={8} style={{paddingLeft: 0}} >
                                    <div className="box-shadow-white car-stats-wrapper" >
                                        <table className="stats-tab-ul">
                                        <tbody>
                                            <tr>
                                            {car.tabs.map(tab =>{
                                                const uuid = uuidv4()
                                                return(
                                                        <td key={uuid} id={uuid} name={tab} custom={tab} onClick={()=>handleTabClick(tab, index)} className={ tab === car.activeTab ? 'tab-link tab-active' : 'tab-link' }>{tab}</td>                                       
                                                )
                                                
                                            })}
                                         
                                            </tr>
                                            </tbody>
                                        </table>
                                        <div className="stats-div">
                                            {switchTabs(car, car.activeTab)}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <div className="spacer-4rem"></div>
                        </Fragment>
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
                <Link to="/car-search">
                    <Button className="login-btn">Search other cars</Button>
                </Link>
                
            </div>
            
        </Layout>
    )
}

export default CarStatsVideo