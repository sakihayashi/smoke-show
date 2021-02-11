import React, { Fragment, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import Layout from '../Layout/Layout'
import { Helmet } from "react-helmet"
import SubNav from './SubNav'
import * as Realm from "realm-web"
import './social.scss'

import instaIcon from '../../assets/social/instagram.svg'
import fbIcon from '../../assets/social/facebook.svg'
import twitterIcon from '../../assets/social/twitter.svg'
import tiktokIcon from '../../assets/social/TikTok.svg'
import amazonIcon from '../../assets/social/Amazon-Affiliate-program.jpg'

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
    const getData = async () =>{
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionInfluencer = mongo.db("smoke-show").collection("influencers")
        const filter = {userId: userIdParam}
        try{
            await collectionInfluencer.findOne(filter).then(user =>{
                setInfluencer(user)

            })
        }catch(err){ console.log(err) }
    }
    useEffect(() => {
        getData()
    })
    return(
        <Fragment>
            <Helmet>
                <title>Influencer Social Media Links | The Smoke Show</title>
                <meta name="description" content="Place the meta description text here." />
            <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <Layout>
                <div className="main-wrapper">
                    <div className="spacer-4rem"></div>
                    <SubNav influencer={influencer} />
                    <div className="spacer-4rem"></div>
                    <h2 className="title">{influencer.username} Social Media</h2>
                    <div className="spacer-4rem"></div>
                    <Row>
                        <Col sm={6}>
                            <ul style={{listStyle: 'none'}}>
                            {influencer.social.instagram && 
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

export default Social