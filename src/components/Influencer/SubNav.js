import React, { Fragment } from 'react'
import { Row, Col,  Button } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import settingsIcon from '../../assets/global/Settings-icon-white.svg'

const SubNav = (props) =>{
    // const influencer = props.influencer
    const influencer = props.influencer

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

export default SubNav