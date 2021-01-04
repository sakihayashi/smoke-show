import React from 'react'
import Layout from './Layout/Layout'
import { Row, Col, Card, Button } from 'react-bootstrap'
import './giveaways.scss'
import { giveAwaysArr } from './giveAwayData'

const Giveaways = () =>{

    return(
        <Layout>
            <div className="spacer-4rem"></div>
            <div className="main-wrapper" style={{minHeight: 'calc(100vh - 21rem)'}}>
            <h2 className="title">Giveaways</h2>
            <div className="notice-div">
            All active giveaways in the Car Community. <br/>
            Only VERIFIED and CONFIRMED entries from influencers will be found here.
            </div>
                <Row>
                { giveAwaysArr.map(data =>{
                    return(
                        <Col sm={6}>
                            <Card className="givaways-card">
                                <Card.Img variant="top" src={data.imgUrl} />
                                <Card.Body>
                                    <Card.Title><strong>{data.item}</strong> giveaway
                                    <p>by {data.influencer}</p>
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
                                            <div>Ends in:</div>
                                            <div className="counter-box">
                                            <span>10 </span>
                                            <span>days</span>
                                            </div>
                                            <div>13 hours</div>
                                            <div>13 mins</div>
                                            <div>13 sec</div>
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