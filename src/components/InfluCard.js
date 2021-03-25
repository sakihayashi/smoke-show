import React from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import short from 'short-uuid'
import ReactPlayer from 'react-player/lazy'
import { Link } from 'react-router-dom'

const InfluCard = (props) =>{
    const { unique, influencer, replaced } = props
    const videoWatchURL = 'https://www.youtube.com/watch?v='

    return(
        <Col sm={6} md={4} key={unique} className="bottom-space">
                            <Card className="card-influencer" >
                                <div className="videoWrapper">
                                        {/* <iframe src={videoEmbedURL + influencer.featuredVideo.id}
                                                frameBorder='0'
                                                allow='autoplay; encrypted-media'
                                                allowFullScreen
                                                title='video'
                                        /> */}
                                    <ReactPlayer
                                    width="560" 
                                    height="315"
                                    url={videoWatchURL + influencer.featuredVideo.id}
                                    controls={true}
                                    />
                                </div>
                                <Card.Body>
                                    <Card.Title>{influencer.username}</Card.Title>
                                    <Card.Text className="influencer-desc">{influencer.desc}</Card.Text>
                                    <Link 
                                    to={{
                                        pathname: `/influencer/${replaced}`,
                                        state: { influencer: influencer }
                                    }}
                                    // activeStyle={{
                                    //     color: "gray"
                                    // }}
                                    >
                                        <Button className="login-btn">See {influencer.username}'s Bio</Button>
                                    </Link>
                                    
                                </Card.Body>
                            </Card>
                        </Col>
    )
}

export default InfluCard