import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import * as Realm from "realm-web"
import { connect } from 'react-redux'
import Logo from '../../assets/global/Logo-smoke-show.png'
import { openLoginModal, clearSinupStr } from '../../store/actions/authActions'
import axios from 'axios'

const SignUpModal = (props) =>{
    const [userObj, setUserObj] = useState({fname: '', lname: '', email: '', password: '', password2: '', username: ''})
    const [msg, setMsg] = useState("")
    const [emailSent, setEmailSent] = useState(false)
    const [hasError, setHasError] = useState(false)
    //this is different from props.app -getApp
    const appId = process.env.REACT_APP_REALM_APP_ID
    const getApp = Realm.App.getApp(appId);
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        props.openLoginModal(false)
    }
    // const handleShow = () =>{
    //     setShow(true)
    // }
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
    const switchLogin = () =>{
        props.clearSinupStr()
        props.switchToLogin()
    }
    const resendConfirmationEmail = async (email)=>{
        
        try{
            axios.post(`https://stitch.mongodb.com/api/client/v2.0/app/${process.env.REACT_APP_REALM_APP_ID}/auth/providers/local-userpass/confirm/call`, { email }).then(res => {
                setMsg('We have sent you a confirmation email. Please check your inbox.')
            })
         
        }catch(err){
            console.log(err)
            setMsg('The email address you typed is not in our record. Please check your email address.')
        }
    }
   
    useEffect(() => {
        setShow(props.openmodal)
    }, [props.openmodal])
    
    return (
        <Modal
          {...props}
          show={show}
          onHide={handleClose}
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
                    <Form.Control 
                    type="password" 
                    placeholder="Between 6 and 128 characters long" name="password" 
                    onChange={handleChange} />
                </Form.Group>
                <div className="spacer-1rem"></div>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control 
                    type="password" 
                    placeholder=""  
                    onChange={handleChange} name="password2" />
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
                    <p className="click-div" onClick={switchLogin}>Or Login here</p>
                </div>
                
            </Form>
          </Modal.Body>

        }
        </Modal>
      );
}
const mapDispatchToProps = (dispatch) =>{
    return {
        openLoginModal: (state) => dispatch(openLoginModal(state)),
        clearSinupStr: () => dispatch(clearSinupStr())
    }
}
const mapStateToProps = (state) =>{
    return{
        openmodal: state.auth.openmodal
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SignUpModal)

// export default SignUpModal