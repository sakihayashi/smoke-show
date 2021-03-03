import React, { Fragment, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import Layout from '../Layout/Layout'
import { Helmet } from "react-helmet"
import SubNav from './SubNav'
import * as Realm from "realm-web"
import './social.scss'
import { getInfluencer }from '../../store/actions/influencerActions'
import instaIcon from '../../assets/social/instagram.svg'
import fbIcon from '../../assets/social/facebook.svg'
import twitterIcon from '../../assets/social/twitter.svg'
import tiktokIcon from '../../assets/social/TikTok.svg'
import amazonIcon from '../../assets/social/Amazon-Affiliate-program.jpg'
import { connect } from 'react-redux'
import jwt from 'jsonwebtoken'

const Social = (props) =>{
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
      };
    const app = new Realm.App(appConfig);
    const userIdParam = props.match.params.id
    const [influencer, setInfluencer] = useState({profileCover: '', profilePic: '', username: '', userId: '', social: {instagram: '', facebook: '', twitter: ''}})
    // const generateCode = () =>{
    //     const shortID = short.generate()
    //     console.log('id', shortID)
    // }
    // const getData = async () =>{
    //     const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
    //     const collectionInfluencer = mongo.db("smoke-show").collection("influencers")
    //     const filter = {userId: userIdParam}
    //     try{
    //         await collectionInfluencer.findOne(filter).then(user =>{
    //             setInfluencer(user)

    //         })
    //     }catch(err){ console.log(err) }
    // }
    const userLogin =async (cre) =>{
         try{
             await app.logIn(cre).then(user =>{
                 console.log('user logged in', user.id)
             })
         }catch(err){console.log(err)}
    }
    const loginCheck = () =>{
        const tokenUser = sessionStorage.getItem('session_user')
        if(tokenUser){
            jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, function(err, decoded) {
                if (err) {
                    // timeout
                    const cre = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    userLogin(cre)
                    
                }else{
                    userLogin(decoded.cre)
                }
              });
            
        }else{
            const cre = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
            userLogin(cre)
        }
    }
    useEffect(() => {
        if(props.influencerObj.username){
            setInfluencer(props.influencerObj)
        }
        
    }, [props.influencerObj])

    useEffect(() => {
        loginCheck()
        props.getInfluencer(userIdParam)
    }, [])
    return(
        <Fragment>
            <Helmet>
                <title>Influencer Social Media Links | The Smoke Show</title>
                <meta name="description" content="Place the meta description text here." />
            </Helmet>
            <Layout>
                <div className="main-wrapper">
                    <div className="spacer-4rem"></div>
                    <SubNav influencer={influencer} formattedFans={props.formattedFans}/>
                    <div className="spacer-4rem"></div>
                    <h2 className="title">{influencer.username} Social Media</h2>
                    <div className="spacer-4rem"></div>
                    <Row>
                        <Col sm={6}>
                            <ul style={{listStyle: 'none'}}>
                            {influencer.social.instagram  && 
                                <li className="social-media-container">
                                    <Link to={influencer.social.instagram}>
                                        <img className="social-img" src={instaIcon} alt="Instagram" />
                                        <p className="social-text">{influencer.social.instagram}</p>
                                    </Link>
                                </li>
                            }
                            
                            {influencer.social.facebook && 
                                <li className="social-media-container">
                                    <Link to={influencer.social.facebook}>
                                        <img className="social-img" src={fbIcon} alt="Instagram" />
                                        <p className="social-text">{influencer.social.facebook}</p>
                                    </Link>
                                </li>
                            }
                            {influencer.social.twitter && 
                                <li className="social-media-container">
                                    <Link to={influencer.social.twitter}>
                                        <img className="social-img" src={twitterIcon} alt="Instagram" />
                                        <p className="social-text">{influencer.social.twitter}</p>
                                    </Link>
                                </li>
                            }
                            {influencer.social.tiktok && 
                                <li className="social-media-container">
                                    <Link to={influencer.social.tiktok}>
                                        <img className="social-img" src={tiktokIcon} alt="Instagram" />
                                        <p className="social-text">{influencer.social.tiktok}</p>
                                    </Link>
                                </li>
                            }
                            </ul>
                        </Col>
                        <Col sm={6}>
                            <ul style={{listStyle: 'none'}}>
                            {influencer.social.amazon && 
                                <li className="social-media-container">
                                    <Link to={influencer.social.amazon}>
                                        <img className="social-img" src={amazonIcon} alt="Instagram" />
                                        <p className="social-text">{influencer.social.amazon}</p>
                                    </Link>
                                </li>
                            }
                            </ul>
                        </Col>
                    </Row>
                    
                </div>
            </Layout>
        </Fragment>
        
    )
}
const mapDispatchToProps = (dispatch) =>{
    return{
        getInfluencer: (id)=> dispatch(getInfluencer(id))
    }
}
const mapStateToProps = (state)=>{
    return{
        influencerObj: state.influ.influencerObj,
        formattedFans: state.influ.formattedFans
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Social)