import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import Avatar from 'react-avatar'
import { connect } from 'react-redux'
import * as Realm from "realm-web"
import { Link } from 'react-router-dom'
// import { authUser } from '../store/actions/authActions'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import {uid} from 'react-uid'

const Comments = (props) =>{
    // const [commentsData, setCommentsData] = useState(props.comments)
    const [commentsDB, setCommentsDB] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    // const [modalShow, setModalShow] = useState(false)
    const [userComment, setUserComment] = useState("")
    const app = new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID })
    // const getApp = Realm.App.getApp(process.env.REACT_APP_REALM_APP_ID);
    // console.log('comment props', props)

    const handleChange = (e) =>{
        setUserComment(e.target.value)
    }
    const handleSubmitComment = async (e) =>{
        e.preventDefault()
        // console.log('props', props)
        let tokenLocalStorage = localStorage.getItem('session_token')
        let newComment ={}
        let credentials = null
        if(tokenLocalStorage){
            jwt.verify(tokenLocalStorage, process.env.REACT_APP_JWT_SECRET, (err, decoded)=>{
                if(err){
                    console.log('please log in. session time out')
                }else{
                    newComment={
                        userId: decoded.userData.userId,
                        comment: userComment,
                        date_posted: new Date().getTime(),
                        videoId: props.videoId,
                        username: decoded.userData.fname
                    }
                    credentials = Realm.Credentials.emailPassword(decoded.userData.login.email, decoded.userData.login.password);
                }
            })
        }
        try{
            // Authenticate the user
            await app.logIn(credentials).then(async user=>{
                
                    const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
                    const mongoCollection = mongo.db("smoke-show").collection("comments");

                    await mongoCollection.insertOne(newComment).then(result =>{
                        if(result){
                            e.target.reset();
                            getComments()
                        }else{
                            console.log('error', result)
                        }
                    })
                });
            
      
        }catch(error){
            console.log('error', error)

        }
   
    }
    const writeComment = () =>{
        return (
        <Row className="comment-wrapper">
            <div className="col-1" style={{margin:0,padding:0}}>
                <Avatar color={Avatar.getRandomColor('sitebase', ['red', 'green', 'teal'])} className="profile-pic" name="saki" />
            </div>
            <div className="col-11" style={{margin: 0, paddingRight:0}}>
                <Form onSubmit={handleSubmitComment} >
                    <Form.Group >
                    <Form.Control className="comment-input" type="text" placeholder="Write a comment here" name="comment" onChange={handleChange} required/>
                        <div className="comment-login-wrapper">
                            <Button className="comment-btn" type="submit">Post comment</Button>
                        </div>
                    </Form.Group>
                </Form>
                
            </div>
        </Row>
        )
        
    }
        
       
    const loginToComment = () => {
        return (
            <>
                <div>Please login to comment</div>
                <hr />
            </>
        )
       
    }
    const getComments = async () =>{
        let userLogged;
        const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
        try {
        //   const app = new Realm.App(appConfig);
      
          // an authenticated user is required to access a MongoDB instance
          await app.logIn(credentials).then( async user =>{
            const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
            const mongoCollection = mongo.db("smoke-show").collection("comments")
            const filter = {videoId: props.videoId} 
            const options = {sort: {date_posted: -1}, limit: 4}
            await mongoCollection.find(filter,options).then(resAll =>{
                setCommentsDB(resAll)
                return resAll
            })
           
          }
          )
          // the rest of your code ...
      
         }catch(error){console.log(error)}
    }
    useEffect(() => {
        
        if(props.loginUserData.userId){
            setIsLoggedIn(true)
        }else{
            setIsLoggedIn(false)
        }
    }, [props.loginUserData.userId])

    useEffect( () => {
        
        getComments()
        let tokenLocalStorage = localStorage.getItem('session_token')
         if(tokenLocalStorage){
            jwt.verify(tokenLocalStorage, process.env.REACT_APP_JWT_SECRET, (err, decoded)=>{
                if(err){
                    console.log(err)
                    setIsLoggedIn(false)
                }else{
                    console.log('decoded: ', decoded)
                    setIsLoggedIn(true)
                }
            });
            
         }
    }, [])
    return(
        <React.Fragment>
    
        {isLoggedIn ? writeComment() : loginToComment() }

        { commentsDB.map(comment =>{
            var localtime = moment(comment.date_posted).local().format('YYYY-MM-DD')
           
            return(
                <Row className="comment-wrapper" key={uid(comment)}>
                    
                    <div style={{margin:0,padding:0}} className="col-1">
                        <Link to={{
                            pathname: `/user/${comment.userId}`
                        }}>
                            {comment.profile_pic ? <img src={comment.profile_pic} className="profile-pic " alt={comment.username} /> :
                            <Avatar color={Avatar.getRandomColor('sitebase', ['red', 'green', 'teal'])} className="profile-pic" name={comment.username} />
                            }
                        </Link>
                    </div>
                    
                    <div  style={{margin: 0, paddingRight:0}} className="col-11">
                    <div className="comment-username ">
                        <Link to={{
                            pathname: `/user/${comment.userId}`
                        }}>
                            <strong>{comment.username}</strong>
                        </Link>
                     {" "} | <span style={{color:'gray'}}>{localtime}</span></div>
                    <div className="comment-txt" s>{comment.comment}</div>
                    </div>
                </Row>
            )
        })
        }
        </React.Fragment>
        
        
    )
}
const mapStateToProps = (state) => {
    //syntax is propName: state.key of combineReducer.key
    return{
        credentials: state.auth.credentials,
        loginUserData: state.auth.loginUserData
    }
  }

export default connect(mapStateToProps)(Comments)