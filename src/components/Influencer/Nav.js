import React from 'react'

const Nav = () =>{
    return(
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
    )
}

export default Nav