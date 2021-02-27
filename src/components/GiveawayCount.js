import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Col, Button, Card, ProgressBar } from 'react-bootstrap'
import {
    EmailShareButton,
    FacebookShareButton,
    TwitterShareButton,
  } from "react-share";
  import jwt from 'jsonwebtoken'
import { FacebookShareCount } from "react-share";
import facebookIcon from '../assets/global/Facebook-icon.svg'
import twitterIcon from '../assets/global/Twitter-icon.svg'
import emailIcon from '../assets/global/Messages-icon.svg'
import carIcon from '../assets/global/car-icon-bar.svg'
import flagIcon from '../assets/global/chekered-flag.svg'
import * as Realm from "realm-web"
import { connect } from 'react-redux'
import { openLoginModal, attachMsg, swapToSignup } from '../store/actions/authActions'

const GiveawayCount = (props) =>{
    // console.log('props', props)
    // let percentBar = '60%'
    const [percentBar, setPercentBar] = useState('0%')
    const app = new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID })
    const [numOfUsers, setNumOfUsers] = useState(null)

    const getCount = async (credentials) =>{

        await app.logIn(credentials).then(async user =>{
            const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
            const collectionUsers = mongo.db("smoke-show").collection("users")
            try {
                await collectionUsers.count().then(res =>{
                    setNumOfUsers(res)
                    const result = res / 100000 * 100
                    setPercentBar(result.toFixed(1) + '%')
                })
            } catch (error) {
                console.log(error)
            }
        })
    }
    const handleSignup = () =>{
        props.swapToSignup(false)
    }

    const loginCheck = () =>{
        const tokenUser = sessionStorage.getItem('session_user')
        if(tokenUser){
           jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, (err, decoded)=>{
               if(err){
                   const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                   getCount(credentials)
               }else{
                getCount(decoded.cre)
               }
           });
           
        }else{
           const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                   getCount(credentials)
        }
    }

    useEffect(() => {
        loginCheck()
    }, [])
    
    return(
        <Col sm={6}>
            <Card className="givaways-card">
                <Card.Img variant="top" src={props.data.imgUrl} />
                <Card.Body>
                    <Card.Title className="card-title">
                        <div className="card-title-text">
                            <div className="card-left"></div>
                            <strong style={{marginRight: '1rem'}}>{props.data.item}</strong>{' '} giveaway
                        
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
                        

                        
                        <p>by {' '}
                        <Link to={`/user/${props.data.userId}`}>
                            {props.data.influencer} {' '} 
                        </Link>
                        <span className="card-mute-text">
                        | {numOfUsers && numOfUsers} {' '} entries</span></p>
                        
                    </Card.Title>
                    <Card.Text>
                        <span>
                            <strong>How to enter:</strong><br/> {props.data.howTo}
                        </span><br/><br/>
                        <span>
                            <strong>Details:</strong> <br/>{props.data.details}
                        </span>
                    </Card.Text>
                    <div className="counter-div">
                        <div className="padding-bar">
                        <div className="start">{percentBar && percentBar}</div>
                        <div className="car-wrapper">
                            <img src={carIcon} alt="car" className="car-icon" style={{left: `calc(${percentBar} - 41px)`}}/>
                            {/* <div className="dot-bar" style={{left: `calc(${percentBar} - 14px)`}}></div> */}
                            <div className="dot-bar" style={{left: '-13px'}}></div>
                        </div>
                        
                        <div className="progress-bar-wrapper">
                            
                            <div className="progress-bar-smoke" className="bar-smoke" style={{width: percentBar}}></div>
                            
                        </div>
                        <div className="flag-wrapper">
                            <img src={flagIcon} alt="check flag" className="flag-icon"/>
                        </div>
                        <div className="end">10,000 <br />users</div>
                
                        </div>
                        <div className="padding-btn" style={{marginTop: '-2rem'}}>
                        {props.isLoggedIn ? <Button className="login-btn" disabled>You are already in!</Button> : <Button className="login-btn" onClick={handleSignup}>Signup now to win!</Button>}
                            {/* <Button className="login-btn" onClick={handleSignup}>Signup now to win!</Button> */}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    )
}

const mapDispatchToProps = (dispatch)=>{
    return{
        openLoginModal: (state) => dispatch(openLoginModal(state)),
        attachMsg: (msg)=> dispatch(attachMsg(msg)),
        swapToSignup: (state) => dispatch(swapToSignup(state))
    }
}
const mapStateToProps = (state) => {
    //syntax is propName: state.key of combineReducer.key
    return{
        isLoggedIn: state.auth.isLoggedIn
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(GiveawayCount)