import React, { useState, useEffect, useRef } from 'react'
import { Button, Form } from 'react-bootstrap'
// import Logo from '../assets/global/Logo-smoke-show.png'
import * as Realm from "realm-web"
import { connect } from 'react-redux'
import jwt from 'jsonwebtoken'
import Layout from './Layout/Layout'

const EmailConfirmation = (props) =>{
    const childRef = useRef()
    let token = new URLSearchParams(props.location.search).get("token")
    let tokenId = new URLSearchParams(props.location.search).get("tokenId")
    const [userObj, setUserObj] = useState({fname: '', lname: '', token: token, tokenId: tokenId, username: '', email: '', password: ''})
    const [hasError, setHasError] = useState(false)
    const [hasRegistered, setHasRegistered] = useState(false)
    const [msg, setMsg] = useState("")
    const maxAgeTest = 1 * 60 * 60
    // let location = useLocation()
    const id = process.env.REACT_APP_REALM_APP_ID
    const config = { id };
    const app = new Realm.App(config);
    // console.log('location', location)
    
    const getApp = Realm.App.getApp(id)

    const handleChange =(e) =>{
        setUserObj({
            ...userObj,
            [e.target.name]: e.target.value
        })
    }
    const createToken = (userData) =>{
        return jwt.sign({ userData: userData }, process.env.REACT_APP_JWT_SECRET, {expiresIn: maxAgeTest});
    }
    const handleSubmit = async (e) =>{
        e.preventDefault()
        setHasError(false)
        const email = userObj.email.toLowerCase()
        
        const credentials = Realm.Credentials.emailPassword(email, userObj.password)
        await app.logIn(credentials).then(async user =>{
            const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
            const userData = {
                userId: user.id,
                fname: userObj.fname,
                lname: userObj.lname,
                username: userObj.username
            }
            
            const mongoCollection = mongo.db("smoke-show").collection("users");
            await mongoCollection.insertOne(userData).then(insertOneResult =>{
                console.log('result', insertOneResult)
                userData.login = {email: email, password: userObj.password}
                let token = createToken(userData)
                localStorage.setItem('session_token', token)
                childRef.current.handleUserByParent(userObj.fname)
            }).then(()=>{props.history.push("/")})

        })
    }
    const handleResendToken = async (e) =>{
        e.preventDefault()
        console.log('email', userObj.email)
        const email = userObj.email
        const response = await getApp.emailPasswordAuth.resendConfirmation(email)
        console.log('response', response)
    }
    const resendToken = ()=>{
        return(
            <div>
                <center>
                    <h3>{msg}</h3>
                </center>
                
                <div className="spacer-4rem"></div>
                <Form className="login-form" onSubmit={handleResendToken}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="e.g. example@example.com" name="email" onChange={handleChange} required />
                    </Form.Group>
                    <div className="login-btn-wrapper">
                        <Button className="login-btn" type="submit">
                            Resend Confirmation Email
                        </Button><br /><br />
                     
                    </div>
                </Form>
            </div>
        )
    }
    const confirmUser = async () =>{
        if(token){
            try{
                await app.emailPasswordAuth.confirmUser(token, tokenId).then(user =>{
                    setHasRegistered(true)
                    
                })
            }catch(error){
                console.log('error', error)
                setMsg('Oops, the link was expired. Please resend confirmation email.')
                setHasRegistered(false)
            }
        }
    }
 
    useEffect(() => {
        confirmUser()
        
    }, [])

    return (
        <Layout ref={childRef}>
            <div className="custom-modal-body">
                <div style={{marginTop:'3rem'}}></div>
                {hasRegistered ? 
                <React.Fragment>
                    <div className="login-logo-wrapper">
                        <h3>You are registered to The Smoke Show.</h3>
                        <p>Please fill in your info and login.</p>
                    </div>
                    <Form className="login-form" onSubmit={handleSubmit}>
                        <Form.Group >
                            <Form.Label>First name</Form.Label>
                            <Form.Control type="text" placeholder="e.g. John" name="fname" onChange={handleChange} required/>
                        </Form.Group>
                        <Form.Group >
                            <Form.Label>Last name</Form.Label>
                            <Form.Control type="text" placeholder="e.g. Due" name="lname" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="e.g. Smoke Show love" name="username" onChange={handleChange} required/>
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="e.g. example@example.com" name="email" onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Between 6 and 128 characters long" name="password" onChange={handleChange} />
                        </Form.Group>
                        
                        {hasError && <div className="error-msg">{msg}</div>}
                        <br/>
                        <div className="login-btn-wrapper">
                            <Button className="login-btn" type="submit">
                                Login
                            </Button>
                        </div>
                        <div className="spacer-4rem"></div>
                    </Form>
                </React.Fragment>
                : resendToken()
                }
            
            </div>
        </Layout>
        
    )
}

export default connect()(EmailConfirmation)

