import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import * as Realm from "realm-web"
import { authUser } from '../../store/actions/authActions'
import { connect } from 'react-redux'
import Logo from '../../assets/global/Logo-smoke-show.png'
import jwt from 'jsonwebtoken'
import { useUID } from 'react-uid'

const LoginModal = (props) =>{
    const [userObj, setUserObj] = useState({fname: '', lname: '', email: '', password: ''})
    const uid = useUID()
    const appConfig = {
        id: "smoke-show-test-uasqg" ,
        timeout: 10000, // timeout in number of milliseconds
      };
    const getApp = Realm.App.getApp("smoke-show-test-uasqg")
    //max age one day number of day, hours, min and sec
    const maxAge = 1 * 24 * 60 * 60
    const maxAgeTest = 1 * 60 * 60

    const createToken = (userData) =>{
        return jwt.sign({ userData: userData }, 'smoke_show_secret', {expiresIn: maxAgeTest});
    }

    const handleChange =(e) =>{
        setUserObj({
            ...userObj,
            [e.target.name]: e.target.value 
        })
    }
    const handleSubmit = async (e) =>{
        e.preventDefault()
        const credentials = Realm.Credentials.emailPassword(userObj.email, userObj.password)
        

        try{
            // Authenticate the user
            await props.app.logIn(credentials).then(async user=>{
                    
                    // const key = await user.apiKeys.create(uid)
                    const mongo = user.mongoClient("RealmClusterFreeTier");
                    const mongoCollection = mongo.db("smoke-show").collection("users");
                    let token = ''
                    // const customData = getApp.currentUser.customData
                    // props.handleUser(customData.fname)
                    // console.log('user', getApp.currentUser)
                    // console.log('user', user)
                    const queryFilter = { userId: user.id };
                    await mongoCollection.findOne(queryFilter).then(loginUserData =>{
                        loginUserData.login = userObj
                        token = createToken(loginUserData)
                        
                        localStorage.setItem('session_token', token)
                        const userData = {loginUserData: loginUserData, credentials: userObj}
                        props.handleUser(loginUserData.fname)
                        props.authUser(userData)
                    })
                    
                    // let decoded = jwt.verify(token, 'smoke_show_secret');
                    // console.log('decoded', decoded)
                    // console.log('userId', decoded.userData.userId)
                    
                });
            
      
        }catch(error){
            console.log('error', error)

        }
    }
    

// const handleTest = async (e) =>{
// e.preventDefault()
//   let user;
// const testName = {
//     fname: "Mario",
//     lname: "Hayashi"
// }
  
//   try {
//     const app = new Realm.App(appConfig);

//     // an authenticated user is required to access a MongoDB instance
//     user = await app.logIn(Realm.Credentials.anonymous());
//     console.log('uers', user)
//     const mongo = user.mongoClient("RealmClusterFreeTier");
//     const mongoCollection = mongo.db("smoke-show").collection("users");
//     const insertOneResult = await mongoCollection.insertOne(testName);
//     console.log(insertOneResult);

//    }catch(err){console.log(err)}
// }


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
            <Form className="login-form" onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="e.g. example@example.com" name="email" onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="" name="password" onChange={handleChange} />
                </Form.Group>

                <div className="login-btn-wrapper">
                    <Button className="login-btn" type="submit">
                        Login
                    </Button><br /><br />
                    <p className="click-div" onClick={props.toggleModal}>Or Signup here</p>
                </div>
                
            </Form>
          </Modal.Body>
          {/* <div className="spacer-4rem"></div> */}
        </Modal>
      );
}
// const mapDispatchToProps = (dispatch) =>{
//     return {
//         authUser: (user) => dispatch(authUser(user))
//     }
// }
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