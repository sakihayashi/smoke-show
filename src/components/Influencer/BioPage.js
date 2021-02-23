import React, { useEffect, useState } from 'react'
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
    
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
      };
    const app = new Realm.App(appConfig);
    // const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
    const handleChangeKeyword = (e) =>{
        setSearchKeyword(e.target.value)
    }
    const handleVideoSearch = async e =>{
        e.preventDefault()
        await youtubeAPI.get('/search', {
            params: {
                q: searchKeyword,
                channelId: influencer.channelId
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
            })
            setSearchedCarData(datayoutube)
            console.log('use state check: ', searchedCarData)
            
        })
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
                            console.log(num)
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

    const checkToken = async () =>{
        const token = sessionStorage.getItem('session_user')
        if(token){
            jwt.verify(token, process.env.REACT_APP_JWT_SECRET, async( err, decoded) =>{
                if(err){
                    const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    await app.logIn(credentials).then( user =>{
                    const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                    return mongo
                }).then( mongo => getInfluencer(mongo))
                }else{
                    const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                    getInfluencer(mongo)
                }
            })
        }else{
            const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    await app.logIn(credentials).then( user =>{
                    const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                    return mongo
                }).then( mongo => getInfluencer(mongo))
        }
    }
      useEffect(() => {
        checkToken()
        
      }, [])
    // useEffect(() => {
        
    // }, [])
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
                {
                    carTempData.map((car, index) =>{
        
                        return <>
                        <Col sm={6} key={uid(car)}>
                        <Row>
                            <Col sm={7} >
                                <div className="videoWrapper">
                                    <iframe src={videoEmbedURL + car.videoId}
                                            frameBorder='0'
                                            allow='autoplay; encrypted-media'
                                            allowFullScreen
                                            title='video'
                                    
                                    />
                                </div>
                                <h3 style={{marginTop:'10px'}}>{car.youtube.snippet.title}</h3>
                                <Comments comments={commentsTempData[index]} videoId={car.videoId}/>
                            </Col>
                            <Col sm={5} className="bio-stats">
                                <div className="spec-wrapper">
                                <img alt={car.name} key={car.logoUrl} src={require(`../../assets/car-brand-logos/${car.logoUrl}`).default} className="icon-s" />{' '}<span className="spec-text"><strong>{car.name}</strong></span><br/>
                                <img alt="price" key={priceIcon} src={priceIcon} className="icon-s" /><span className="spec-text">{' '}${car.price}</span><br />
                                <img alt="power " key={powerIcon} src={powerIcon} className="icon-s" /><span className="spec-text">{' '}{car.engine}</span><br />
                                <img alt="piston" key={pistonIcon} src={pistonIcon} className="icon-s" /><span className="spec-text">{' '}{car.hoursepower}</span><br />
                                </div>
                                <div className="bio-ad-container">
                                    ads go here
                                </div>
                            </Col>
                        </Row>
                    </Col>
                        </>
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

