import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import * as Realm from "realm-web"
import { authUser } from '../../store/actions/authActions'
import { logInUser } from '../../store/actions/authActions'
import { connect } from 'react-redux'
import Logo from '../../assets/global/Logo-smoke-show.png'
import jwt from 'jsonwebtoken'
import { useUID } from 'react-uid'

const LoginModal = (props) =>{
    
    const [userObj, setUserObj] = useState({fname: '', lname: '', email: '', password: '', confirmPw: ''})
    const [hasError, setHasError] = useState(false)
    const [forgotPw, setForgotPw] = useState(false)
    const [resetPwSent, setResetPwSent] = useState(false)
    // const uid = useUID()
    const [loginMsg, setLoginMsg] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const appId = process.env.REACT_APP_REALM_APP_ID
    // const appConfig = {
    //     id: appId,
    //     timeout: 10000, // timeout in number of milliseconds
    //   };
    const getApp = Realm.App.getApp(appId)
    const app = new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID })

    //max age one day number of day, hours, min and sec
    // const maxAge = 1 * 24 * 60 * 60
    const maxAgeTest = 1 * 60 * 60

    const createToken = (userData) =>{
        return jwt.sign({ userData: userData }, process.env.REACT_APP_JWT_SECRET, {expiresIn: maxAgeTest});
    }
  
    const handleResetPw = async (e) =>{
        e.preventDefault()
        const lowerCase = userObj.email.toLowerCase()
        // const newPW = uuidv4()
        // Additional arguments for the reset function
        console.log('userobj', userObj)
        if(userObj.password === userObj.confirmPw){
            const args = [];
            try{
                await getApp.emailPasswordAuth.callResetPasswordFunction(lowerCase, userObj.password, args).then(res =>{
                    console.log('res', res)
                    setUserObj({fname: '', lname: '', email: '', password: '', confirmPw: ''})
                    setResetPwSent(true)
                })
            }catch(err){
                console.log(err)
            }
            
        }else{
            setErrMsg('the password and the confirm password do not match. Try again.')
        }
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
            <p className="login-form" style={{textAlign: 'center', marginBottom: '2rem'}}>We've sent you an email link to reset your password.<br/><br /> Please check your email inbox.</p><br/>
            <div className="text-center" ><Button className="comment-btn" onClick={props.onHide} style={{minWidth: '200px'}}>Close</Button></div>
            
        </div>
        
    }else if(!resetPwSent){
        resetPassword =
        <Form className="login-form" onSubmit={handleResetPw}>
            <Form.Group >
                <Form.Label>Type your email address below.</Form.Label>
                <Form.Control type="email" placeholder="e.g. example@example.com" name="email" onChange={handleChange} required/>
            </Form.Group>
            <div className="spacer-1rem"></div>
            <Form.Group >
                <Form.Label>Type your new password below.</Form.Label>
                <Form.Control type="password" placeholder="more than six characters" name="password" onChange={handleChange} required />
            </Form.Group>
            <div className="spacer-1rem"></div>
            <Form.Group >
                <Form.Label>Confirm your new password below.</Form.Label>
                <Form.Control type="password" placeholder="" name="confirmPw" onChange={handleChange} required />
            </Form.Group>
            <div className="spacer-1rem"></div>
            {errMsg && <Alert variant="danger" style={{padding: '5px', marginTop: '1rem', textAlign:'center'}}><small>{errMsg}</small></Alert>}
            <Button className="login-btn" type="submit">Reset Password</Button>
            <p className="click-div" style={{marginTop: '1rem'}} onClick={()=>setForgotPw(false)}>Go back to login</p>
            <div style={{marginTop:"4rem"}}></div>
        </Form>
    }else{
        resetPassword = ''
    }
    const handleSubmit =(e)=>{
        e.preventDefault()
        const emailLowerCase = userObj.email.toLowerCase()
        const credentials = Realm.Credentials.emailPassword(emailLowerCase, userObj.password)
        props.logInUser(credentials, emailLowerCase)
    }
    // const handleSubmit = async (e) =>{
    //     e.preventDefault()
    //     const emailLowerCase = userObj.email.toLocaleLowerCase()
    //     const credentials = Realm.Credentials.emailPassword(emailLowerCase, userObj.password)
    //     try{
    //         await props.app.logIn(credentials).then(async user=>{
    //             if(user.id === props.app.currentUser.id){
    //                 console.log('matched')
    //                 props.getUserId(user.id)
    //             }else{
    //                 console.log('not match')
    //             }
    //                 const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
    //                 const mongoCollection = mongo.db("smoke-show").collection("users");
    //                 let token = ''
    //                 const collectionInfluencer = mongo.db("smoke-show").collection("influencers");
       
    //                 const queryFilter = { userId: user.id };
    //                 await mongoCollection.findOne(queryFilter).then(async loginUserData =>{
    //                     if(!loginUserData){
    //                         await collectionInfluencer.findOne(queryFilter).then( influencer =>{
    //                             console.log('influencer', influencer)
    //                             influencer.login = userObj
    //                             token = createToken(influencer)
    //                             sessionStorage.setItem('session_token', token)
    //                             // const userData = {loginUserData: loginUserData, credentials: userObj}
    //                             props.handleuser(influencer.username, influencer.userId)
    //                         })
    //                     }else{
    //                         loginUserData.login = userObj
    //                         token = createToken(loginUserData)
                            
    //                         sessionStorage.setItem('session_token', token)
    //                         props.handleuser(loginUserData.fname, user.id)
    //                     }
                        
    //                 })
    //             });

    //     }catch(error){
    //         console.log('error', error)
    //         setHasError(true)
    //         setLoginMsg('Email and Password are incorrect')
    //     }
    // }

    useEffect(() => {
        if(props.hasLoginErr){
            setHasError(true)
        }else{
            setHasError(false)
        }
    }, [props.hasLoginErr])
    
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
                {hasError && <Alert variant="danger" style={{padding: '5px', marginTop: '1rem', textAlign:'center'}}><small>{loginMsg}</small></Alert> }
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
      )
}

const mapStateToProps = (state) => {
    //syntax is propName: state.key of combineReducer.key
    return{
      userData: state.auth.userData,
      hasLoginErr: state.auth.hasLoginErr
    }
  }
const mapDispatchToProps = (dispatch) =>{
    return {
        logInUser: (credentials, email) => dispatch(logInUser(credentials, email))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginModal)