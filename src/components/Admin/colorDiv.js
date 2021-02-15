import React, { Fragment } from 'react'
import { Form, Row, Col } from 'react-bootstrap'

const ColorDiv = (props) =>{
    return(
        <Fragment>
            <Form.Group as={Row} >
                <Form.Label column sm="4">
                Color EXTERIOR {props.num}: name
                </Form.Label>
                <Col sm="8">
                <Form.Control type="text" placeholder="Name" name="name" onChange={(e)=>props.changeColorExterior(e, props.num)} />
                </Col>
            </Form.Group>
            <Form.Group as={Row} >
                <Form.Label column sm="4">
                Color EXTERIOR {props.num}: RGB
                </Form.Label>
                <Col sm="8">
                <Form.Control type="text" pattern="\d*" placeholder="111,111,111" name="rgb" onChange={(e)=>props.changeColorExterior(e, props.num)}  />
                </Col>
            </Form.Group>
        </Fragment>
    )
}

export default ColorDiv