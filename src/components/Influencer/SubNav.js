import React, { Fragment, useState, useEffect } from 'react'
import { Row, Col,  Button, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import settingsIcon from '../../assets/global/Settings-icon-white.svg'
import './subnav.scss'
import * as Realm from "realm-web"
import jwt from 'jsonwebtoken'
import { becomeAFan } from '../../store/actions/userActions'
import { openLoginModal } from '../../store/actions/authActions'
import { connect } from 'react-redux'
import doneIcon from '../../assets/global/done-white.svg'

const SubNav = (props) =>{
    const [isFanOf, setIsFanOf] = useState(false)
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
      };
    const app = new Realm.App(appConfig);
    console.log('influ', props.influencer)
    const influencer = props.influencer

    const renderTooltip = (props) => (
        <Tooltip  id="button-tooltip" {...props} key="button-tooltip-key">
          <p style={{marginBottom: 0}}>You will receive notifications when the influencer publishes a video or updates their bio.</p>
        </Tooltip>
      );

    const handleBecomeAFan = async ()=>{
        const token = sessionStorage.getItem('session_user')
        if(token){
            jwt.verify(token, process.env.REACT_APP_JWT_SECRET, async (err, decoded)=>{
                if(err){
                    console.log('open login modal', err)
                    props.openLoginModal(true)
                    // open login modal 
                }else{
                    try{
                        await app.logIn(decoded.cre).then( async user =>{
                            const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                            const collectionUsers = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("users")
                            const collectionFans = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection(`fans-${influencer.username}`)
                
                            try{
                                await collectionUsers.updateOne(
                                    { "userId": user.id },
                                    { $push: { fansOf: {id: influencer.userId, username: influencer.username} } },
                                    { upsert: true }
                                ).then(async res =>{
                                    const fanData = {userId: user.id, date: new Date().getTime(), username: props.customData.username}
                                    try{
                                        await collectionFans.insertOne(fanData).then(res =>{
                                            console.log(res)

                                        })
                                    }catch(err){
                                        console.log(err)
                                    }
                                    console.log('become a fan of ', influencer.username)
                                    setIsFanOf(true)
                                    
                                })
                            }catch(err){console.log(err)}
                        })
                    }catch(err){
                        console.log(err)
                    }
                }
            });
        }else{
            console.log('this working')
            props.openLoginModal(true)
        }
    }
    const checkFanOf = () =>{
        if(props.customData.fansOf){
            props.customData.fansOf.map(fan =>{
                if(fan.id === influencer.userId){
                    setIsFanOf(true)
                    return
                }
            })
        }else{
            setIsFanOf(false)
        }
    }
    useEffect(() => {
        console.log('fired?')
        checkFanOf()
    }, [props.customData.fansOf])

    useEffect(() => {
        checkFanOf()
    }, [influencer.userId])

    return(
        <Fragment>
            <div className="banner-wrapper">
                <img src={influencer.profileCover} alt={props.influencer.username} className="influencer-banner"/>
            </div>
            <Row>
                <Col style={{paddingRight:0}}>
                <img src={influencer.profilePic} className="bio-profile-pic" alt={`${influencer.username} profile picture`}/>
                </Col>
                <Col className="bio-text-wrapper" style={{paddingLeft: 0}}>
                {/* <img src={influencer.profile_pic} className="bio-profile-pic" /> */}
                    <div className="bio-creator-name">{influencer.username}</div>
                    <div className="bio-creator-data">{props.formattedFans} Fans</div>
                </Col>
                <Col sm={7} className="bio-sub-menu">
                    <nav className="bio-sub-nav">
                    <NavLink key={`${influencer.userId}-nav-1`} to={`/influencer/${influencer.userId}`}>Featured</NavLink>
                    <NavLink key={`${influencer.userId}-nav-2`} to={`/all-videos/${influencer.userId}`}>All Videos</NavLink>
                    <NavLink key={`${influencer.userId}-nav-3`} to={`/garage/${influencer.userId}`}>Garage</NavLink>
                    <NavLink key={`${influencer.userId}-nav-4`} to={`/social/${influencer.userId}`}>Social</NavLink>
                    <NavLink key={`${influencer.userId}-nav-5`} to={`/swagg-influencer/${influencer.userId}`}>swagg</NavLink>
                    </nav>
                </Col>
                <Col className="center-btn" sm={2}>
                
                {props.allowEdit ?
                        <Button className="garage-setting-btn" onClick={props.handleShowSetting} >
                            <img src={settingsIcon} alt="setting" className="setting-icon"/>
                            Settings
                        </Button>
                :
                    [isFanOf ? <Button className="btn-fan" disabled>
                    <img src={doneIcon} style={{width: '1rem'}} alt="you are already done this" />{' '}Fan of {influencer.username}</Button> :
                    <Fragment>
                        <Button className="btn-fan" onClick={handleBecomeAFan}>Become a fan</Button><br/>
                        <OverlayTrigger
                            placement="left"
                            delay={{ show: 250, hide: 200 }}
                            overlay={renderTooltip}
                        >
                            <small className="tooltip-btn">What this means?</small>
                        </OverlayTrigger>
                        
                    </Fragment>
                    ]
                }
                </Col>
            </Row>
        </Fragment>
    )
}

const mapDispatchToProps = (dispatch) =>{
    return{
        becomeAFan: (data) => dispatch(becomeAFan(data)),
        openLoginModal: (state) =>dispatch(openLoginModal(state))
    }
}
const mapStateToProps = (state) =>{
    return{
        openmodal: state.auth.openmodal,
        customData: state.auth.customData
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubNav)