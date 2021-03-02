import React from 'react'
import { Container, Form, Button, Alert } from 'react-bootstrap'

const AdminLoginDiv = (props) =>{
    const { handleSubmitLogin, handleChange, msg } = props
    return(
        
        <Container style={{alignItems: 'center', justifyContent: 'center', marginTop: '5rem'}}>
            <Form onSubmit={handleSubmitLogin}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleChange}/>
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
    
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={handleChange} name="password" />
                </Form.Group>
                <br />
                {msg && <Alert variant="danger">{msg}</Alert>
                }
                
                <Button variant="primary" type="submit">
                    Log in
                </Button>
            </Form>
        </Container>
    )
}

export default AdminLoginDiv