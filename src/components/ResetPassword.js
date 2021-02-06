import React, { useState, useEffect, useRef } from 'react'
import { Button, Form } from 'react-bootstrap'
// import Logo from '../assets/global/Logo-smoke-show.png'
import * as Realm from "realm-web"
import { connect } from 'react-redux'
import jwt from 'jsonwebtoken'
import Layout from './Layout/Layout'

const ResetPassword = (props) =>{
    const childRef = useRef()
    const token = new URLSearchParams(props.location.search).get("token")
    const tokenId = new URLSearchParams(props.location.search).get("tokenId")
    const [userObj, setUserObj] = useState({token: token, tokenId: tokenId, email: '', password: '', password2: ''})
    const [hasError, setHasError] = useState(false)
    const [hasReset, setHasReset] = useState(false)
    const [msg, setMsg] = useState("")
    const maxAgeTest = 1 * 60 * 60
    const id = process.env.REACT_APP_REALM_APP_ID
    const config = { id };
    const app = new Realm.App(config);


    const handleChange =(e) =>{
        setUserObj({
            ...userObj,
            [e.target.name]: e.target.value
        })
    }
    const createToken = (userData) =>{
        return jwt.sign({ userData: userData }, process.env.REACT_APP_JWT_SECRET, {expiresIn: maxAgeTest});
    }
    const handeleRestPw = async (e) =>{
        e.preventDefault()
        try{
            // await app.emailPasswordAuth.resetPassword("newPassw0rd", token, tokenId);
            await app.emailPasswordAuth.resetPassword(userObj.password, token, tokenId).then(res =>{
                console.log('res', res)
                hasReset(true)
            })
        }catch(error){
            console.log(error)
        }
        
    }
    const handleLogin = async (e) =>{
        e.preventDefault()
        const emailLowerCase = userObj.email.toLocaleLowerCase()
        const credentials = Realm.Credentials.emailPassword(emailLowerCase, userObj.password)

        try{
            // Authenticate the user
            await app.logIn(credentials).then(async user=>{
                    console.log('working?', user)
                    // const key = await user.apiKeys.create(uid)
                    const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
                    const mongoCollection = mongo.db("smoke-show").collection("users");
                    let token = ''
                    const queryFilter = { userId: user.id };
                    await mongoCollection.findOne(queryFilter).then(loginUserData =>{
                        console.log('login user data', loginUserData)
                        loginUserData.login = userObj
                        token = createToken(loginUserData)
                        
                        localStorage.setItem('session_token', token)
                    }).then(()=>{props.history.push("/")})
                    
                    
                });
            
      
        }catch(error){
            console.log('error', error)

        }
    }
    useEffect(() => {
        
    }, [])

    return (
        <Layout ref={childRef}>
            <div className="custom-modal-body theme-text-p height-adj-main">
                <div style={{marginTop:'4rem'}}></div>
                {hasReset ? 
                <React.Fragment>
                    <div style={{textAlign:"center"}}>
                        <h4>Your password has been reset</h4><br/>
                        <p> Login with your new password.</p>
                    </div>
                    <div className="spacer-4rem"></div>
                    <Form className="login-form" onSubmit={handleLogin}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="e.g. example@example.com" name="email" onChange={handleChange} />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="" name="password" onChange={handleChange} />
                        </Form.Group>
                        <div className="spacer-2rem"></div>
                        <div className="login-btn-wrapper">
                            <Button className="login-btn" type="submit">
                                Login
                            </Button><br /><br />
                            
                        </div>
                    
                    </Form>
                </React.Fragment>
                :
                <React.Fragment>
                    <div className="login-logo-wrapper theme-text-p">
                        <h4 className="h4-style">Reset Your Password</h4>
                        <div className="spacer-4rem"></div>
                        <p>Please enter your new password below</p>
                    </div>
                    <Form className="login-form" onSubmit={handeleRestPw}>
         
                        <Form.Group >
                            <Form.Label>New password</Form.Label>
                            <Form.Control type="password" placeholder="Between 6 and 128 characters long" name="password" onChange={handleChange} />
                        </Form.Group>
                        <br/>
                        <Form.Group >
                            <Form.Label>Confirm new password</Form.Label>
                            <Form.Control type="password" placeholder="type your new password again" name="password2" onChange={handleChange} />
                        </Form.Group>
                        {hasError && <div className="error-msg">{msg}</div>}
                        <br/>
                        <div className="login-btn-wrapper">
                            <Button className="login-btn" type="submit">
                                Set New Password
                            </Button>
                        </div>
                        <div className="spacer-4rem"></div>
                    </Form>
                </React.Fragment>
                }
            </div>
        </Layout>
        
    )
}

export default connect()(ResetPassword)


