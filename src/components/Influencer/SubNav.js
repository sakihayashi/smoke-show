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
    console.log('open', props.openModal)
    const [isFanOf, setIsFanOf] = useState(false)
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
      };
    const app = new Realm.App(appConfig);

    const influencer = props.influencer

    const renderTooltip = (props) => (
        <Tooltip  id="button-tooltip" {...props}>
        { console.log('what is in', props)}
          <p style={{marginBottom: 0}}>You will receive newsletters when the influencer publishes a new video.</p>
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
                    console.log('running?', decoded)
                    try{
                        await app.logIn(decoded.cre).then( async user =>{
                            const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                            const collectionUsers = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("users")
                
                            try{
                                await collectionUsers.updateOne(
                                    { "userId": user.id },
                                    { $push: { fansOf: {id: influencer.userId, username: influencer.username} } },
                                    { upsert: true }
                                ).then(res =>{
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
            props.customData.fansOf.map(user =>{
                if(user.id === influencer.userId){
                    console.log('id', user.id)
                    console.log('infle', influencer.userId)
                    setIsFanOf(true)
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
    }, [])

    return(
        <Fragment>
            <div className="banner-wrapper">
                <img src={influencer.profileCover} alt={props.influencer.username} className="influencer-banner"/>
            </div>
            <Row>
                <Col style={{paddingRight:0}}>
                <img src={influencer.profile_pic} className="bio-profile-pic" alt={`${influencer.username} profile picture`}/>
                </Col>
                <Col className="bio-text-wrapper" style={{paddingLeft: 0}}>
                {/* <img src={influencer.profile_pic} className="bio-profile-pic" /> */}
                    <div className="bio-creator-name">{influencer.username}</div>
                    <div className="bio-creator-data">{props.formattedFans} Fans</div>
                </Col>
                <Col sm={6} className="bio-sub-menu">
                    <nav className="bio-sub-nav">
                        <NavLink to={`/all-videos/${influencer.userId}`}>All Videos</NavLink>
                        <NavLink to={`/garage/${influencer.userId}`}>Garage</NavLink>
                        <NavLink to={`/social/${influencer.userId}`}>Social</NavLink>
                        <NavLink to={`/swagg-influencer/${influencer.userId}`}>swagg</NavLink>
                    </nav>
                </Col>
                <Col className="center-btn">
                {isFanOf ? <Button className="btn-fan" disabled="true">
                <img src={doneIcon} style={{width: '1rem'}} alt="you are already done this" />{' '}Fan of {influencer.username}</Button> :
                <Fragment>
                    <Button className="btn-fan" onClick={handleBecomeAFan}>Become a fan</Button><br/>
                    <OverlayTrigger
                        placement="left"
                        delay={{ show: 250, hide: 200 }}
                        overlay={renderTooltip}
                    >
                    
                    <small>What this means?</small>
                    </OverlayTrigger>
                    
                </Fragment>
                }
                {props.allowEdit && 
                        <Button className="garage-setting-btn" onClick={props.handleShowSetting} >
                            <img src={settingsIcon} alt="setting" className="setting-icon"/>
                            Settings
                        </Button>
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
        openModal: state.auth.openModal,
        customData: state.auth.customData
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubNav)