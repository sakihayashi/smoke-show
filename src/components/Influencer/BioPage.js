import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from "react-helmet"
import { Row, Col, Form, FormControl } from 'react-bootstrap'
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

import powerIcon from '../../assets/global/Horsepower.png'
import pistonIcon from '../../assets/global/piston.png'
import priceIcon from '../../assets/global/Price-Tag-icon.png'
import InfluencerIndexPage from '../InfluencerIndexPage'

const BioPage = (props) =>{
    const influencerId = props.match.params.id
    const [influencer, setInfluencer] = useState({userId: '', fname: '', lname: '', username: '', fans: null, desc: '', channelId: '', banner_img: '', profile_pic: '', featuredVideo: {id: '', title: ''}})
    // const { banner_img, username, profile_pic, fans } = props.location.state.influencer
    const [formattedFans, setFormattedFans] = useState('')
    
    const { params: { id } } = props.match
    const videoEmbedURL = 'https://www.youtube.com/embed/'
    // const EddieXChannelId = 'UCdOXRB936PKSwx0J7SgF6SQ'
    const [searchKeyword, setSearchKeyword] = useState('')
    const [titleStr, setTitleStr] = useState('Your search result')
    const [searchedCarData, setSearchedCarData] = useState([])
    
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        timeout: 10000, // timeout in number of milliseconds
      };
    const app = new Realm.App(appConfig);
    const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
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
    const getInfluencer = async () =>{

        try {
 
            const mongoCollection = mongo.db("smoke-show").collection("influencers");
            const filter = {userId: influencerId} 
            await mongoCollection.findOne(filter).then(res =>{
                console.log('res', res)
                setInfluencer(res)
                if(res.fans > 999){
                    setFormattedFans(Math.sign(res.fans)*((Math.abs(res.fans)/1000).toFixed(1)) + 'k')
                }else{
                    setFormattedFans(Math.sign(res.fans)*Math.abs(res.fans))
                }
            })
           
        //   }
        //   )
         }catch(error){console.log(error)}
    }
    useEffect( async () => {
        // const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
        try {
        //   const app = new Realm.App(appConfig);
      
          // an authenticated user is required to access a MongoDB instance
        //   await app.logIn(credentials).then( async user =>{
        //     const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
            const mongoCollection = mongo.db("smoke-show").collection("comments");
            const filter = {videoId: 'QHLojVxs'} 
            await mongoCollection.find(filter).then(resAll =>{
            })
           
        //   }
        //   )
         }catch(error){console.log(error)}
      })
      useEffect(() => {
        getInfluencer()
      }, [])
    return(
        <Layout>
            <Helmet>
                <title>Influencer {`${influencer.username}`} Bio | The Smoke Show</title>
            </Helmet>
            <div className="main-wrapper">
                <div className="banner-wrapper">
                    <img src={influencer.banner_img} alt={influencer.username} className="influencer-banner"/>
                </div>
                <Row>
                    <Col style={{paddingRight:0}}>
                    <img src={influencer.profile_pic} className="bio-profile-pic" />
                    </Col>
                    <Col className="bio-text-wrapper" style={{paddingLeft: 0}}>
                        <div className="bio-creator-name">{influencer.username}</div>
                        <div className="bio-creator-data">{formattedFans} Fans</div>
                    </Col>
                    <Col sm={9} className="bio-sub-menu">
                        <ul className="">
                            <Link to={`/all-videos/${influencerId}`}><li>All Videos</li></Link>
                            <Link href="/garage/:id"><li>Garage</li></Link>
                            <Link href="/social/:id"><li>Social</li></Link>
                            <Link href="/influencer-swagg/:id"><li>Swagg</li></Link>
                        </ul>
                    </Col>
                </Row>
                <div className="spacer-2rem"></div>
                <Row>
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
                <Row style={{paddingLeft:'-7px', paddingRight:'-7px'}}>
                {
                    carTempData.map((car, index) =>{
        
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
                                {/* <Row className="comment-wrapper">
                                    <Col sm={1} style={{margin:0,padding:0}}>
                                    {car.profile_pic ? <img src={car.profile_pic} className="creator-profile-pic" /> :
                                    <Avatar color={Avatar.getRandomColor('sitebase', ['red', 'green', 'teal'])} className="creator-profile-pic" name={car.creator} />
                                    }
                                        
                                    </Col>
                                    <Col sm={11} style={{margin: 0, paddingRight:0, margin: 'auto'}}>
                                    <div className="creator-name"><strong>{car.creator}</strong><br /> <span style={{color:'gray', fontSize: '13px'}}>{' '} {car.fans} fans</span></div>

                                    </Col>
                                </Row> */}
                    
                                <Comments comments={commentsTempData[index]} videoId={car.videoId}/>
                            </Col>
                            <Col sm={4} className="bio-stats">
                                <div className="spec-wrapper">
                                <img alt={car.name} key={car.logoUrl} src={require(`../../assets/car-brand-logos/${car.logoUrl}`).default} className="icon-s" />{' '}<span className="spec-text"><strong>{car.name}</strong></span><br/>
                                <img alt="price" key={priceIcon} src={priceIcon} className="icon-s" /><span className="spec-text">{' '}${car.price}</span><br />
                                <img alt="power " key={powerIcon} src={powerIcon} className="icon-s" /><span className="spec-text">{' '}{car.engine}</span><br />
                                <img alt="piston" key={pistonIcon} src={pistonIcon} className="icon-s" /><span className="spec-text">{' '}{car.hoursepower}</span><br />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                        </>
                    })
                }
            </Row>
            <div className="spacer-4rem"></div>
            <div className="title title-adj">
                <h2 style={{marginBottom: '-1rem'}}>{titleStr}</h2>
                <Form inline onSubmit={handleVideoSearch} style={{marginRight: '-8px'}}>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2 form-adj" onChange={handleChangeKeyword}/>
                </Form>
                </div>
                <Row style={{paddingLeft:'-7px', paddingRight:'-7px'}}>
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
                                {/* <img alt={car.name} key={car.logoUrl} src={require(`../assets/car-brand-logos/${car.logoUrl}`).default} className="icon-s" />{' '}<span className="spec-text"><strong>{car.name}</strong></span><br/>
                                <img alt="price" key={priceIcon} src={priceIcon} className="icon-s" /><span className="spec-text">{' '}${car.price}</span><br />
                                <img alt="power " key={powerIcon} src={powerIcon} className="icon-s" /><span className="spec-text">{' '}{car.engine}</span><br />
                                <img alt="piston" key={pistonIcon} src={pistonIcon} className="icon-s" /><span className="spec-text">{' '}{car.hoursepower}</span><br /> */}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                        </>
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

export default connect(mapStateToProps)(BioPage)

