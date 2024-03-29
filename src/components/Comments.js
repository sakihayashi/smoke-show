import React, { useState, useEffect } from 'react'
import { Row, Button, Form, Accordion, Card } from 'react-bootstrap'
import Avatar from 'react-avatar'
import { connect } from 'react-redux'
import * as Realm from "realm-web"
import { Link } from 'react-router-dom'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import editIcon from '../assets/global/edit-icon.svg'
import { openLoginModal, attachMsg } from '../store/actions/authActions'
import './comments.scss'
// import VisibilitySensor from 'react-visibility-sensor'
import short from 'short-uuid'
import { EditComment } from './Edits'

const Comments = (props) =>{
    const { customData } = props
    const [commentsDB, setCommentsDB] = useState([])
    const [moreComments, setMoreComments] = useState([])
    const [isComment, setIsComment] = useState(false)
    const [userComment, setUserComment] = useState("")
    const [editMode, setEditMode] = useState([])
    const app = new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID })
    const [isPicSet, setIsPicSet] = useState([])
    const [morePics, setMorePics] = useState([])
    const [loginUser, setLoginUser] = useState('')
    const [allowEdit, setAllowEdit] = useState([])

    const handleChange = (e) =>{
        setUserComment(e.target.value)
    }
    const handleSubmitComment = async (e) =>{
        e.preventDefault()
        let tokenSessionStorage= sessionStorage.getItem('session_token')
        const tokenUser = sessionStorage.getItem('session_user')
        let newComment ={}
        let credentials = null
        
        if(tokenSessionStorage){
            jwt.verify(tokenSessionStorage, process.env.REACT_APP_JWT_SECRET, (err, decoded)=>{
                if(err){
                    console.log('please log in. session time out')
                }else{
                    let profileThumb;
                    if(typeof(decoded.userData.profileThumb) !== 'undefined'){
                        profileThumb = decoded.userData.profileThumb
                    }else{
                        profileThumb = null
                    }
                    newComment={
                        userId: decoded.userData.userId,
                        comment: userComment,
                        date_posted: new Date().getTime(),
                        videoId: props.videoId,
                        username: decoded.userData.fname,
                        profileThumb: profileThumb
                    }
                    credentials = jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET)
                }
            })
        }
        try{
            // Authenticate the user
            await app.logIn(credentials.cre).then(async user=>{
                    setLoginUser(user.id)
                    const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
                    const mongoCollection = mongo.db("smoke-show").collection("comments");

                    await mongoCollection.insertOne(newComment).then(res =>{
                            e.target.reset();
                            getComments(credentials.cre)
                    })
                });

        }catch(error){
            console.log('error', error)

        }
   
    }
    const updateComment = async (e, id, index, rewrite) =>{
        e.preventDefault()
        const tokenUser = sessionStorage.getItem('session_user')
     
        if(tokenUser){
            jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, async (err, decoded)=>{
                if(err){
                    console.log('decode error')
                    
                }else{
                    try{
                        await app.logIn(decoded.cre).then( async user =>{
                            const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                            const collectionComments = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("comments")
                            await collectionComments.updateOne(
                                { _id: {"$oid": id}},
                                {
                                    "$set": {
                                        "comment": rewrite
                                    }
                                }
                            ).then(res =>{
                                console.log(res)
                                let newArr = [...editMode]
                                newArr[index] = false
                                setEditMode(newArr)
                                getComments(decoded.cre)
                            })
                       })
                    }catch(error){
                        console.log(error)
                    }
                   
            
                }
            })
        }
    }
    const writeComment = () =>{
        return (
        <Row className="comment-wrapper">
            <div className="col-1" style={{margin:0,padding:0}}>

                <Avatar color={Avatar.getRandomColor('sitebase', ['red', 'green', 'teal'])} className="profile-pic" name="" />
            </div>
            <div className="col-11" style={{margin: 0, paddingRight:0}}>
                <Form onSubmit={handleSubmitComment} >
                    <Form.Group >
                    <Form.Control className="comment-input" type="text" placeholder="Add a comment here" name="comment" onChange={handleChange} required/>
                        <div className="comment-login-wrapper">
                            <Button className="comment-btn" type="submit"> Comment</Button>
                        </div>
                    </Form.Group>
                </Form>
            </div>
        </Row>
        )
        
    }
        
    const askLogin = () =>{
        props.openLoginModal(true)
        props.attachMsg('Please login to comment.')
    }
    const loginToComment = () => {
        return (
            <Row className="comment-wrapper">
                <div className="col-1" style={{margin:0,padding:0}}>

                <Avatar color={Avatar.getRandomColor('sitebase', ['red', 'green', 'teal'])} className="profile-pic" name="" />
                </div>
                 <div className="col-11" style={{margin: 0, paddingRight:0}}>
                    <Form onSubmit={handleSubmitComment} >
                        <Form.Group >
                        <Form.Control className="comment-input" type="text" placeholder="Write a comment" name="comment" onChange={askLogin} />
                            <div className="comment-login-wrapper">
                                <Button 
                                disabled
                                className="comment-btn" type="submit">Comment</Button>
                            </div>
                        </Form.Group>
                    </Form>
                </div>
            </Row>
           
        )
       
    }
    const chunkArray = (allComments) =>{
        let all = allComments.slice(2)
        let chunk_size = 10
        let index = 0;
        let arrayLength = all.length;
        let tempArray = [];
        let myChunk
        
        for (index = 0; index < arrayLength; index += chunk_size) {
            myChunk = all.slice(index, index+chunk_size);
            // Do something if you want with the group
            tempArray.push(myChunk);
        }

        return tempArray;
    }

    const getComments = async (credentials) =>{
        const filter = {videoId: props.videoId} 
        const options = {sort: {date_posted: -1}, limit: 12}
        setCommentsDB([])

        try{
            await app.logIn(credentials).then(async user =>{
                if(user.id === app.currentUser.id){
                }else{
                    console.log('current user and logged in user do not match')
                }
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const collectionComments = mongo.db("smoke-show").collection("comments")
                await collectionComments.find(filter, options).then(async resAll =>{
                    let arr = []
                    let arrIds = []
                    let arrModes = []
                    resAll.map(res =>{
                        arr.push(true)
                        arrIds.push(res.userId)
                        arrModes.push(false)
                    })
                    setIsPicSet(arr)
                    setAllowEdit(arrIds)
                    setEditMode(arrModes)
                    if( resAll.length !== 0){
                        // let picAttached = resAll.map(async 
                        setIsComment(true)
                         if(resAll.length == 1){
                            setCommentsDB(resAll)
                         }else if(resAll.length == 2){
                            for(let i=0;i<2; i++){
                                setCommentsDB(commentsDB=>[...commentsDB, resAll[i]])
                            }
                        }else if(resAll.length >= 3){
                            const chunked = chunkArray(resAll)
                            setMoreComments(chunked)
                            let arr = []
                            chunked.map(res =>{
                                arr.push(true)
                            })
                            setMorePics(arr)
                        }
                    }else if(resAll.length == 0){
                        setIsComment(false)
                        setCommentsDB([])
                    }
                    
                })
            })
                
            }catch(err){console.log(err)}
    }
    const swapImg = (i) =>{
       let newArr = [...isPicSet]
       newArr[i] = false
       setIsPicSet(newArr)
    }
    const swapMoreImg = (i) =>{
       let newArr = [...morePics]
       newArr[i] = false
       setMorePics(newArr)
    }
    const editModeOn = (i) =>{
        let newArr = [...editMode]
        newArr[i] = true
        setEditMode(newArr)
    }
    useEffect(() =>{
        if(typeof(customData) !== 'undefined' && typeof(customData.userId) !== 'undefined' ){
            setLoginUser(customData.userId)
        }
        
    }, [customData])
    useEffect( () => {
        const tokenUser = sessionStorage.getItem('session_user')
         if(tokenUser){
            jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, (err, decoded)=>{
                if(err){
                    const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    
                    getComments(credentials)
                }else{
                    getComments(decoded.cre)
                }
            });
            
         }else{
            const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    getComments(credentials)
         }
    }, [])
    return(
        <React.Fragment>
    
        {props.isLoggedIn ? writeComment() : loginToComment() }
        { isComment === true && commentsDB.length !== 0 ? commentsDB.map((comment, index) =>{
            const unique = short.generate()
            {/* var localtime = moment(comment.date_posted).local().format('MM-DD-YYYY') */}
            let localtime = moment(comment.date_posted).fromNow()
          
            return(
                <Row className="comment-wrapper" key={unique}>
                    {/* <VisibilitySensor onChange={onChange}> */}
                    <div style={{margin:0,padding:0}} className="col-1">
                        <Link to={{
                            pathname: `/user/${comment.userId}`
                        }}>
                            {isPicSet[index] ? 
                                 <img src={`https://dwdlqiq3zg6k6.cloudfront.net/${comment.userId}/profile/thumbnail`} className="profile-pic " alt={comment.username} loading="lazy" onError={()=>swapImg(index)} /> 
                               
                             :
                                <Avatar className="profile-pic" name={comment.username} color="#6E4DD5"/> 
                            }
                        
                        </Link>
                    </div>
                    {/* </VisibilitySensor> */}
                    <div  style={{margin: 0, paddingRight:0}} className="col-11">
                    <div className="comment-username ">
                        <Link to={{
                            pathname: `/user/${comment.userId}`
                        }}>
                            <strong>{comment.username}</strong>
                        </Link>
                     {" "} | <span style={{color:'gray'}}>{localtime}</span>
                     { allowEdit[index] === loginUser && 
                     <img src={editIcon} alt="edit this comment" className="edit-icon-comment" onClick={() => editModeOn(index)}/>}
                     </div>
                     {editMode[index] ? 
                     <EditComment handleChange={handleChange} userComment={userComment} updateComment={updateComment} comment={comment.comment} commentId={comment._id} index={index}/>
                     :
                     <div className="comment-txt" >{comment.comment}</div>
                     }
                    
                    </div>
                </Row>
            )
        }) : ''
        }
        <Accordion defaultActiveKey="0">
         
            <Card className="card-comments">
                <Card.Header className="card-comments-h">
                { moreComments[0] && 
                    <Accordion.Toggle as={Button} variant="link" eventKey="1" className="btn-load">
                    Load more
                    </Accordion.Toggle>
                }
                
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                <Card.Body className="collapsed-body">
                { moreComments[0] == null && <p>No more comment</p>}
                {moreComments[0] && moreComments[0].map((comment, index) =>{
                    const unique = short.generate()
                    let localtime = moment(comment.date_posted).fromNow()
                    return(
                        <Row className="comment-wrapper" key={unique}>

                            <div style={{margin:0,padding:0}} className="col-1">
                                <Link to={{
                                    pathname: `/user/${comment.userId}`
                                }}>
                                    {morePics[index] ? <img src={comment.profile_pic} className="profile-pic " alt={comment.username} loading="lazy" onError={()=>swapMoreImg(index)} /> :
                                    <Avatar className="profile-pic" name={comment.username} color="#6E4DD5"/>
                                    }
                                </Link>
                            </div>
                            
                            <div  style={{margin: 0, paddingRight:0}} className="col-11">
                            <div className="comment-username">
                                <Link to={{
                                    pathname: `/user/${comment.userId}`
                                }}>
                                    <strong>{comment.username}</strong>
                                </Link>
                            {" "} | <span style={{color:'gray'}}>{localtime}</span></div>
                            {editMode[index] ? 
                            <EditComment handleChange={handleChange} loginUser={loginUser} updateComment={updateComment} /> 
                            :
                            <div className="comment-txt" >{comment.comment}</div>
                            }
                            
                            </div>
                        </Row>
                    )
                })}
                </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
        </React.Fragment>
        
        
    )
}
const mapDispatchToProps = (dispatch)=>{
    return{
        openLoginModal: (state) => dispatch(openLoginModal(state)),
        attachMsg: (msg)=> dispatch(attachMsg(msg))
    }
}
const mapStateToProps = (state) => {
    //syntax is propName: state.key of combineReducer.key
    return{
        loginUserData: state.auth.loginUserData,
        isLoggedIn: state.auth.isLoggedIn,
        customData: state.auth.customData,
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Comments)