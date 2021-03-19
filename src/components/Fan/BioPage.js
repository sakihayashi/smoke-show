import React, { useState, useEffect } from 'react'
import {Helmet} from "react-helmet"
import * as Realm from "realm-web"
import Layout from '../Layout/Layout'

import noImg from '../../assets/global/no_image.jpg'
import bioPic from '../../assets/temp-photos/bio/avator-male.jpg'
import editIcon from '../../assets/global/edit-icon.svg'
import settingsIcon from '../../assets/global/Settings-icon-white.svg'
import SettingModal from './SettingModal'
import { Button, Row, Col, Form } from 'react-bootstrap'
import './biopage.scss'
import { connect } from 'react-redux'
import VehicleCard from './vehicleCard'
import CreateNewCar from './CreateNewCar'
import jwt from 'jsonwebtoken'
import moment from 'moment'
// import axios from 'axios'

const BioPage = (props) =>{

    const [userIdParam, setUserIdParam] = useState(props.match.params.id)
    const [profileUser, setProfileUser] = useState({fname: '', lname: '', profilePic: '', profileCover: '', username: '', profileDesc: '', favSong: '', favArtist: ''})
    const [profilePic, setProfilePic] = useState(bioPic)
    const [profileCover, setProfileCover] = useState(noImg)
    const [allowEdit, setAllowEdit] = useState(false)
    const [editMode, setEditMode] = useState({about: false, song: false, artist: false})
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
                    email: decoded.userData.email
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
        }
    }
    const userLoggedOut = (id) =>{
        if(id === userIdParam){
            setAllowEdit(false)
        }
    }
    const updateProfileData = (data, key)=>{
        console.log('checkng', data)
        setProfileUser({
            ...profileUser,
            [key]: data
        })
    }
    const updatedata = async (mongo) =>{
        const collectionUser = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("users")
        const filter = {userId: profileUser.userId}
        const res = await collectionUser.findOne(filter)
        if(res){
            console.log(res)
            if(res.profileCover){
                if(res.profileCover.includes('s3.amazonaws.com/smokeshow.users')){
                    setProfileCover(res.profileCover.replace('s3.amazonaws.com/smokeshow.users', 'dwdlqiq3zg6k6.cloudfront.net'))
                }else{
                    setProfileCover(res.profileCover)
                }
            }else{
                setProfileCover(noImg)
            }
            if(res.profilePic){
                if(res.profilePic.includes('s3.amazonaws.com/smokeshow.users')){
                    setProfilePic(res.profilePic.replace('s3.amazonaws.com/smokeshow.users', 'dwdlqiq3zg6k6.cloudfront.net'))
                }else{
                    setProfilePic(res.profilePic)
                }
            }else{
                setProfilePic(bioPic)
            }
        }
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
            const mongodb = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
            const mongoCollection = mongodb.db(process.env.REACT_APP_REALM_DB_NAME).collection("users")
    
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

    const getData = async (credentials) =>{
        try{
            await app.logIn(credentials).then(async logInUser =>{
                const mongo = logInUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const collectionUser = mongo.db("smoke-show").collection("users")
                const filter = {userId: userIdParam}
                try{
                    await collectionUser.findOne(filter).then(user =>{
                            setProfileUser(user)
                            if(user.joined){
                                const formatted = moment(user.joined).local().format('MMMM Do YYYY')
                                setFormattedTime(formatted)
                            }else{
                                setFormattedTime('No data')
                            }
                            if(user.profilePic){
                                if(user.profilePic.includes('s3.amazonaws.com/smokeshow.users')){
                                    setProfilePic(user.profilePic.replace('s3.amazonaws.com/smokeshow.users', 'dwdlqiq3zg6k6.cloudfront.net'))
                                }else{
                                    setProfilePic(user.profilePic)
                                }
                            }else{
                                setProfilePic(bioPic)
                            }
                            if(user.profileCover){
                                if(user.profileCover.includes('s3.amazonaws.com/smokeshow.users')){
                                    setProfileCover(user.profileCover.replace('s3.amazonaws.com/smokeshow.users', 'dwdlqiq3zg6k6.cloudfront.net'))
                                }else{
                                    setProfileCover(user.profileCover)
                                }
                            }else{
                                setProfileCover(noImg)
                            }
                            
                            getTotalComments(mongo)
                            getMyCars(mongo)
                            return user
                    }).then(user =>{
                        if( userIdParam === logInUser.id){
                            setAllowEdit(true)
                        }else{
                            setAllowEdit(false)
                        }
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
            // setProfileUser({...profileUser, totalComments: res.length})
            setNumComments(res.length)
        })
    }
    const getMyCars = async (mongo) =>{
        const mongoCollection = mongo.db("smoke-show").collection("my-cars")
        // console.log('param', userIdParam)
        const filter = {userId: props.match.params.id}
        try {
            await mongoCollection.find(filter).then( cars =>{
                    setUserCars(cars)
            
            })
        } catch (error) {
            console.log(error)
        }
        
    }
    const loginCheck = () =>{
        const tokenUser = sessionStorage.getItem('session_user')
        let cre;
        if(tokenUser){
            jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, function(err, decoded) {
                if (err) {
                    // timeout

                    const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW)
                    cre = credentials
                }else{
                    cre = decoded.cre
                }
              });
            
        }else{
            const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW)
            cre = credentials
        }
        return cre
    }
    useEffect(() => {
        if(props.isLoggedIn){
       
            if(props.customData.userId === props.match.params.id){
                setAllowEdit(true)
            }else{
                setAllowEdit(false)
            }
        }else{
            setAllowEdit(false)

        }
    }, [props.isLoggedIn])

    useEffect(() => {
        const id = props.profilepageid
        setUserIdParam(id)
        
    }, [props.profilepageid])
    useEffect(() => {
        if(props.profilepageid){
            const credentials = loginCheck()
            getData(credentials)
        }
    }, [userIdParam])
    useEffect(() => {
        const credentials = loginCheck()
        getData(credentials)
    }, [])

    return(
        <Layout userLoggedIn={userLoggedIn} userLoggedOut={userLoggedOut} >
        <Helmet>
            <meta charSet="utf-8" />
            <title>{profileUser && profileUser.fname} profile page | The Smoke Show</title>
            <meta name="description" content="Place the meta description text here." />
            <link rel="canonical" href={`https://thesmokeshow.com/user/${profileUser.userId}`} />
        </Helmet>
        {showAddCar && <CreateNewCar show={showAddCar} handleClose={handleCloseAddCarModal} profileUser={profileUser} updateProfileData={updateProfileData} updateCarData={updateCarData} getMyCars={getMyCars} />}
            {showSetting && <SettingModal show={showSetting} handleShowSetting={handleShowSetting} handleCloseSetting={handleCloseSetting} profileUser={profileUser}  updateProfileData={updateProfileData} updateUserDetails={updateUserDetails} updatedata={updatedata}/>}
            <div className="main-wrapper">
                <div className="spacer-4rem"></div>
                <h2 className="title">{profileUser && profileUser.username} Profile</h2>
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
                    src={profileCover}
                    alt={`User ${profileUser.fname}'s cover image on The Smoke Show`}
                     />
                </div>
                <div className="bio-content-wrapper">
                    <div className="bio-main-wrapper">
                        <div className="bio-pic">
                            <img src={profilePic} alt={`User ${profileUser.fname}'s profile image on The Smoke Show`} />
                          
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
                                                    return <span>{i > 0 && ', '}{name.username}</span>
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
                                        <p className="no-m-b">Favorite Artist:</p>
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
const mapStateToProps = (state) =>{
    return{
        isLoggedIn: state.auth.isLoggedIn,
        customData: state.auth.customData,
        profilepageid: state.user.profilepageid
    }
}
export default connect(mapStateToProps)(BioPage)