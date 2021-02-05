import React, { useState, Fragment, useEffect} from 'react'
import { Row, Col, Modal, Button, Form, Alert } from 'react-bootstrap'
import bioPic from '../../assets/temp-photos/bio/avator-male.jpg'
import noImg from '../../assets/global/no_image.jpg'
import jwt from 'jsonwebtoken'
import * as Realm from "realm-web"

const appConfig = {
    id: process.env.REACT_APP_REALM_APP_ID,
    timeout: 10000, // timeout in number of milliseconds
  };
const app = new Realm.App(appConfig);

const SettingModal = (props) =>{
    const bucketName = process.env.REACT_APP_AWS_BUCKET_NAME
    const [imgData64Profile, setImgData64Profile] = useState('')
    const [imgData64Cover, setImgData64Cover] = useState('')
    const [userObj, setUserObj] = useState({fname: props.profileUser.fname, lname: props.profileUser.lname, email: props.profileUser.email, username: props.profileUser.username})
    const [userPw, setUserPw] = useState({newPw: '', conNewPw: '', currentPw: ''})
    // const [file, setFile] = useState({})
    const [profilePic, setProfilePic] = useState({})
    const [coverPic, setCoverPic] = useState({})
    const [imgThumb, setImgThumb] = useState()
    const [coverImgThumb, setCoverImgThumb] = useState()
    const msg = {profilePic: 'Your profile picture is successfully updated', coverPic: 'Your cover picture is successfully updated', userDetails: 'Your account information successfully updated', password: 'Your password is successfully updated'}
    const [isSuccess, setIsSuccess] = useState({profilePic: false, coverPic: false, userDetails: false, password: false })
    const [currentBioPic, setCurrentBioPic] = useState()
    const [currentCover, setCurrentCover] = useState()
    const [disableBtnStates, setDisableBtnStates] = useState({profilePic: true, coverPic: true, userDetails: true, password: true})
    const baseImgUrl = 'https://s3.amazonaws.com/images.test.smokeshow/'

    const handleClose = props.handleCloseSetting
    // const handleShow = props.handleShowSetting

    const handleChange = (e) =>{
        
        setUserObj({...userObj,
            [e.target.name]: e.target.value
        })
        if(disableBtnStates){
            setDisableBtnStates({
                ...disableBtnStates,
                userDetails: false
            })
        }
        console.log('userobj', userObj)

    }
    const handleChangePw = (e) =>{
        setUserPw({
            ...userPw,
            [e.target.name]: e.target.value
        })
        setDisableBtnStates({
            ...disableBtnStates,
            password: false
        })
    }

    const profilePicUpload = (e) =>{
        setProfilePic(e.target.files[0])
        setImgThumb(URL.createObjectURL(e.target.files[0]))
        setDisableBtnStates({
            ...disableBtnStates,
            profilePic: false
        })
        const file = e.target.files[0] 
        const reader = new FileReader()
        reader.onload = (event) => {
        const base64 = event.target.result.split(",").pop()
          setImgData64Profile(base64)
        };
        reader.readAsDataURL(file)
    }
    const saveProfilePic = async () =>{
        const imgId = new Date().getTime()
        const filekey = props.profileUser.userId + '/profile/' + imgId
        const imgUrlWithKey = baseImgUrl + filekey
        if(app.currentUser.id === props.profileUser.userId){
            try{
                await app.currentUser.functions.putImageObjToS3(imgData64Profile, bucketName, filekey, profilePic.type).then( async res =>{
                    console.log('res', res)
                    const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                    const collectionUser = mongo.db("smoke-show").collection("users")
                    try{
                        await collectionUser.updateOne(
                            { "userId": app.currentUser.id},
                            { "$set": { "profilePic": imgUrlWithKey } },
                            { upsert: true}
                        ).then(res =>{
                            console.log('res', res)
                            setIsSuccess({
                                ...isSuccess,
                                profilePic: true
                            })
                            setDisableBtnStates({
                                ...disableBtnStates,
                                profilePic: true
                            })
                            props.updateProfileData(imgUrlWithKey, "profilePic")
                        })
                    }catch(err){
                        console.log(err)
                    }
                })
            }catch(err){
            console.log(err)
            }
        }else{
        console.log('I have to debug')
        }
    }
    const coverPicUpload = (e) =>{
        setCoverPic(e.target.files[0])
        setCoverImgThumb(URL.createObjectURL(e.target.files[0]))
        setDisableBtnStates({
            ...disableBtnStates,
            coverPic: false
        })
        const file = e.target.files[0] 
        const reader = new FileReader()
        reader.onload = (event) => {
        const base64 = event.target.result.split(",").pop()
          setImgData64Cover(base64)
        };
        reader.readAsDataURL(file)
    }
    const saveProfileCover = async  (e) =>{
        const imgId = new Date().getTime()
        const filekey = props.profileUser.userId + '/profile/' + imgId
        const imgUrlWithKey = baseImgUrl + filekey
        if(app.currentUser.id === props.profileUser.userId){
            try{
                await app.currentUser.functions.putImageObjToS3(imgData64Cover, bucketName, filekey, coverPic.type).then( async res =>{
                    console.log('res', res)
                    const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                    const collectionUser = mongo.db("smoke-show").collection("users")
                    try{
                        await collectionUser.updateOne(
                            { "userId": app.currentUser.id},
                            { "$set": { "profileCover": imgUrlWithKey } },
                            { upsert: true}
                        ).then(res =>{
                            console.log('res', res)
                            setIsSuccess({
                                ...isSuccess,
                                coverPic: true
                            })
                            setDisableBtnStates({
                                ...disableBtnStates,
                                coverPic: true
                            })
                            props.updateProfileData(imgUrlWithKey, 'profileCover')
                        })
                    }catch(err){
                        console.log(err)
                    }
                })
            }catch(err){
            console.log(err)
            }
        }else{
            console.log('I have to debug')
        }
    }

    const handleUpdateProfile = async (e) =>{
        e.preventDefault()
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionUser = mongo.db("smoke-show").collection("users")
       
        if(app.currentUser.id === props.profileUser.userId){
            try{
                await collectionUser.updateOne(
                    { "userId": app.currentUser.id},
                    {
                        "$set": {
                            "fname": userObj.fname,
                            "lname": userObj.lname,
                            "username": userObj.username
                          }
                    },
                    { upsert: true}
                ).then( res =>{
                    console.log(res)
                    setIsSuccess({
                        ...isSuccess,
                        userDetails: true
                    })
                    setDisableBtnStates({
                        ...disableBtnStates,
                        userDetails: true
                    })
                    props.updateUserDetails(userObj.fname, userObj.lname, userObj.username)
                })
            }catch(err){ console.log(err) }
            
        }else{
            console.log('write login function')
        }
        
    }
    useEffect(() => {
        if( typeof(props.profileUser.profilePic) == 'undefined' || props.profileUser.profilePic  == ''){
            setCurrentBioPic(bioPic)
        
        }else{
            setCurrentBioPic(props.profileUser.profilePic)
        }
        setUserObj({...userObj, profilePic: bioPic})
        if(props.profileUser.profileCover == '' || typeof(props.profileUser.profileCover) == "undefined"){
            setCurrentCover(noImg)
        }else{
            setCurrentCover(props.profileUser.profileCover)
        }
        // const token = localStorage.getItem('session_token')
        // jwt.verify(token, process.env.REACT_APP_JWT_SECRET, function(err, decoded) {
        //     if (err) {
        //         console.log('err', err)

        //     }else{
        //         console.log('success', decoded.userData.login.email)
        //         setUserObj({...userObj, email: decoded.userData.login.email})
        //     }
        //   });
    }, [])

    return(
    <Fragment>
        <Modal className="modal-wrapper-bio" show={props.show} onHide={handleClose}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <Row className="bio-modal-inner-wrapper">
                    <Col sm={6} className="">
                    <p className="heading-modal">Your profile picture</p>
                    <Row>
                    
                        <Col sm={4}>
                            <div className="change-bio-pic-wrapper">
                                <img src={imgThumb ? imgThumb : currentBioPic} alt="user avator" className="change-pic" />
                            </div>
                            
                        </Col>
                        <Col sm={8} className="setting-file-btn" >
                        
                            <Form>
                                <Form.Group>
                                    <Form.File 
                                    id="bio-pic"
                                    label={profilePic.name ? profilePic.name : '' }
                                    onChange={profilePicUpload}
                                    custom
                                     />
                                </Form.Group>
                                <small >Maximum file size is 3MB.</small>
                                {isSuccess.profilePic ? <Alert variant="success" style={{padding: '5px', marginTop: '1rem', textAlign:'center'}}><small>{msg.profilePic}</small></Alert> :
                                <div style={{marginTop: '1rem'}}></div>
                                }
                                <Button variant="primary" onClick={saveProfilePic} className="save-changes-btn" disabled={disableBtnStates.profilePic}>
                                Upload
                                </Button>
                                
                            </Form>
                        </Col>
                    </Row>
                    <hr />
                    <div className="spacer-2rem"></div>
                    <p className="heading-modal">Your account information</p>
                              
                    <Form>
                        <Row>
                            <Col sm={6}>
                                <Form.Group >
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control name="fname" type="text" placeholder={props.profileUser.fname ? props.profileUser.fname : "Enter your first name"} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group >
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control name="lname" type="text" placeholder={props.profileUser.lname ? props.profileUser.lname : "Enter your first name"} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <br/>
                        <Form.Group >
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" placeholder={props.profileUser.email ? props.profileUser.email: "Please add your email"} disabled />
                        </Form.Group>
                        <br/>
                        <Form.Group >
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" name="username" placeholder={props.profileUser.username ? props.profileUser.username : "Please add your username"} onChange={handleChange} />
                        </Form.Group>
                        <br/>
                        {isSuccess.userDetails ? <Alert variant="success" style={{padding: '5px', marginTop: '1rem', textAlign:'center'}}><small>{msg.userDetails}</small></Alert> :
                                <div style={{marginTop: '1rem'}}></div>
                                }
                        <Button variant="primary" onClick={handleUpdateProfile} className="save-changes-btn" disabled={disableBtnStates.userDetails}>
                                Save Changes
                        </Button>
                    </Form>
                    </Col>
                    <Col sm={6}>
                        <p className="heading-modal">Your cover image</p>
                        <Row>
                            <Col sm={4}>
                                <div className="change-bio-pic-wrapper">
                                    <img src={coverImgThumb ? coverImgThumb : currentCover} alt="user uploaded photo" className="change-pic" />
                                </div>
                                
                            </Col>
                            <Col sm={8} className="setting-file-btn" >
                                <Form>
                                    <Form.Group>
                                        <Form.File 
                                        // id="exampleFormControlFile2" className="upload-file-btn"
                                        id="bio-pic"
                                        label={coverPic.name ? coverPic.name : ''}
                                        onChange={coverPicUpload}
                                        custom
                                        />
                                    </Form.Group>
                                    <small >Maximum file size 3MB.</small>
                                    {isSuccess.coverPic ? <Alert variant="success" style={{padding: '5px', marginTop: '1rem', textAlign:'center'}}><small>{msg.coverPic}</small></Alert> :
                                    <div style={{marginTop: '1rem'}}></div>
                                    }
                                    <Button variant="primary" onClick={saveProfileCover} className="save-changes-btn " disabled={disableBtnStates.coverPic}>
                                    Upload
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                        
                        <hr />
                        <div className="spacer-2rem"></div>
                        
                        <p className="heading-modal">Change password</p>
                        <Form>
                            <Form.Group >
                                <Form.Label>Current password</Form.Label>
                                <Form.Control type="password" placeholder="Enter your current password" name="currentPw" onChange={handleChangePw} />
                            </Form.Group>
                            <br/>
                            <Form.Group >
                                <Form.Label>New password</Form.Label>
                                <Form.Control type="password" placeholder="Enter your new password" name="newPw" onChange={handleChangePw} />
                            </Form.Group>
                            <br/>
                            <Form.Group >
                                <Form.Label>Confirm new password</Form.Label>
                                <Form.Control type="password" placeholder="Confirm your new password" name="conNewPw" onChange={handleChangePw} />
                            </Form.Group>
                            <br/>
                            { isSuccess.password && <Alert variant="success">{msg.password}</Alert> }

                            <Button variant="primary" onClick={handleClose} className="save-changes-btn" disabled={disableBtnStates.password}>
                                    Save new password
                            </Button>
                        </Form>
                    </Col>
                </Row>
                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose} className="save-changes-btn btn-close-settings">
                        Close
                </Button>
            </Modal.Footer>
        </Modal>
    </Fragment>
    )
}

export default SettingModal