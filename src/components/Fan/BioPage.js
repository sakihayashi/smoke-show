import React, { useState, useEffect, useRef } from 'react'
import {Helmet} from "react-helmet"
import * as Realm from "realm-web"
import Layout from '../Layout/Layout'
// import bioImgXs from '../../assets/temp-photos/bio/sample_a1n16a_c_scale,w_375.jpg'
// import bioImgS from '../../assets/temp-photos/bio/sample_a1n16a_c_scale,w_752.jpg'
// import bioImgM from '../../assets/temp-photos/bio/sample_a1n16a_c_scale,w_1040.jpg'
// import bioImgL from '../../assets/temp-photos/bio/sample_a1n16a_c_scale,w_1280.jpg'
// import bioImgXL from '../../assets/temp-photos/bio/sample_a1n16a_c_scale,w_1500.jpg'
import noImg from '../../assets/global/no_image.jpg'
import bioPic from '../../assets/temp-photos/bio/avator-male.jpg'
import dayDriver from '../../assets/temp-photos/bio/placeholder-car-repair2.jpg'
import editIcon from '../../assets/global/edit-icon.svg'
import settingsIcon from '../../assets/global/Settings-icon-white.svg'
import SettingModal from './SettingModal'
import { Button, Row, Col, Form } from 'react-bootstrap'

import './biopage.scss'
import VehicleCard from './vehicleCard'
import CreateNewCar from './CreateNewCar'
import jwt from 'jsonwebtoken'
import moment from 'moment'

const BioPage = (props) =>{
  
    const childRef = useRef()
    const profileUserId = props.match.params.id
    const [theUser, setTheUser] = useState({})
    const [profileUser, setProfileUser] = useState({})
    const [allowEdit, setAllowEdit] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [showSetting, setShowSetting] = useState(false);
    const [userCars, setUserCars] = useState([])
    const [showAddCar, setShowAddCar] = useState(false)
    const [numOfComments, setNumComments] = useState(null)
    const altData = {uername: 'No username yet', userId: '', profileDesc: 'No description yet.', myCars: [] }
    const [formattedTime, setFormattedTime] = useState(null)
    const altCarData = {name: 'No data yet', upgrades: 'No data yet', color: 'No data yet', wheels: 'No data yet', performance: 'No data yet', category: 'Dream car', imgUlr: noImg}
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
      };
    const app = new Realm.App(appConfig);
    
    const handleCloseAddCarModal = () => setShowAddCar(false)
    const handleShowAddCarModal = () => setShowAddCar(true)

    const handleChangeProfile = (e) =>{
        console.log('data disappear', profileUser)
        setProfileUser({
            ...profileUser,
            [e.target.name]: e.target.value
        })
    }
    const handleShowSetting = () =>{
        const token = localStorage.getItem('session_token')
        jwt.verify(token, process.env.REACT_APP_JWT_SECRET, function(err, decoded) {
            if (err) {
                console.log('err', err)
                
            }else{
                console.log('success', decoded.userData.login.email)
                setProfileUser({
                    ...profileUser,
                    email: decoded.userData.login.email
                })
                setShowSetting(true)
            }
          });
        
    }
    const handleCloseSetting = () =>{
        setShowSetting(false)
    }
    const userLoggedIn = (id) =>{
        if(id === profileUser.userId){
            setAllowEdit(true)
            regainData()
        }
    }
    const userLoggedOut = (id) =>{
        if(id === profileUserId){
            setAllowEdit(false)
        }
    }
    const updateProfileData = (data, key)=>{

        setProfileUser({
            ...profileUser,
            [key]: data
        })
    }
    const updateUserDetails = (fname, lname, username) =>{
        setProfileUser({
            ...profileUser,
            fname: fname,
            lname: lname,
            username: username
        })
    }
    const updateCarData = (data) =>{
        setUserCars(prevArray => [...prevArray, data])
    }
    const handleDataUpdate = async (e) =>{
        e.preventDefault()
  
        if(app.currentUser.id === profileUser.userId){
            const mongodb = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
            const mongoCollection = mongodb.db(process.env.REACT_APP_REALM_DB_NAME).collection("users")
    
            try{
                await mongoCollection.updateOne(
                    { "userId": app.currentUser.id},
                    {
                        "$set": {
                            "profileDesc": profileUser.profileDesc
                          }
                    }
                ).then(res =>{
                    console.log('res', res)
                })
            }catch(err){
                console.log(err)
            }
            setEditMode(false)
        }
        
    }
    const editAbout = ()=>{
        return(
            <Form>
                <Form.Group >
                    <Form.Label>Edit</Form.Label>
                    <Form.Control as="textarea" rows={3} name="profileDesc" value={profileUser.profileDesc && profileUser.profileDesc } onChange={handleChangeProfile} />
                </Form.Group>
                <div className="bio-edit-btn-wrapper">
                    <Button variant="primary" type="submit" onClick={handleDataUpdate} className="bio-edit-btn">
                        Submit
                    </Button>
                </div>
                
            </Form>
        )
    }
    const regainData = ()=>{
        const token = localStorage.getItem('session_token')
        if(token){
            jwt.verify(token, process.env.REACT_APP_JWT_SECRET, function(err, decoded) {
                if (err) {
                    getDataAsPublic()
                    console.log('err login again', err)
                    childRef.current.handleLoginModal(true)
                }else{
                    getDataAsTheUser(decoded)
                }
              });
            
        }else{
            getDataAsPublic()
        }
    }
    const getDataAsTheUser = async (decoded) =>{
        setTheUser(decoded.userData)
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const mongoCollectionUser = mongo.db("smoke-show").collection("users")
        const filter = {userId: profileUserId}
        try{
            await mongoCollectionUser.findOne(filter).then(user =>{
                        setProfileUser(user)
                        setFormattedTime(moment(profileUser.joined).local().format('MMMM Do YYYY'))
                        getTotalComments(user.userId, mongo)
                        getMyCars(user.userId, mongo)
            })
        }catch(err){
            console.log(err)
        }
        // const mongo = decoded.userData.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
        if(theUser.userId === profileUser.userId){
            setAllowEdit(true)
        }
    
    }
    
    const getDataAsPublic = async () =>{
        const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTHAPI)
        try{
            await app.logIn(credentials).then( async user =>{
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
                const mongoCollection = mongo.db("smoke-show").collection("users")

                const filter = {userId: profileUserId} 
               
                await mongoCollection.findOne(filter).then(user =>{
                    if(user === null){
                        setProfileUser({fname: 'No user data', lname: '', profileDesc: 'No user data', })
                    }else{
                        setProfileUser(user)
                        // console.log('this is profile user', profileUser)
                        // console.log('cars', profileUser.myCars)
                        if(user.joined){
                            setFormattedTime(moment(user.joined).local().format('MMMM Do YYYY'))
                        }else{
                            setFormattedTime('No data')
                        }
                        
                        getTotalComments(user.userId, mongo)
                        getMyCars(user.userId, mongo)
                    }
                    
                })
            })
        }catch(err){
            console.log(err)
        }
    }
    const getTotalComments = async (profileUserId, mongo) =>{
        
        const mongoCollectionComments = mongo.db("smoke-show").collection("comments")
        
        const filter = {userId: profileUserId}
        await mongoCollectionComments.find(filter).then(res =>{
            // setProfileUser({...profileUser, totalComments: res.length})
            setNumComments(res.length)
        })
    }
    const getMyCars = async (id, mongo) =>{
        const mongoCollection = mongo.db("smoke-show").collection("my-cars")
        
        const filter = {userId: profileUserId}
        await mongoCollection.find(filter).then( cars =>{
            setUserCars(cars)
        })
    }
    useEffect(() => {
       
        const token = localStorage.getItem('session_token')
        if(token){
            jwt.verify(token, process.env.REACT_APP_JWT_SECRET, function(err, decoded) {
                if (err) {
                    getDataAsPublic()
                    console.log('err login again', err)
                    childRef.current.handleLoginModal(true)
                }else{
                    getDataAsTheUser(decoded)
                }
              });
            
        }else{
            getDataAsPublic()
        }
   
    }, [])

    return(
        <Layout ref={childRef} userLoggedIn={userLoggedIn} userLoggedOut={userLoggedOut}>
        <Helmet>
            <meta charSet="utf-8" />
            <title>User profile page | The Smoke Show</title>
            <meta name="description" content="Place the meta description text here." />
            <meta name="robots" content="noindex, nofollow" />
            {/* <link rel="canonical" href="http://mysite.com/example" /> */}
        </Helmet>
        {showAddCar && <CreateNewCar show={showAddCar} handleClose={handleCloseAddCarModal} profileUser={profileUser} updateProfileData={updateProfileData} updateCarData={updateCarData} />}
            {showSetting && <SettingModal show={showSetting} handleShowSetting={handleShowSetting} handleCloseSetting={handleCloseSetting} profileUser={profileUser}  updateProfileData={updateProfileData} updateUserDetails={updateUserDetails}/>}
            <div className="main-wrapper">
                <div className="spacer-4rem"></div>
                <h2 className="title">User Profile</h2>
                <div className="bio-fleet-img">
                    <img
                    // sizes="(max-width: 1500px) 100vw, 1500px"
                    // srcset={`
                    // ${bioImgXs} 375w,
                    // ${bioImgS} 752w,
                    // ${bioImgM} 1040w,
                    // ${bioImgL} 1280w,
                    // ${bioImgXL} 1500w
                    // `}
                    src={profileUser.profileCover ? profileUser.profileCover : noImg}
                    alt="user selected profile image"
                     />
                </div>
                <div className="bio-content-wrapper">
                    <div className="bio-main-wrapper">
                        <div className="bio-pic">
                            <img src={profileUser.profilePic ? profileUser.profilePic : bioPic} alt="the user profile picture" />
                        </div>
                        
                        <div className="bio-title-text">
                            <h3 className="bio-name-title">{profileUser.fname && profileUser.fname} {profileUser.lname && profileUser.lname}</h3>
                            <p>{profileUser.title}</p>
                        </div>
                        {allowEdit && 
                            <Button className="bio-setting-btn" onClick={handleShowSetting}>
                                <img src={settingsIcon} alt="setting" className="setting-icon"/>
                                Settings
                            </Button>
                        }
                        
                    </div>
           
                    <Row className="bio-height-adj">
                        <Col sm={4}>
                            <div className="bio-container box-shadow-white">
                                <p className="bio-about no-m-b"><strong>About: {` ${profileUser.fname} ${profileUser.lname}`}</strong></p>
                                <div className="">
                                    <p className="bio-content bio-border">
                                        {editMode ? editAbout()
                                        : [
                                            (profileUser.profileDesc 
                                                ? <p >{profileUser.profileDesc}</p>
                                                : <p>{altData.profileDesc}</p>
                                            )
                                            ]
                                        }
                                    { !editMode && <br/> }
                                    <div className="edit-icon-wrapper" onClick={()=>{setEditMode(true)}}>
                                        {editMode ? '' : [
                                            (allowEdit && <img className="edit-icon" src={editIcon} alt="Edit about you"/>)
                                        ]}
                                    </div>
                                    </p>
                                </div>
                                
                                <Row className="bio-border pt-pb-15 bio-row-adj">
                                    <Col sm={4}>
                                        <p className="no-m-b">Joined:</p>
                                    </Col>
                                    <Col sm={8}>
                                        <p>{formattedTime ? formattedTime : 'No data'}</p>
                                    </Col>
                                </Row>
                                <Row className="bio-border pt-pb-15 bio-row-adj">
                                    <Col sm={4}>
                                        <p className="no-m-b">Total Comments:</p>
                                    </Col>
                                    <Col sm={8}>
                                        <p className="no-m-b">{numOfComments && numOfComments} comments</p>
                                    </Col>
                                </Row>
                                <Row className="bio-border pt-pb-15 bio-row-adj">
                                    <Col sm={4}>
                                        <p className="no-m-b">Fans of:</p>
                                    </Col>
                                    <Col sm={8}>
                                        <p className="no-m-b">
                                            { profileUser.fansOf &&
                                                profileUser.fansOf.map((name, i) =>{
                                                    return <span>{i > 0 && ', '}{name}</span>
                                                })
                                            }
                                        </p>
                                    </Col>
                                </Row>
                                <Row className="pt-pb-15 bio-row-adj"> 
                                    <Col sm={4}>
                                        <p className="no-m-b">Favorite Driving Song:</p>
                                    </Col>
                                    <Col sm={8}>
                                        <p className="no-m-b">Sting</p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col sm={8} className="pl-0">
                        { userCars !== undefined ?
                            userCars.map( car =>{
                               return (
                                <React.Fragment>
                                    <VehicleCard car={car} allowEdit={allowEdit} profileUser={profileUser} getMyCars={getMyCars} />
                                    <div className="spacer-2rem"></div>
                                </React.Fragment>
                               )
                            }) :
                            <React.Fragment>
                                <VehicleCard car={altCarData} allowEdit={allowEdit} />
                                <div className="spacer-2rem"></div>
                            </React.Fragment>
                        }

                            <div className="spacer-2rem"></div>
                            { allowEdit && 
                                <div style={{padding: '0 6px'}}>
                                    <Button className="btn-add-car" onClick={handleShowAddCarModal}>Add my car</Button>
                                </div>
                            }
                            <div className="spacer-2rem"></div>
                        </Col>
                        
                    </Row>
                    
                </div>
                
            </div>
        </Layout>
    )
}

export default BioPage