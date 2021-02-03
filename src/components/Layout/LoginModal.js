import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import * as Realm from "realm-web"
import { authUser } from '../../store/actions/authActions'
import { connect } from 'react-redux'
import Logo from '../../assets/global/Logo-smoke-show.png'
import jwt from 'jsonwebtoken'
import { useUID } from 'react-uid'
import { v4 as uuidv4 } from 'uuid';


const LoginModal = (props) =>{
    
    const [userObj, setUserObj] = useState({fname: '', lname: '', email: '', password: ''})
    const [forgotPw, setForgotPw] = useState(false)
    const [resetPwSent, setResetPwSent] = useState(false)
    const uid = useUID()
    const appId = process.env.REACT_APP_REALM_APP_ID
    const appConfig = {
        id: appId,
        timeout: 10000, // timeout in number of milliseconds
      };
    const getApp = Realm.App.getApp(appId)
    //max age one day number of day, hours, min and sec
    const maxAge = 1 * 24 * 60 * 60
    const maxAgeTest = 1 * 60 * 60

    const createToken = (userData) =>{
        return jwt.sign({ userData: userData }, process.env.REACT_APP_JWT_SECRET, {expiresIn: maxAgeTest});
    }
    const handleResetPw = async (e) =>{
        e.preventDefault()
        const newPW = uuidv4()
        // Additional arguments for the reset function
        const args = ["something"];
        await getApp.emailPasswordAuth.callResetPasswordFunction(userObj.email, newPW, args).then(res =>{
            console.log('res', res)
            setResetPwSent(true)
        })
        
        // await getApp.emailPasswordAuth.sendResetPasswordEmail(userObj.email).then(res =>{
        //     console.log('res', res)
            
        // })
    }
    const closeWindow = () =>{
        setForgotPw(false)

    }
    const handleChange =(e) =>{
        setUserObj({
            ...userObj,
            [e.target.name]: e.target.value 
        })
    }
    let resetPassword
    if(resetPwSent){
        resetPassword =
        <div>
            <p class="login-form" style={{textAlign: 'center', marginBottom: '2rem'}}>We've sent you an email link to reset your password.<br/><br /> Please check your email inbox.</p><br/>
            <p >Please close this window.</p>
        </div>
        
    }else if(!resetPwSent){
        resetPassword =
        <Form className="login-form" onSubmit={handleResetPw}>
            <Form.Group >
                <Form.Label>Type your email address below.</Form.Label>
                <Form.Control type="email" placeholder="e.g. example@example.com" name="email" onChange={handleChange} />
            </Form.Group>
            <div style={{marginTop: '4rem'}}></div>
            <Button className="login-btn" type="submit">Reset Password</Button>
            <p className="click-div" style={{marginTop: '1rem'}} onClick={()=>setForgotPw(false)}>Go back to login</p>
            <div style={{marginTop:"4rem"}}></div>
        </Form>
    }else{
        resetPassword = ''
    }
    
    const handleSubmit = async (e) =>{
        e.preventDefault()
        const emailLowerCase = userObj.email.toLocaleLowerCase()
        const credentials = Realm.Credentials.emailPassword(emailLowerCase, userObj.password)

        try{
            // Authenticate the user
            await props.app.logIn(credentials).then(async user=>{
                    // const key = await user.apiKeys.create(uid)
                    const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
                    const mongoCollection = mongo.db("smoke-show").collection("users");
                    let token = ''
       
                    const queryFilter = { userId: user.id };
                    await mongoCollection.findOne(queryFilter).then(loginUserData =>{
                        loginUserData.login = userObj
                        token = createToken(loginUserData)
                        
                        localStorage.setItem('session_token', token)
                        const userData = {loginUserData: loginUserData, credentials: userObj}
                        props.handleuser(loginUserData.fname, loginUserData.userId)
                        props.authUser(userData)
                    })
                    
                    
                });
            
      
        }catch(error){
            console.log('error', error)

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
     
          </Modal.Header>
          <div className="login-logo-wrapper">
            <img src={Logo} alt="The Smoke Show" className="logo-header" />
          </div>
          <Modal.Body className="custom-modal-body">
         
            <div style={{marginBottom: '15px'}}></div>
            {forgotPw ? resetPassword :
            <Form className="login-form" onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="e.g. example@example.com" name="email" onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="" name="password" onChange={handleChange} />
                </Form.Group>
                <p className="click-div" onClick={()=>{setForgotPw(true)}}>Forgot password?</p>
                <div className="login-btn-wrapper">
                    <Button className="login-btn" type="submit">
                        Login
                    </Button><br /><br />
                    
                    <p className="click-div" onClick={props.toggleModal}>Or Signup here</p>
                </div>
                
            </Form>
        }
          </Modal.Body>
        </Modal>
      );
}

const mapStateToProps = (state) => {
    //syntax is propName: state.key of combineReducer.key
    return{
      userData: state.auth.userData,
    }
  }
const mapDispatchToProps = (dispatch) =>{
    return {
        authUser: (userObj) => dispatch(authUser(userObj))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginModal)