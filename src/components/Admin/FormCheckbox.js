import React, { Fragment } from 'react'
import { Form, Col, Row } from 'react-bootstrap'

const FormCheckbox = (props) =>{
    return(
        <Fragment>
            <Form.Group as={Row} >
                <Form.Label column sm="4">
                {props.objKey}
                </Form.Label>
                <Col sm="8">
                <Form.Check 
                type="checkbox"
                name={props.objKey}
                label={`Check if True`}
                onChange={props.handleChange}
                inline
                />
                </Col>
            
            </Form.Group>
            <hr />
        </Fragment>
        
    )
}

export default FormCheckbox