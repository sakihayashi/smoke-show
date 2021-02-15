import React from 'react'
import { Form, Col, Row } from 'react-bootstrap'

const FormText = (props) =>{
    
    return(
        <Form.Group as={Row} >
            <Form.Label column sm="4">
            {props.objKey} test
            </Form.Label>
            <Col sm="8">
            <Form.Control type="text" placeholder="text" name={props.objKey} />
            </Col>
        </Form.Group>
    )
}

export default FormText