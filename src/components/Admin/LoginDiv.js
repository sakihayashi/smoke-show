import React from 'react'
import { Container, Form, Button } from 'react-bootstrap'

const LoginDiv = (props) =>{
    return(
        <Container style={{alignItems: 'center', justifyContent: 'center', marginTop: '5rem'}}>
            <Form onSubmit={props.handleSubmitLogin}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" onChange={props.handleChange}/>
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
    
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={props.handleChange} name="password" />
                </Form.Group>
                <br />
                <Button variant="primary" type="submit">
                    Log in
                </Button>
            </Form>
        </Container>
    )
}

export default LoginDiv