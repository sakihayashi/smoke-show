import React, { Fragment, useState } from 'react'
import { Row, Col,  Button, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import settingsIcon from '../../assets/global/Settings-icon-white.svg'
import './subnav.scss'
import * as Realm from "realm-web"
import jwt from 'jsonwebtoken'
import { becomeAFan } from '../../store/actions/userActions'
import { connect } from 'react-redux'

const SubNav = (props) =>{
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
          <p style={{marginBottom: 0}}>You will receive newsletters when the influencer publishes a new video.</p>
        </Tooltip>
      );

    const handleBecomeAFan = async ()=>{
        const token = sessionStorage.getItem('session_token')
        if(token){
            jwt.verify(token, process.env.REACT_APP_JWT_SECRET, async (err, decoded)=>{
                if(err){
                    console.log('open login modal', err)
                   
                    // open login modal 
                }else{
                    try{
                        await app.logIn(decoded.cre).then( async user =>{
                            const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                            const collectionUsers = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("users")
                
                            try{
                                await collectionUsers.updateOne(
                                    { "userId": user.id },
                                    { $push: { fansOf: influencer.userId } },
                                    { upsert: true }
                                ).then(res =>{
                                    console.log('become a fan of ', influencer.username)
                                    
                                })
                            }catch(err){console.log(err)}
                        })
                    }catch(err){
                        console.log(err)
                    }
                }
            });
        }
    }
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
                <Col sm={7} className="bio-sub-menu">
                    <nav className="bio-sub-nav">
                        <NavLink to={`/all-videos/${influencer.userId}`}>All Videos</NavLink>
                        <NavLink to={`/garage/${influencer.userId}`}>Garage</NavLink>
                        <NavLink to={`/social/${influencer.userId}`}>Social</NavLink>
                        <NavLink to={`/swagg-influencer/${influencer.userId}`}>swagg</NavLink>
                    </nav>
                </Col>
                <Col className="center-btn">
                <Button className="btn-fan">Become a fan</Button>
                <OverlayTrigger
                    placement="left"
                    delay={{ show: 250, hide: 200 }}
                    overlay={renderTooltip}
                >
                <small>What this means?</small>
                </OverlayTrigger>
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
        becomeAFan: (data) => dispatch(becomeAFan(data))
    }
}
const mapStateToProps = (state) =>{
    console.log(state)
    return{

    }
}

export default connect(mapStateToProps)(SubNav)