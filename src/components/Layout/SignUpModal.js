import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import * as Realm from "realm-web"



const SignUpModal = (props) =>{
    const [userObj, setUserObj] = useState({fname: '', lname: '', email: '', password: '', password2: ''})
    const msg = "Something went wrong, try again."
    // const [isRegistered, setIsregistered] = useState(false)
    const [hasError, setHasError] = useState(false)
    //this is different from props.app -getApp
    const getApp = Realm.App.getApp("smoke-show-test-uasqg");
    

    const handleChange =(e) =>{
        setUserObj({
            ...userObj,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) =>{
        e.preventDefault()
        setHasError(false)
        try{
            await getApp.emailPasswordAuth.registerUser(userObj.email, userObj.password).then(async res =>{
                console.log('res', res)
               
                const credentials = Realm.Credentials.emailPassword(userObj.email, userObj.password)
             
                await props.app.logIn(credentials).then(async user =>{
                    const mongo = user.mongoClient("RealmClusterFreeTier");
                    const userData = {
                        userId: user.id,
                        fname: userObj.fname,
                        lname: userObj.lname
                    }
                    
                    const mongoCollection = mongo.db("smoke-show").collection("users");
                    const insertOneResult = await mongoCollection.insertOne(userData);
                    console.log('res', user)
                    console.log('result', insertOneResult)
                    if(insertOneResult.insertedId){
                        props.handleUser(userObj.fname)
                    }
                })
              
                // setIsregistered(true)
            })
            
        }catch(error){
            console.log('error', error)
            setHasError(true)
        }
        

    }
    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            {/* <Modal.Title id="contained-modal-title-vcenter">
              Modal heading
            </Modal.Title> */}
          </Modal.Header>
          <Modal.Body>
            <Form className="login-form" onSubmit ={handleSubmit}>
                <Form.Group >
                    <Form.Label>First name</Form.Label>
                    <Form.Control type="text" placeholder="Enter your first name" name="fname" onChange={handleChange}/>
                </Form.Group>
                <Form.Group >
                    <Form.Label>Last name</Form.Label>
                    <Form.Control type="text" placeholder="Enter your last name" name="lname" onChange={handleChange}/>
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" onChange={handleChange} />
                    <div className="note-text"> between 6 and 128 characters long</div>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" name="password" onChange={handleChange} name="password2" />
                </Form.Group>
                {hasError && <div className="error-msg">{msg}</div>}
                <div className="login-btn-wrapper">
                    <Button className="login-btn" type="submit">
                        Signup
                    </Button><br /><br />
                    <p className="click-div" onClick={ props.toggleModal}>Or Login here</p>
                </div>
                
            </Form>
          </Modal.Body>
          <div className="spacer-4rem"></div>
        </Modal>
      );
}

export default SignUpModal