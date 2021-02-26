import React, { useEffect } from 'react'
import { Col, Button, Card } from 'react-bootstrap'
import {
    EmailShareButton,
    FacebookShareButton,
    TwitterShareButton,
  } from "react-share";
import { FacebookShareCount } from "react-share";
import facebookIcon from '../assets/global/Facebook-icon.svg'
import twitterIcon from '../assets/global/Twitter-icon.svg'
import emailIcon from '../assets/global/Messages-icon.svg'

const GiveawayCount = (props) =>{
    console.log(props.data)
    const loginCheck = () =>{

    }
    useEffect(() => {
        
    }, [])
    return(
        <Col sm={6}>
            <Card className="givaways-card">
                <Card.Img variant="top" src={props.data.imgUrl} />
                <Card.Body>
                    <Card.Title className="card-title">
                        <div className="card-title-text">
                            <div className="card-left"></div>
                            <strong>{props.data.item}</strong>{' '} giveaway
                        
                        <div className="share-btn-wrapper">
                            <TwitterShareButton
                                url={props.shareUrl}
                                quote={props.data.item}
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
                                url={props.shareUrl}
                                quote={props.data.item}
                                className="social-share-btn"
                            >
                                <img src={facebookIcon} alt="share via facebook" className="share-icon"/>
                            </FacebookShareButton>

                            <div className="link-counter">
                                <FacebookShareCount url={props.shareUrl} className="">
                                {count => count}
                                </FacebookShareCount>
                            </div>
                            <EmailShareButton
                                url={props.shareUrl}
                                quote={props.data.item}
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
                        <p>by {props.data.influencer} {' '} 
                        <span className="card-mute-text">| {props.data.entries.length} {' '} entries</span></p>
                        
                    </Card.Title>
                    <Card.Text>
                        <p>
                            <strong>How to enter:</strong><br/> {props.data.howTo}
                        </p><br/>
                        <p>
                            <strong>Details:</strong> <br/>{props.data.details}
                        </p>
                    </Card.Text>
                    <div className="counter-div">
                        <div className="padding-bar">
                        <div className="start">0%</div>
                        <div className="progress-bar-wrapper">
                            
                            <div className="progress-bar" style={{width: '20%', heigh: '10px', background: 'gray'}}></div>
                            
                        </div>
                        <div className="end">100%</div>
                            {/* <div className="ends-in">Ends in:</div>
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
                            </div> */}
                        </div>
                        <div className="padding-btn">
                            <Button className="login-btn ">Entry now</Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default GiveawayCount