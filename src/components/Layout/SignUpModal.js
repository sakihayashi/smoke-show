import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import * as Realm from "realm-web"
import { createNewUser } from '../../store/actions/userActions'
import { connect } from 'react-redux'
import Logo from '../../assets/global/Logo-smoke-show.png'


const SignUpModal = (props) =>{
    const [userObj, setUserObj] = useState({fname: '', lname: '', email: '', password: '', password2: '', username: ''})
    const [msg, setMsg] = useState("")
    // const [isRegistered, setIsregistered] = useState(false)
    const [hasError, setHasError] = useState(false)
    //this is different from props.app -getApp
    const getApp = Realm.App.getApp("smoke-show-test-uasqg");
    
    // console.log('check from signin', props)
    const handleChange =(e) =>{
        setUserObj({
            ...userObj,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) =>{
        e.preventDefault()
        setHasError(false)
        if(userObj.password === userObj.password2){
            try{
                await getApp.emailPasswordAuth.registerUser(userObj.email, userObj.password).then(async res =>{
                    console.log('res', res)
                    const credentials = Realm.Credentials.emailPassword(userObj.email, userObj.password)
                    await props.app.logIn(credentials).then(async user =>{
                        console.log('what is user', user)
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
                setMsg("Something went wrong, try again.")
                setHasError(true)
            }
        }else{
            setMsg("Password and Confirm Password do not match. Try again.")
            setHasError(true)
        }
        
    }
    // const handleSubmitToDispatch = () =>{
    //     props.createNewUser(userObj)
    // }
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
          <Modal.Body className="custom-modal-body">
            <div className="login-logo-wrapper">
                <img src={Logo} alt="The Smoke Show" className="logo-header" />
            </div>
          
            <Form className="login-form" onSubmit ={handleSubmit}>
                <Form.Group >
                    <Form.Label>First name</Form.Label>
                    <Form.Control type="text" placeholder="e.g. John" name="fname" onChange={handleChange}/>
                </Form.Group>
                <Form.Group >
                    <Form.Label>Last name</Form.Label>
                    <Form.Control type="text" placeholder="e.g. Due" name="lname" onChange={handleChange}/>
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="e.g. example@example.com" name="email" onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="e.g. Smoke Show love" name="username" onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Between 6 and 128 characters long" name="password" onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="" name="password" onChange={handleChange} name="password2" />
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
          {/* <div className="spacer-4rem"></div> */}
          {/* <button onClick={handleSubmitToDispatch}>test</button> */}
        </Modal>
      );
}
const mapDispatchToProps = (dispatch) =>{
    return {
        createNewUser: (userObj) => dispatch(createNewUser(userObj))
    }
}

export default connect(null, mapDispatchToProps)(SignUpModal)

// export default SignUpModal