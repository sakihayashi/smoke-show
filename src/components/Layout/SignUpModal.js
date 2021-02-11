import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import * as Realm from "realm-web"
import { createNewUser } from '../../store/actions/userActions'
import { connect } from 'react-redux'
import Logo from '../../assets/global/Logo-smoke-show.png'


const SignUpModal = (props) =>{
    const [userObj, setUserObj] = useState({fname: '', lname: '', email: '', password: '', password2: '', username: ''})
    const [msg, setMsg] = useState("")
    const [emailSent, setEmailSent] = useState(false)
    const [hasError, setHasError] = useState(false)
    //this is different from props.app -getApp
    const appId = process.env.REACT_APP_REALM_APP_ID
    const getApp = Realm.App.getApp(appId);
    
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
        const email = userObj.email.toLowerCase()
        if(userObj.password === userObj.password2){
            try{
                await getApp.emailPasswordAuth.registerUser(email, userObj.password).then(async res =>{
                    console.log('res token?', res)
                  
                    setEmailSent(true)
                    e.target.reset()
                    
                })
       
                
            }catch(error){
                console.log('error', error)
                setMsg("This email address is already registered.")
                setHasError(true)
            }
        }else{
            setMsg("Your Email or Password do not match our records. Try again.")
            setHasError(true)
        }
        
    }
    const resendConfirmationEmail = async (email)=>{
        const credentials = Realm.Credentials.anonymous();
        await applicationCache.logIn(credentials).then(user =>{
            const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
            // const mongoCollection = mongo.db("smoke-show").collection("commeusernts");
            // const filter = {email: email} 
            // mongoCollection.find(filter).then(pendingUser =>{
            //     const token = pendingUser.token
            //     const tokenId = pendingUser.tokenId
            // })
        })
        console.log('under construction')
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
          {emailSent ? 
          <center>
              <h3>Thank you for your registration. <br /><br />
              Please check your email and click to confirm. <br /><br />
              Please check your spam box if you do not find the confirmation email.
              </h3>
              <div className="spacer-4rem"></div>
          </center>
          :
          <Modal.Body className="custom-modal-body">
            <div className="login-logo-wrapper">
                <img src={Logo} alt="The Smoke Show" className="logo-header" />
            </div>
          
            <Form className="login-form" onSubmit={handleSubmit}>
             
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="e.g. example@example.com" name="email" onChange={handleChange} />
                </Form.Group>
                <div className="spacer-1rem"></div>
                {/* <Form.Group controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="e.g. Smoke Show love" name="username" onChange={handleChange} />
                </Form.Group> */}
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Between 6 and 128 characters long" name="password" onChange={handleChange} />
                </Form.Group>
                <div className="spacer-1rem"></div>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="" name="password" onChange={handleChange} name="password2" />
                </Form.Group>
                {hasError && 
                <div>
                    <div className="error-msg">{msg}</div>
                    <p onClick={resendConfirmationEmail}>Click here to resend the confirmation email</p>
                </div>}
                <div className="spacer-2rem"></div>
                <div className="login-btn-wrapper">
                    <Button className="login-btn" type="submit">
                        Signup
                    </Button><br /><br />
                    <p className="click-div" onClick={ props.toggleModal}>Or Login here</p>
                </div>
                
            </Form>
          </Modal.Body>

        }
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