import React, { useState, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap'
// import Logo from '../assets/global/Logo-smoke-show.png'
import * as Realm from "realm-web"
import { connect } from 'react-redux'
import jwt from 'jsonwebtoken'
import Layout from './Layout/Layout'
// import { openLoginModal } from '../store/actions/authActions'
import axios from 'axios'

const EmailConfirmation = (props) =>{
    let token = new URLSearchParams(props.location.search).get("token")
    let tokenId = new URLSearchParams(props.location.search).get("tokenId")
    const [userObj, setUserObj] = useState({fname: '', lname: '', token: token, tokenId: tokenId, username: '', email: '', password: ''})
    const [hasError, setHasError] = useState(false)
    const [hasRegistered, setHasRegistered] = useState(false)
    const [msg, setMsg] = useState("")
    const maxAgeTest = 1 * 60 * 60
    const id = process.env.REACT_APP_REALM_APP_ID
    const config = { id };
    const app = new Realm.App(config);
    const [clicked, setClicked] = useState(false)
    const [resendMsg, setResendMsg] = useState('')
    
    const vipNames = ["EddieX", "Lexurious Fleet", "Stradman", "Burlacher", "SummitLife", "HeavyD", "Hoovies Garage", "Streetspeed717", "RFRacing", "Bertrand850", "InShane Designs", "Savage Garage", "effSpot", "Goonzquad", "Tavarish", "VinWiki", "TJ Hunt", "DDE", "Emelia Hartford", "Doug Demuro", "StraightPipes", "Savage Geese", "SaabKyle04", "ThatDudeInBlue", "JR Garage", "Alex Rebuilds", "vTuned", "Cleetus McFarland", "Chevy Dude", "Seen Through Glass", "Shmee150", "SOL", "Mr JWW", "itsjusta6", "WhistlinDiesel", "Samcrac", "Car Wizard", "The Smoking Tire", "Manny Khoshbin", "Donut Media", "Scotty Kilmer", "Jay Leno's Garage", "WatchJRGo", "Rich Rebuilds", "Speed Phenom", "RDB LA", "Salomondrin", "Buddy Wyrick", "Ken Block", "B is for Build", "SuperSpeeders", "Royalty Exotic Cars", "Adam LZ", "Rob Dahm", "ThrottleHouse", "LegitStreetCars", "Supercar Blondie", "Wrench Everyday", "Lambo Jesus", "Lambo Fan", "Motor Tube", "Redline Reviews"]

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
        let isUnique = (vipNames.indexOf(userObj.username) > -1)
        console.log(isUnique)
        e.preventDefault()
        if(!clicked){
            setHasError(false)
            if(!isUnique){
                const email = userObj.email.toLowerCase()
                const credentials = Realm.Credentials.emailPassword(email, userObj.password)
                try {
                    await app.logIn(credentials).then(async user =>{
                        const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
                        const mongoCollection = mongo.db("smoke-show").collection("users")
                        const filterUsername = {username: userObj.username}
                        try {
                            await mongoCollection.findOne(filterUsername).then(async res =>{
                                console.log('res', res)
                                if(res){
                                    setMsg('The username is already taken. Please try again.')
                                    setHasError(true)
                                }else{
                                    const joined = new Date().getTime()
                                    const userData = {
                                        userId: user.id,
                                        fname: userObj.fname,
                                        lname: userObj.lname,
                                        username: userObj.username,
                                        joined: joined
                                    }
                                    try {
                                        await mongoCollection.insertOne(userData).then(insertOneResult =>{
                                            let token = createToken(userData)
                                            const tokenCredentials = jwt.sign({ cre: credentials }, process.env.REACT_APP_JWT_SECRET, {expiresIn: maxAgeTest})
                                            const oldToken = sessionStorage.getItem('session_token')
                                            if(oldToken){
                                                sessionStorage.removeItem('session_token')
                                                sessionStorage.removeItem('session_user')
                                                sessionStorage.setItem('session_token', token)
                                                sessionStorage.setItem('session_user', tokenCredentials)
                                            }else{
                                                sessionStorage.setItem('session_token', token)
                                                sessionStorage.setItem('session_user', tokenCredentials)
                                            }
                                            setClicked(true)
                                 
                                        }).then(()=>{props.history.push("/")})
                                    } catch (error) { console.log(error)}
                                }
                            })
                        } catch (error) { console.log(error)}
                    })
                   } catch (error) {
            
                   }
            }else{
                setMsg('The username is already taken. Please try again.')
                setHasError(true)
                return
            }
    }
}

    const handleResendToken = async (e) =>{
        e.preventDefault()
        const email = userObj.email
        
        try{
            axios.post(`https://stitch.mongodb.com/api/client/v2.0/app/${process.env.REACT_APP_REALM_APP_ID}/auth/providers/local-userpass/confirm/call`, { email }).then(res => {
                console.log(res);
                setMsg('We have sent you a confirmation email. Please check your inbox.')
                setHasError(true)
            })
         
        }catch(err){
            console.log(err)
            setMsg('The email address you typed is not in our record. Please check your email address.')
            setHasError(true)
        }
   
    }

    const resendToken = ()=>{
        return(
            <div className="min-height-all">
                <center>
                    <h3>{msg}</h3>
                </center>
                
                <div className="spacer-4rem"></div>
                <Form className="login-form" onSubmit={handleResendToken}>
                    <Form.Group >
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="e.g. example@example.com" name="email" onChange={handleChange} required />
                    </Form.Group>
                    <div className="spacer-2rem"></div>
                    <div className="login-btn-wrapper">
                    { resendMsg && resendMsg }
                        <Button className="login-btn" type="submit">
                            Resend Confirmation Email
                        </Button><br /><br />
                        {/* <Button onClick={test}>check child ref</Button> */}
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
                setHasError(true)
                setHasRegistered(false)
            }
        }
    }
 
    useEffect(() => {
        confirmUser()
        
    }, [])

    return (
        <Layout >
            <div className="custom-modal-body" style={{padding:'1rem'}}>
                <div className="spacer-4rem"></div>
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
                            <Form.Control type="text" placeholder="Ex: SmokeShowFan" name="username" onChange={handleChange} required/>
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


const mapDispatchToProps = (dispatch)=>{
    return{
        // openLoginModal: (state) => dispatch(openLoginModal(state)),
    }
}

export default connect(null, mapDispatchToProps)(EmailConfirmation)