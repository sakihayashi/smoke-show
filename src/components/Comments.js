import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import Avatar from 'react-avatar'
import { connect } from 'react-redux'
import * as Realm from "realm-web"
// import { authUser } from '../store/actions/authActions'
import moment from 'moment'

const Comments = (props) =>{
    // const [commentsData, setCommentsData] = useState(props.comments)
    const [commentsDB, setCommentsDB] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [modalShow, setModalShow] = useState(false)
    const [userComment, setUserComment] = useState("")
    const app = new Realm.App({ id: "smoke-show-test-uasqg" })
    const getApp = Realm.App.getApp("smoke-show-test-uasqg");
    console.log('comment props', props)

    const handleChange = (e) =>{
        setUserComment(e.target.value)
    }
    const handleSubmitComment = async (e) =>{
        e.preventDefault()
        console.log('props', props)
        const newComment = {
            userId: props.loginUserData.userId,
            comment: userComment,
            date_posted: new Date().getTime(),
            videoId: props.videoId,
            username: props.loginUserData.fname
        }
        console.log('props', props)
        const credentials = Realm.Credentials.emailPassword(props.credentials.email, props.credentials.password)
        try{
            // Authenticate the user
            await app.logIn(credentials).then(async user=>{
                
                    const mongo = user.mongoClient("RealmClusterFreeTier");
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
            <Col sm={1} style={{margin:0,padding:0}}>
                <Avatar color={Avatar.getRandomColor('sitebase', ['red', 'green', 'teal'])} className="profile-pic" name="saki" />
            </Col>
            <Col sm={11} style={{margin: 0, paddingRight:0}}>
                <Form onSubmit={handleSubmitComment} >
                    <Form.Group >
                    <Form.Control className="comment-input" type="text" placeholder="Write a comment here" name="comment" onChange={handleChange}/>
                        <div className="comment-login-wrapper">
                            <Button className="comment-btn" type="submit">Post comment</Button>
                        </div>
                    </Form.Group>
                </Form>
                
            </Col>
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
        const credentials = Realm.Credentials.emailPassword('saki@thehoongroup.com', 'aaaaaa')
        try {
        //   const app = new Realm.App(appConfig);
      
          // an authenticated user is required to access a MongoDB instance
          await app.logIn(credentials).then( async user =>{
            const mongo = user.mongoClient("RealmClusterFreeTier");
            const mongoCollection = mongo.db("smoke-show").collection("comments");
            const filter = {videoId: props.videoId} 
            const options = {sort: {date_posted: -1}, limit: 4}
            await mongoCollection.find(filter,options).then(resAll =>{
                console.log('find all', resAll);
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
    }, [])
    return(
        <React.Fragment>
    
        {isLoggedIn ? writeComment() : loginToComment() }

        { commentsDB.map(comment =>{
            var localtime = moment(comment.date_posted).local().format('YYYY-MM-DD')
           
            return(
                <Row className="comment-wrapper">
                    <Col sm={1} style={{margin:0,padding:0}}>
                    {comment.profile_pic ? <img src={comment.profile_pic} className="profile-pic" /> :
                    <Avatar color={Avatar.getRandomColor('sitebase', ['red', 'green', 'teal'])} className="profile-pic" name={comment.username} />
                    }
                        
                    </Col>
                    <Col sm={11} style={{margin: 0, paddingRight:0}}>
                    <div className="comment-username"><strong>{comment.username}</strong> | <span style={{color:'gray'}}>{localtime}</span></div>
                    <div className="comment-txt" s>{comment.comment}</div>
                    </Col>
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