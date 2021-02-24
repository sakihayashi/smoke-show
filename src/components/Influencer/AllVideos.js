import React, { useEffect, useState, Fragment } from 'react'
import {Helmet} from "react-helmet"
import { Row, Col } from 'react-bootstrap'
import * as Realm from "realm-web"
import Pagination from 'react-bootstrap/Pagination'

import Comments from '../Comments'
import Avatar from 'react-avatar'
import powerIcon from '../../assets/global/Horsepower.png'
import pistonIcon from '../../assets/global/piston.png'
import priceIcon from '../../assets/global/Price-Tag-icon.png'
import Layout from '../Layout/Layout'
import { logInAsPublic, updateLogin } from '../../store/actions/authActions'
import { connect } from 'react-redux'
import jwt from 'jsonwebtoken'
// import noImg from '../../assets/global/no_image.jpg'
import { getInfluencer }from '../../store/actions/influencerActions'
import SubNav from './SubNav'
import './allVideos.scss'
import short from 'short-uuid'

const AllVideos = (props) =>{
    const influencerId = props.match.params.id
    const videoEmbedURL = 'https://www.youtube.com/embed/'
    const [videoArr, setVideoArr] = useState([])
    const [allVideoData, setAllVideoData] = useState([])
    // const [showMore, setShowMore] = useState(false)
    // const [videoIds, setVideoIds] = useState([])
    // const [pageNum, setPageNum] = useState(0)
    const [pgNum, setPgNum] = useState(null)
    // const [credentials, setCredentials] = useState(null)
    const [active, setActive] = useState(1)
    // let active = 1;
  
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
        };
    const app = new Realm.App(appConfig);
    // const [divId, setDivId] = useState(null)
    
    const chunkArray = (allVideos) =>{
        let chunk_size = 12
        let index = 0;
        let arrayLength = allVideos.length;
        let tempArray = [];
        let myChunk
        
        for (index = 0; index < arrayLength; index += chunk_size) {
            myChunk = allVideos.slice(index, index+chunk_size);
            // Do something if you want with the group
            tempArray.push(myChunk);
        }

        return tempArray;
    }

    // const expandDiv = (index)=>{
    //     setDivId(index)
    //     setShowMore(!showMore)
    // }
    const attachCarData = async (chunk, num) =>{
       setVideoArr([])
        // try{
        //     await app.logIn(credentials).then( user =>{
                const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const collectionCars = mongo.db("smoke-show").collection("cars")
                const collectionManual = mongo.db("smoke-show").collection("cars-manual")
                if(chunk){
                    chunk[num].map(async video =>{

                        const filterCar = {_id: {"$oid": video.carDataId}}
                        
                        try{
                            await collectionCars.findOne(filterCar).then(async data =>{
                            
                               if(data){
                                video.carData = data
                                setVideoArr(videoArr =>[...videoArr, video])
                               }else{
                                await collectionManual.findOne(filterCar).then(data =>{
                                    video.carData = data
                                    setVideoArr(videoArr =>[...videoArr, video])
                                })
                               }
                                
                            }).then(res =>{
                                
                            })
                        }catch(err){
                         console.log(err)
                        }
                        
                    })
                }else{
                    allVideoData[num].map(async video =>{

                        const filterCar = {_id: {"$oid": video.carDataId}}
                        
                        try{
                            await collectionCars.findOne(filterCar).then(async data =>{
                            
                               if(data){
                                video.carData = data
                                setVideoArr(videoArr =>[...videoArr, video])
                               }else{
                                await collectionManual.findOne(filterCar).then(data =>{
                                    video.carData = data
                                    setVideoArr(videoArr =>[...videoArr, video])
                                })
                               }
                                
                            }).then(res =>{
                                
                            })
                        }catch(err){
                         console.log(err)
                        }
                        
                    })
                }
                
        //     })
        // }catch(err){
        //     console.log(err)
        // }
        
    }
    const getVideos = async (cre) =>{
        
        try{
            await app.logIn(cre).then(async  user =>{
                if(app.currentUser.id === user.id){
                    console.log('user login updated')
                }
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const mongoCollection = mongo.db("smoke-show").collection("youtube-videos")
                const filter = {userId: influencerId}
                const options = {sort: {"snippet.publishedAt": -1}}
                try{
                    await mongoCollection.find(filter, options).then(async videos =>{
                      
                        const res = Math.floor(videos.length / 12)
                        setPgNum(res)
                        const chunk = chunkArray(videos)
                        setAllVideoData(chunk)

                        return chunk
                    }).then( chunk =>{
                        attachCarData(chunk, 0)
                    })
                }catch(err){
                    console.log(err)
                }
                
            })
        }catch(err){
            console.log(err)
        }
        
    }

    const numberWithCommas = (x) =>{
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const loginCheck = () =>{
        const tokenUser = sessionStorage.getItem('session_user')
        if(tokenUser){
            jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, function(err, decoded) {
                if (err) {
                    // timeout
                    const cre = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    getVideos(cre)
                    
                }else{
                    getVideos(decoded.cre)
                }
              });
            
        }else{
            const cre = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
            // setCredentials(cre)
            getVideos(cre)
            
        }
    }
    const getselectedPage =(number)=>{
        setActive(number)
        attachCarData(null, number)
    }
    const paginationItems = () =>{
        let items = [];
        for (let number = 1; number <= pgNum; number++) {
            items.push(
                <Pagination.Item key={`page-${number}`} active={number === active} onClick={()=>getselectedPage(number)} >
                {number}
                </Pagination.Item>
            )
        }
        return items
    }

    useEffect( () => {
        loginCheck()
        props.getInfluencer(influencerId)
    }, [])
    
    return(
        <Layout >
            <Helmet>
                <meta charSet="utf-8" />
                <title>All Videos from  | The Smoke Show</title>
                <meta name="description" content="Place the meta description text here." />
                <meta name="robots" content="noindex, nofollow" />
                {/* <link rel="canonical" href="http://mysite.com/example" /> */}
            </Helmet>
            
            <div className="main-wrapper">
                <SubNav influencer={props.influencerObj} formattedFans={props.formattedFans} />
            <div className="spacer-4rem"></div>
            <h2 className="title">All Videos from {props.influencerObj.username && props.influencerObj.username}</h2>
            <div className="pagination-wrapper">
                <Pagination>
                    { pgNum && paginationItems() }
                </Pagination>
            </div>
            <Row style={{paddingLeft:'-7px', paddingRight:'-7px'}}>
            {   videoArr[0] &&
                videoArr.map((video, index) =>{
                    const unique = short.generate()
                    const str = video.carData.model
                    const id = video.videoId
                    const model = str.charAt(0).toUpperCase() +str.slice(1)
                    const name = video.carData.make
                    const titleCase = name.charAt(0).toUpperCase() +name.slice(1)
                    let price;
                    if(video.carData.price && video.carData.price.baseMSRP){
                        price = numberWithCommas(video.carData.price.baseMSRP)
                    }else{ price = ''}
                    
                    return(
                        <Fragment key={unique} >
                            <Col sm={6} className="main-col" >
                                <Row className="video-row">
                                    <Col sm={8} >
                                        <div className="videoWrapper">
                                            <iframe src={videoEmbedURL + id}
                                                    frameBorder='0'
                                                    allow='autoplay; encrypted-media'
                                                    allowFullScreen
                                                    title='video'
                                            />
                            
                                        </div>
                                        {/* <h3 style={{marginTop:'10px'}} aria-hidden={true} >{video.snippet.title}</h3> */}
                                        <div className="video-title-div" dangerouslySetInnerHTML={{__html: video.snippet.title}} />
                                        <Row className="comment-wrapper" >
                                            <div className="col-1" style={{margin:0,padding:0}} >
                                            {props.influencerObj.profilePic ? <img src={props.influencerObj.profilePic} 
                                            
                                            className="creator-profile-pic" alt={props.influencerObj.username}/> :
                                            <Avatar color={Avatar.getRandomColor('sitebase', ['red', 'green', 'teal'])} className="creator-profile-pic" name={video.snippet.channelTitle
} />
                                            }
                                            
                                            </div>
                                            <div className="col-11" style={{paddingRight:0, margin: 'auto'}} >
                                            <div className="creator-name"><strong>{video.snippet.channelTitle}</strong><br /> <span style={{color:'gray', fontSize: '13px'}}>{' '} {video.snippet.channelTitle} fans</span></div>
                                           
                                            </div>
                                            <div className="desc-box">
                                                {video.snippet.description}
                                            </div> 
                                            {/* <p className="btn-show-more" onClick={()=>expandDiv(index)}>{showMore && divId === index ? 'Show less' : 'Show more'}</p>  */}
                                            <input className="acd-input" type="checkbox" id={`title${index}`} />
                                            {/* <div className="desc-box">
                                                {video.snippet.description}
                                            </div>  */}
                                            <label htmlFor={`title${index}`} className="acd-label">Show </label>

                                            <div class="content">
                                            <small>{video.snippet.description}</small>
                                            </div>
                                            
{/*                                             
                                            <Accordion  className="accordion-style">
                                                <Card>
                                                    <Card.Header className="card-header-acd">
                                                    <Accordion.Toggle as={Button}  eventKey={unique + index +1} variant="link" className="btn-acd" >
                                                        Show more<br />

                                                    </Accordion.Toggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey={unique + index +1} className="accordion-body-custom">
                                                    <Card.Body className="acccordion-text">
                                                    <small>{video.snippet.description}</small></Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                            </Accordion> */}

                                        </Row>
                                  
                                         {/* <Suspense fallback={<div class="loader">Loading...</div>}> */}
                                            <Comments videoId={id} />
                                        {/* </Suspense>  */}
                                        
                                    </Col>
                                    <Col sm={4} className="spec-col"  >
                                        <div className="spec-wrapper">
                                        <img alt={video.snippet.channelTitle} src={require(`../../assets/maker_logos/${titleCase}_Logo.png`).default} className="icon-s" />
                                        {' '}
                                        <span className="spec-text" ><strong >{video.carData.year}{' '}{titleCase}{' '}{model}</strong></span><br/>
                                        <img alt="price" src={priceIcon} className="icon-s" /><span className="spec-text" >{' '}${price && price}</span><br />
                                        <img alt="power " src={powerIcon} className="icon-s" /><span  className="spec-text">{' '}{video.carData.features.Engine.Torque}</span><br />
                                        <img alt="piston" key={pistonIcon} src={pistonIcon}  className="icon-s" /><span className="spec-text">{' '}{video.carData.features.Engine.Horsepower}</span><br />
                                        </div>
                                        <div className="ads-container-all">
                                            ads go here
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
       
        </div>
        </Layout>
    )
    }
    const mapDispatchToProps = (dispatch) =>{
        return{
            logInAsPublic: () => dispatch(logInAsPublic()),
            updateLogin: (credentials)=> dispatch(updateLogin(credentials)),
            getInfluencer: (id)=> dispatch(getInfluencer(id))
        }
    }
    const mapStateToProps = (state)=>{
        return{
            influencerObj: state.influ.influencerObj,
            formattedFans: state.influ.formattedFans
        }
    }

    export default connect(mapStateToProps, mapDispatchToProps )(AllVideos)
