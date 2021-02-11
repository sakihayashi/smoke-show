import React, { useState, useEffect, useRef } from 'react'
import { Helmet } from "react-helmet"
import * as Realm from "realm-web"
import Layout from '../Layout/Layout'
import SubNav from './SubNav'

import noImg from '../../assets/global/no_image.jpg'
// import bioPic from '../../assets/temp-photos/bio/avator-male.jpg'
import editIcon from '../../assets/global/edit-icon.svg'

import SettingModal from './SettingModal'
import { Button, Row, Col, Form } from 'react-bootstrap'

import './garage.scss'
import VehicleCard from './vehicleCard'
import CreateNewCar from './CreateNewCar'
import jwt from 'jsonwebtoken'
import moment from 'moment'
// import axios from 'axios'

const Garage = (props) =>{
  
    const childRef = useRef()

    let userIdParam = props.match.params.id
    const [profileUser, setProfileUser] = useState({fname: '', lname: '', profilePic: '', profileCover: '', username: '', profileDesc: '', favSong: '', favArtist: ''})
    const [allowEdit, setAllowEdit] = useState(false)
    const [editMode, setEditMode] = useState({about: false, song: false, artist: false})
    const [formattedFans, setFormattedFans] = useState('')
    const [showSetting, setShowSetting] = useState(false);
    const [userCars, setUserCars] = useState([])
    const [showAddCar, setShowAddCar] = useState(false)
    const [numOfComments, setNumComments] = useState(null)
    const altData = {uername: 'No username yet', userId: '', profileDesc: 'No description yet.', myCars: [] }
    const [formattedTime, setFormattedTime] = useState(null)
    const altCarData = {name: 'No data yet', upgrades: 'No data yet', color: 'No data yet', wheels: 'No data yet', performance: 'No data yet', category: 'Dream car', imgUlr: noImg, favSong: 'Nodata yet', favArtist: 'No data yet'}
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
      };
    const app = new Realm.App(appConfig);
    
    const handleCloseAddCarModal = () => setShowAddCar(false)
    const handleShowAddCarModal = () => setShowAddCar(true)

    const handleChangeProfile = (e) =>{
        setProfileUser({
            ...profileUser,
            [e.target.name]: e.target.value
        })
    }
    const handleShowSetting = () =>{
        
        const token = sessionStorage.getItem('session_token')
        jwt.verify(token, process.env.REACT_APP_JWT_SECRET, function(err, decoded) {
            if (err) {
                console.log('err', err)
                
            }else{
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
            console.log('loggedin?', id)
            setAllowEdit(true)
            
        }else{
            getInfluencerData()
        }
    }
    const userLoggedOut = (id) =>{
        console.log('logged out?', id)
        if(id === userIdParam){
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
            const mongoCollection = mongodb.db(process.env.REACT_APP_REALM_DB_NAME).collection("influencers")
    
            try{
                await mongoCollection.updateOne(
                    { "userId": app.currentUser.id},
                    {
                        "$set": {
                            "profileDesc": profileUser.profileDesc,
                            "favSong": profileUser.favSong,
                            "favArtist": profileUser.favArtist
                          }
                    }
                ).then(res =>{
                    console.log('res', res)
                })
            }catch(err){
                console.log(err)
            }
            setEditMode({...editMode, about: false, song: false, artist: false})
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
    const editSong = ()=>{
        return(
            <Form>
                <Form.Group >
                    <Form.Label>Edit</Form.Label>
                    <Form.Control as="textarea" rows={3} name="favSong" value={profileUser.favSong && profileUser.favSong } onChange={handleChangeProfile} />
                </Form.Group>
                <div className="bio-edit-btn-wrapper">
                    <Button variant="primary" type="submit" onClick={handleDataUpdate} className="bio-edit-btn">
                        Submit
                    </Button>
                </div>
                
            </Form>
        )
    }
    const editArtist = ()=>{
        return(
            <Form>
                <Form.Group >
                    <Form.Label>Edit</Form.Label>
                    <Form.Control as="textarea" rows={3} name="favArtist" value={profileUser.favArtist && profileUser.favArtist } onChange={handleChangeProfile} />
                </Form.Group>
                <div className="bio-edit-btn-wrapper">
                    <Button variant="primary" type="submit" onClick={handleDataUpdate} className="bio-edit-btn">
                        Submit
                    </Button>
                </div>
                
            </Form>
        )
    }

    const getInfluencerData = async (credentials) =>{
        try{
            await app.logIn(credentials).then(async user =>{
                if(userIdParam === user.userId){
                    console.log('param matched')
                    setAllowEdit(true)
                }else{
                    console.log('param not matched')
                    setAllowEdit(false)
                }
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const collectionInfluencer = mongo.db("smoke-show").collection("influencers")
                const filter = {userId: userIdParam}
                try{
                    await collectionInfluencer.findOne(filter).then( user =>{
                        setProfileUser(user)
                        if(typeof(user.joined) == 'undefined'){
                            setFormattedTime('No data')
                        }else{
                            const formatted = moment(user.joined).local().format('MMMM Do YYYY')
                            setFormattedTime(formatted)
                        }
                        
                        if(user.fans > 999){
                            setFormattedFans(Math.sign(user.fans)*((Math.abs(user.fans)/1000).toFixed(1)) + 'k')
                        }else{
                            setFormattedFans(Math.sign(user.fans)*Math.abs(user.fans))
                        }
                        getTotalComments(mongo)
                        getMyCars(mongo)
                        return user
                    })
                }catch(err){
                    console.log(err)
                }

            })
        }catch(err){
            console.log(err)
        }
        
    }
    
    const getTotalComments = async (mongo) =>{
        
        const mongoCollectionComments = mongo.db("smoke-show").collection("comments")
        
        const filter = {userId: userIdParam}
        await mongoCollectionComments.find(filter).then(res =>{
            setNumComments(res.length)
        })
    }
    const getMyCars = async (mongo) =>{
        const mongoCollection = mongo.db("smoke-show").collection("my-cars")
        
        const filter = {userId: userIdParam}
        await mongoCollection.find(filter).then( cars =>{
            setUserCars(cars)
        })
    }
    const loginCheck = async () =>{
        const token = sessionStorage.getItem('session_token')
        if(token){
            jwt.verify(token, process.env.REACT_APP_JWT_SECRET, function(err, decoded) {
                if (err) {
                    // timeout
                    childRef.current.handleUserByParent({func: 'modal', value: true})
                    const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    getInfluencerData(credentials)
                }else{
                    const credentials = Realm.Credentials.emailPassword(decoded.userData.login.email, decoded.userData.login.password)
                    getInfluencerData(credentials)
                }
              });
            
        }else{
            const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
            getInfluencerData(credentials)
        }
    }
    useEffect(() => {
        // getDataAsCurrent()
        loginCheck()
   
    }, [])

    return(
        <Layout ref={childRef} userLoggedIn={userLoggedIn} userLoggedOut={userLoggedOut} >
        <Helmet>
            <meta charSet="utf-8" />
            <title>Influencer Garage page | The Smoke Show</title>
            <meta name="description" content="Place the meta description text here." />
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        {showAddCar && <CreateNewCar show={showAddCar} handleClose={handleCloseAddCarModal} profileUser={profileUser} updateProfileData={updateProfileData} updateCarData={updateCarData} />}
            {showSetting && <SettingModal show={showSetting} handleShowSetting={handleShowSetting} handleCloseSetting={handleCloseSetting} profileUser={profileUser}  updateProfileData={updateProfileData} updateUserDetails={updateUserDetails}/>}
            <div className="main-wrapper">
                <div className="spacer-4rem"></div>
                <SubNav influencer={profileUser} formattedFans={formattedFans} allowEdit={allowEdit} handleShowSetting={handleShowSetting} />
                {/* <div className="garage-setting-wrapper">
                    {allowEdit && 
                        <Button className="garage-setting-btn" onClick={handleShowSetting} >
                            <img src={settingsIcon} alt="setting" className="setting-icon"/>
                            Settings
                        </Button>
                    }
                </div> */}
                    
                <div className="spacer-4rem"></div>
                <h2 className="title">Influencer Garage</h2>
                {/* <div className="bio-fleet-img">
                    <img
                    src={ typeof(profileUser.profileCover) == 'undefined' || !profileUser.hasOwnProperty("profileCover") ?  noImg : profileUser.profileCover }
                    alt="user selected profile image"
                     />
                </div> */}
                <div className="spacer-2rem"></div>
                <div className="bio-content-wrapper">
                    {/* <div className="bio-main-wrapper">
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
                        
                    </div> */}
           
                    <Row className="bio-height-adj">
                        <Col sm={4}>
                            <div className="bio-container box-shadow-white">
                                <p className="bio-about no-m-b"><strong>About: {` ${profileUser.fname} ${profileUser.lname}`}</strong></p>
                                <div className="">
                                    <p className="bio-content bio-border">
                                        {editMode.about ? editAbout()
                                        : [
                                            (profileUser.profileDesc 
                                                ? <p >{profileUser.profileDesc}</p>
                                                : <p>{altData.profileDesc}</p>
                                            )
                                            ]
                                        }
                                    { !editMode.about && <br/> }
                                    <div className="edit-icon-wrapper" onClick={()=>{setEditMode({...editMode, about: true})}}>
                                        {editMode.about ? '' : [
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
                                        {editMode.song ? editSong()
                                        : [
                                            (profileUser.favSong 
                                                ? <p className="no-m-b">{profileUser.favSong}</p>
                                                : <p className="no-m-b">{altData.favSong}</p>
                                            )
                                            ]
                                        }
                                        <div className="edit-icon-wrapper" onClick={()=>{setEditMode({...editMode, song: true})}}>
                                        {editMode.song ? '' : [
                                            (allowEdit && <img className="edit-icon" src={editIcon} alt="Edit your favourite songs"/>)
                                        ]}
                                    </div>
                                    </Col>
                                </Row>
                                <Row className="pt-pb-15 bio-row-adj"> 
                                    <Col sm={4}>
                                        <p className="no-m-b">Favorite Musician:</p>
                                    </Col>
                                    <Col sm={8}>
                                    {editMode.artist ? editArtist()
                                        : [
                                            (profileUser.favArtist 
                                                ? <p className="no-m-b">{profileUser.favArtist}</p>
                                                : <p className="no-m-b">{altData.favArtist}</p>
                                            )
                                            ]
                                        }
                                        <div className="edit-icon-wrapper" onClick={()=>{setEditMode({...editMode, artist: true})}}>
                                        {editMode.artist ? '' : [
                                            (allowEdit && <img className="edit-icon" src={editIcon} alt="Edit your favourite artists"/>)
                                        ]}
                                    </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col sm={8} className="pl-0-pc">
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

export default Garage