import React from 'react'
import { Col, Button, Card } from 'react-bootstrap'

const GiveawayCount = (props) =>{
    return(
        <Col sm={6}>
            <Card className="givaways-card">
                <Card.Img variant="top" src={props.imgUrl} />
                <Card.Body></Card.Body>
            </Card>
        </Col>
    )
}

export default GiveawayCount