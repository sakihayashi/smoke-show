import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import * as Realm from "realm-web"

const LoginModal = (props) =>{
    const [userObj, setUserObj] = useState({fname: '', lname: '', email: '', password: '', password2: ''})
    const appConfig = {
        id: "smoke-show-test-uasqg" ,
        timeout: 10000, // timeout in number of milliseconds
      };
    const getApp = Realm.App.getApp("smoke-show-test-uasqg");

    const handleChange =(e) =>{
        setUserObj({
            ...userObj,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) =>{
        e.preventDefault()
        const credentials = Realm.Credentials.emailPassword(userObj.email, userObj.password)


        // const mongodb = props.app.services.mongodb("smoke-show-test-uasqg");
        // const collection = mongodb("smoke-show").collection("users");
        console.log('loo', credentials)

        try{
            // Authenticate the user
            await props.app.logIn(credentials).then(async user=>{
                    const mongo = user.mongoClient("RealmClusterFreeTier");
                    const mongoCollection = mongo.db("smoke-show").collection("users");
                    const customData = getApp.currentUser.customData
                    // props.handleUser(customData.fname)
                    console.log('user', getApp.currentUser)
                    console.log('user', user)
                    const queryFilter = { userId: user.id };
                    const loginUserData = await mongoCollection.findOne(queryFilter);
                    // console.log('working?', loginUserData)
                    props.handleUser(loginUserData.fname)
                });
            
      
        }catch(error){
            console.log('error', error)
        }
    }
    

const handleTest = async (e) =>{
e.preventDefault()
  let user;
const testName = {
    fname: "Mario",
    lname: "Hayashi"
}
  
  try {
    const app = new Realm.App(appConfig);

    // an authenticated user is required to access a MongoDB instance
    user = await app.logIn(Realm.Credentials.anonymous());
    console.log('uers', user)
    const mongo = user.mongoClient("RealmClusterFreeTier");
    const mongoCollection = mongo.db("smoke-show").collection("users");
    const insertOneResult = await mongoCollection.insertOne(testName);
    console.log(insertOneResult);

   }catch(err){console.log(err)}
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
          <Modal.Body>
            <Form className="login-form" onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" onChange={handleChange} />
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

export default LoginModal