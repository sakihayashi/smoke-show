import React, { useEffect, useState, Fragment, Suspense } from 'react'
import {Helmet} from "react-helmet"
import { Row, Col } from 'react-bootstrap'
import * as Realm from "realm-web"
// import Comments from './Comments'
import Avatar from 'react-avatar'
import { v4 as uuidv4 } from 'uuid';
import powerIcon from '../../assets/global/Horsepower.png'
import pistonIcon from '../../assets/global/piston.png'
import priceIcon from '../../assets/global/Price-Tag-icon.png'
import Layout from '../Layout/Layout'
import { logInAsPublic, updateLogin } from '../../store/actions/authActions'
import { connect } from 'react-redux'
import jwt from 'jsonwebtoken'
import noImg from '../../assets/global/no_image.jpg'
import { getInfluencer }from '../../store/actions/influencerActions'
import influencerReducer from '../../store/reducers/influencerReducer'
import SubNav from './SubNav'

const AllVideos = (props) =>{
    const influencerId = props.match.params.id
    const videoEmbedURL = 'https://www.youtube.com/embed/'
    const [videoArr, setVideoArr] = useState([])

    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
        };
    const app = new Realm.App(appConfig);


    const getVideos = async (credentials) =>{
        setVideoArr([])
        try{
            await app.logIn(credentials).then(async  user =>{
                if(app.currentUser.id === user.id){
                    console.log('user login updated')
                }
                props.getInfluencer(influencerReducer)
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const mongoCollection = mongo.db("smoke-show").collection("youtube-videos")
                const collectionCars = mongo.db("smoke-show").collection("cars")
                const filter = {userId: influencerId}
                await mongoCollection.find(filter, {limit: 4}).then(async videos =>{
                    videos.map(async video =>{

                        const filterCar = {_id: {"$oid": video.carDataId}}
                        
                        try{
                            await collectionCars.findOne(filterCar).then(data =>{
                               
                                video.carData = data
                                setVideoArr(videoArr =>[...videoArr, video])
                            })
                        }catch(err){
                            console.log(err)
                        }
                        
                    })

                }).then(res =>{
                    
                })
                
            })
        }catch(err){

        }
    }
    const loginCheck = async () =>{
        const tokenUser = sessionStorage.getItem('session_user')
        if(tokenUser){
            jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, function(err, decoded) {
                if (err) {
                    // timeout
                    const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    getVideos(credentials)
                }else{
                   
                    getVideos(decoded.cre)
                }
              });
            
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
                <title>All Videos from  | The Smoke Show</title>
                <meta name="description" content="Place the meta description text here." />
                <meta name="robots" content="noindex, nofollow" />
                {/* <link rel="canonical" href="http://mysite.com/example" /> */}
            </Helmet>
            {console.log('arr?', videoArr)}
            <div className="main-wrapper">
            <SubNav influencer={props.influencerObj} formattedFans={props.formattedFans} />
            <div className="spacer-4rem"></div>
            <h2 className="title">All Videos from {props.influencerObj.username}</h2>
            <Row style={{paddingLeft:'-7px', paddingRight:'-7px'}}>
            {
                videoArr.map((video, index) =>{
                    const name = video.carData.make
                    const titleCase = name.charAt(0).toUpperCase() +name.slice(1); 
                    {/* console.log(titleCase) */}
                    const uuid = uuidv4()
                    return(
                        <Fragment key={uuid}>
                            <Col sm={6} className="main-col" >
                                <Row >
                                    <Col sm={8} >
                                        <div className="videoWrapper">
                                            <iframe src={videoEmbedURL + video.videoId}
                                                    frameBorder='0'
                                                    allow='autoplay; encrypted-media'
                                                    allowFullScreen
                                                    title='video'
                                            />
                            
                                        </div>
                                        <h3 style={{marginTop:'10px'}} >{video.snippet.title}</h3>
                                        
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
                                            <small>{video.snippet.description}</small>
                                        </Row>
                                        {/* <Suspense fallback={<div class="loader">Loading...</div>}>
                                            <Comments comments={commentsTempData[index]} videoId={car.videoId} />
                                        </Suspense> */}
                                        
                                    </Col>
                                    <Col sm={4} className="spec-col"  >
                                        <div className="spec-wrapper">
                                        <img alt={video.snippet.channelTitle} src={require(`../../assets/maker_logos/${titleCase}_Logo.png`).default} className="icon-s" />
                                        {' '}
                                        <span className="spec-text" ><strong >{video.carData.name}</strong></span><br/>
                                        <img alt="price" src={priceIcon} className="icon-s" /><span className="spec-text" >{' '}${video.carData.price.baseMSRP}</span><br />
                                        <img alt="power " src={powerIcon} className="icon-s" /><span  className="spec-text">{' '}{video.carData.features.Engine.Torque}</span><br />
                                        <img alt="piston" key={pistonIcon} src={pistonIcon}  className="icon-s" /><span className="spec-text">{' '}{video.carData.features.Engine.Horsepower}</span><br />
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
