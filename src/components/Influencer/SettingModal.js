import React, { useState, Fragment, useEffect} from 'react'
import { Row, Col, Modal, Button, Form, Alert } from 'react-bootstrap'
import bioPic from '../../assets/temp-photos/bio/avator-male.jpg'
import noImg from '../../assets/global/no_image.jpg'
import jwt from 'jsonwebtoken'
import * as Realm from "realm-web"
import short from 'short-uuid'

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
    const [currentUserId] = useState(app.currentUser.id)
    const [userPw, setUserPw] = useState({newPw: '', conNewPw: '', currentPw: ''})
    const [uploadMsg, setUploadMsg] = useState({profile: '', cover: ''})
    const [tooBig, setTooBig] = useState({profile: false, cover: false})
    const [profilePic, setProfilePic] = useState({})
    const [coverPic, setCoverPic] = useState({})
    const [imgThumb, setImgThumb] = useState()
    const [coverImgThumb, setCoverImgThumb] = useState()
    const msg = {profilePic: 'Your profile picture is successfully updated', coverPic: 'Your cover picture is successfully updated', userDetails: 'Your account information successfully updated', password: 'Your password is successfully updated'}
    const [isSuccess, setIsSuccess] = useState({profilePic: false, coverPic: false, userDetails: false, password: false })
    const [currentBioPic, setCurrentBioPic] = useState()
    const [currentCover, setCurrentCover] = useState()
    const [disableBtnStates, setDisableBtnStates] = useState({profilePic: true, coverPic: true, userDetails: true, password: true})
    const baseImgUrl = `https://s3.amazonaws.com/${process.env.REACT_APP_AWS_BUCKET_NAME}/`

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
        if (e.target.files[0].size / (1024 * 1024) > 3){
            setTooBig({...tooBig, profile: true})
            setUploadMsg({...uploadMsg, profile: 'The file size is too big. Please choose different file.'})
            return
        }else{
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
    }
    const saveProfilePic = async () =>{
        
        const imgId = short.generate()
        const filekey = props.profileUser.userId + '/profile/' + imgId
        const imgUrlWithKey = baseImgUrl + filekey
        const oldProfilePic = props.profileUser.profilePic
        if( currentUserId === props.profileUser.userId){
            try{
                await app.currentUser.functions.putImageObjToS3(imgData64Profile, bucketName, filekey, profilePic.type).then( async res =>{
                    console.log('res', res)
                    if(typeof(oldProfilePic) !== "undefined"){
                  
                            const currentUrl = props.profileUser.profilePic
                            const splitted = currentUrl.split('/');
                            const key = splitted.splice(4, 7).join("/")
                            deleteImgObj(key)
                        
                    }
                    const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                    const collectionInfluencer = mongo.db("smoke-show").collection("influencers")
                    try{
                        await collectionInfluencer.updateOne(
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
        console.log('I have to debug', app.currentUser.id)
        const token = sessionStorage.getItem('session_user')
        const decoded = jwt.verify(token, process.env.REACT_APP_JWT_SECRET)

        try{
            await app.logIn(decoded.cre).then(async user =>{
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const collectionInfluencer = mongo.db("smoke-show").collection("influencers")
                await user.functions.putImageObjToS3(imgData64Profile, bucketName, filekey, profilePic.type).then( res =>{
                    if(typeof(oldProfilePic) !== "undefined"){
                  
                        const currentUrl = props.profileUser.profilePic
                        const splitted = currentUrl.split('/');
                        const key = splitted.splice(4, 7).join("/")
                        deleteImgObj(key)
                    
                    }
                })
                try{
                    await collectionInfluencer.updateOne(
                        { "userId": user.userId},
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
        }
    }
    const coverPicUpload = (e) =>{
        if (e.target.files[0].size / (1024 * 1024) > 3){
            setTooBig({...tooBig, cover: true})
            setUploadMsg({...uploadMsg, cover: 'The file size is too big. Please choose different file.'})
            return
        }else{
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
    }
    const saveProfileCover = async  (e) =>{
        const imgId = short.generate()
        const filekey = props.profileUser.userId + '/profile/' + imgId
        const imgUrlWithKey = baseImgUrl + filekey
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        if(currentUserId === props.profileUser.userId){
            try{
                await app.currentUser.functions.putImageObjToS3(imgData64Cover, bucketName, filekey, coverPic.type).then( async res =>{
                    console.log('res', res)
                    if( typeof(props.profileUser.profileCover) !== "undefined"){
                        const currentUrl = props.profileUser.profileCover
                        const splitted = currentUrl.split('/');
                        const key = splitted.splice(4, 7).join("/")
                        deleteImgObj(key)
                    }
                    
                    const collectionInfluencer = mongo.db("smoke-show").collection("influencers")
                    try{
                        await collectionInfluencer.updateOne(
                            { "userId": props.profileUser.userId},
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
                            props.updateProfileData(imgUrlWithKey, "profileCover")
                        })
                    }catch(err){
                        console.log(err)
                    }
                    
                })
            }catch(err){
            console.log(err)
            }
        }else{
            const token = sessionStorage.getItem('session_user')
            const decoded = jwt.verify(token, process.env.REACT_APP_JWT_SECRET)
      
            try{
                await app.logIn(decoded.cre).then(async  user =>{
                    const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                    const collectionInfluencer = mongo.db("smoke-show").collection("influencers")
                    await user.functions.putImageObjToS3(imgData64Cover, bucketName, filekey, coverPic.type).then( async res =>{
                        if( typeof(props.profileUser.profileCover) !== "undefined"){
                            const currentUrl = props.profileUser.profileCover
                            const splitted = currentUrl.split('/');
                            const key = splitted.splice(4, 7).join("/")
                            deleteImgObj(key)
                        }

                    })
                try{
                    await collectionInfluencer.updateOne(
                        { "userId": user.userId},
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
            
        }
    }


    const handleUpdateProfile = async (e) =>{
        e.preventDefault()
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionInfluencer = mongo.db("smoke-show").collection("influencers")
       
        if(app.currentUser.id === props.profileUser.userId){
            try{
                await collectionInfluencer.updateOne(
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
            const token = sessionStorage.getItem('session_user')
            const decoded = jwt.verify(token, process.env.REACT_APP_JWT_SECRET)
    
            try{
                await app.logIn(decoded.cre).then( async user =>{
                    const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                    const collectionInfluencer = mongo.db("smoke-show").collection("influencers")
                    try{
                        await collectionInfluencer.updateOne(
                            { "userId": user.userId},
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
                })
            }catch(err){ console.log(err) }
        }
        
    }

const deleteImgObj = async (key) =>{

    if(app.currentUser.id === props.profileUser.userId){
        try{
            await app.currentUser.functions.deleteImageObjToS3(bucketName, key).then(res =>{
                console.log('res', res)
            })
        }catch(err){console.log(err)}
    }else{
        const token = sessionStorage.getItem('session_user')
        const decoded = jwt.verify(token, process.env.REACT_APP_JWT_SECRET)

        try{
            await app.logIn(decoded.cre).then(async user =>{
                await user.functions.deleteImageObjToS3(bucketName, key).then(res =>{
                    console.log('res', res)
                })
            })
        }catch(err){console.log(err)}
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
                            <Form.Control type="text" name="username" placeholder={props.profileUser.username ? props.profileUser.username : "Please add your username"} disabled />
                        </Form.Group>
                        <br/>
                        {isSuccess.userDetails ? <Alert variant="success" style={{padding: '5px', marginTop: '1rem', textAlign:'center'}}><small>{msg.userDetails}</small></Alert> : ""}
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
                {/* <Button variant="primary" onClick={testDelete} className="save-changes-btn btn-close-settings">
                        test delete
                </Button> */}
            </Modal.Footer>
        </Modal>
    </Fragment>
    )
}

export default SettingModal