import React from 'react'
import { Form, Col, Row } from 'react-bootstrap'

const FormText = (props) =>{
    return(
        <Form.Group as={Row} >
            <Form.Label column sm="4">
            {props.objKey}
            </Form.Label>
            <Col sm="8">
            <Form.Control type="text" placeholder="text" name={props.objKey} onChange={props.handleChange}/>
            </Col>
        </Form.Group>
    )
}

export default FormText