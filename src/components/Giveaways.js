import React from 'react'
import {Helmet} from "react-helmet"
import Layout from './Layout/Layout'
import { Row, Col, Card, Button } from 'react-bootstrap'
import './giveaways.scss'
import { giveAwaysArr } from './giveAwayData'
import {
    EmailShareButton,
    FacebookShareButton,
    TwitterShareButton,
  } from "react-share";
import short from 'short-uuid'
import {
FacebookShareCount
} from "react-share";

import facebookIcon from '../assets/global/Facebook-icon.svg'
import twitterIcon from '../assets/global/Twitter-icon.svg'
import emailIcon from '../assets/global/Messages-icon.svg'

const Giveaways = (props) =>{
    const sharePathname = props.location.pathname
    const shareUrl = `https://master.d2rltwsx300g54.amplifyapp.com${sharePathname}`
    return(
        <Layout>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Giveaways | The Smoke Show</title>
            <meta name="description" content="Checkout our giveaways and entry now to win!" />
            <meta name="robots" content="noindex, nofollow" />
            {/* <link rel="canonical" href="http://mysite.com/example" /> */}
        </Helmet>
            <div className="spacer-4rem"></div>
            <div className="main-wrapper" style={{minHeight: 'calc(100vh - 21rem)'}}>
            <h2 className="title">Giveaways</h2>
            <div className="notice-div">
            All active giveaways in the Car Community. <br/>
            Only VERIFIED and CONFIRMED entries from influencers will be found here.
            </div>
                <Row>
                { giveAwaysArr.map(data =>{
                    const unique = short.generate()
                    return(
                        <Col sm={6} key={unique}>
                            <Card className="givaways-card">
                                <Card.Img variant="top" src={data.imgUrl} />
                                    
                                <Card.Body>
                                    <Card.Title className="card-title">
                                    <div className="card-title-text">
                                        <div className="card-left"></div>
                                        <strong>{data.item}</strong>{' '} giveaway
                                    
                                    <div className="share-btn-wrapper">
                                        <TwitterShareButton
                                            url={shareUrl}
                                            quote={data.item}
                                            className="social-share-btn"
                                        >
                                            <img src={twitterIcon} alt="share via facebook" className="share-icon"/>
                                        </TwitterShareButton>

                                        <div className="link-counter">
                                            {/* <FacebookShareCount url={shareUrl} className="">
                                            {count => count}
                                            </FacebookShareCount> */}
                                        </div>
                                        <FacebookShareButton
                                            url={shareUrl}
                                            quote={data.item}
                                            className="social-share-btn"
                                        >
                                            <img src={facebookIcon} alt="share via facebook" className="share-icon"/>
                                        </FacebookShareButton>

                                        <div className="link-counter">
                                            <FacebookShareCount url={shareUrl} className="">
                                            {count => count}
                                            </FacebookShareCount>
                                        </div>
                                        <EmailShareButton
                                            url={shareUrl}
                                            quote={data.item}
                                            className="social-share-btn"
                                        >
                                            <img src={emailIcon} alt="share via email" className="share-icon"/>
                                        </EmailShareButton>
                                        <div className="link-counter">
                                            {/* <FacebookShareCount url={shareUrl} className="">
                                            {count => count}
                                            </FacebookShareCount> */}
                                        </div>
                                    </div>
                                    </div>
                                    <p>by {data.influencer} {' '} 
                                    <span className="card-mute-text">| {data.entries.length} {' '} entries</span></p>
                                    

                                    </Card.Title>
                                    <Card.Text>
                                    <p>
                                        <strong>How to enter:</strong><br/> {data.howTo}
                                    </p><br/>
                                    <p>
                                        <strong>Details:</strong> <br/>{data.details}
                                    </p>
                                    </Card.Text>
                                    <div className="counter-div">
                                        <div className="counter-wrapper">
                                            <div className="ends-in">Ends in:</div>
                                            <div className="counter-box">
                                                <span className="timer-num">10 </span>
                                                <span className="unit-div">days</span>
                                            </div>
                                            <div className="counter-box">
                                                <span className="timer-num">12</span>
                                                <span className="unit-div">hours</span>
                                            </div>
                                            <div className="counter-box">
                                                <span className="timer-num">21</span>
                                                <span className="unit-div">minutes</span>
                                            </div>
                                            <div className="counter-box">
                                                <span className="timer-num">13</span>
                                                <span className="unit-div">seconds</span>
                                            </div>
                                        </div>
                                    <div className="padding-btn">
                                        <Button className="login-btn ">Entry now</Button>
                                    </div>
                                    </div>
                                    
                                </Card.Body>
                            </Card>
                        </Col>
                        )
                })}
                    
                </Row>
            </div>

        </Layout>
    )
}

export default Giveaways