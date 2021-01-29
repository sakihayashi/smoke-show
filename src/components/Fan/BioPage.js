import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import {Helmet} from "react-helmet"
import * as Realm from "realm-web"
import { connect } from 'react-redux'

import Layout from '../Layout/Layout'
import bioImgXs from '../../assets/temp-photos/bio/sample_a1n16a_c_scale,w_375.jpg'
import bioImgS from '../../assets/temp-photos/bio/sample_a1n16a_c_scale,w_752.jpg'
import bioImgM from '../../assets/temp-photos/bio/sample_a1n16a_c_scale,w_1040.jpg'
import bioImgL from '../../assets/temp-photos/bio/sample_a1n16a_c_scale,w_1280.jpg'
import bioImgXL from '../../assets/temp-photos/bio/sample_a1n16a_c_scale,w_1500.jpg'
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
    // const [userData, setUserData] = useState({about: "a photographer based in Cheshire, UK. With a background in design, I strive to create engaging imagery that stands out"})
    const childRef = useRef()
    const profileUserId = props.match.params.id
    const [theUser, setTheUser] = useState({})
    const [profileUser, setProfileUser] = useState({})
    const [allowEdit, setAllowEdit] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [showSetting, setShowSetting] = useState(false);
    const carOptions = ['Daily Driver', 'Vehicle #2', 'Dream Car']
    const [showAddCar, setShowAddCar] = useState(false)
    const [numOfComments, setNumComments] = useState(null)
    const altData = {uername: 'No username yet', userId: '', profileDesc: 'No description yet.', myCars: [] }
    const [formattedTime, setFormattedTime] = useState(null)
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        timeout: 10000, // timeout in number of milliseconds
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
        setShowSetting(true)
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
        if(id === profileUserId){
            setAllowEdit(false)
        }
    }
    // useImperativeHandle(
    //     parentRef,
    //     (id) => ({
    //         userLoggedIn(id){
    //             if(id === profileUser.userId){
    //                 setAllowEdit(true)
    //             }
    //         }
    //     }),
    // )
    const handleDataUpdate = async (e) =>{
        e.preventDefault()
        console.log('current', app.currentUser.id)
        console.log('profileuser', profileUser)
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
    const getDataAsTheUser = async (decoded) =>{
        setTheUser(decoded.userData)
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const mongoCollectionUser = mongo.db("smoke-show").collection("users")
        const filter = {userId: profileUserId}
        try{
            await mongoCollectionUser.findOne(filter).then(user =>{
                        setProfileUser(user)
                        setFormattedTime(moment(profileUser.joined).local().format('MMMM Do YYYY'))
                        console.log('user', profileUser.myCars)
                        getTotalComments(user.userId, mongo)
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
        console.log('is this is runnig')
        const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTHAPI)
        try{
            await app.logIn(credentials).then( async user =>{
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
                const mongoCollection = mongo.db("smoke-show").collection("users")
                // const mongoCollectionComments = mongo.db("smoke-show").collection("comments")

                const filter = {userId: profileUserId} 
                await mongoCollection.findOne(filter).then(user =>{
                    setProfileUser(user)
                    console.log('this is profile user', profileUser)
                    console.log('cars', profileUser.myCars)
                    setFormattedTime(moment(user.joined).local().format('MMMM Do YYYY'))
                    getTotalComments(user.userId, mongo)
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
            console.log('check', profileUser)
        })
    }
    useEffect(() => {
       
        const token = localStorage.getItem('session_token')
        console.log('tokn', token)
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
            <title>{profileUser.fname} User profile page | The Smoke Show</title>
            <meta name="description" content="Place the meta description text here." />
            <meta name="robots" content="noindex, follow" />
            {/* <link rel="canonical" href="http://mysite.com/example" /> */}
        </Helmet>
        {showAddCar && <CreateNewCar show={showAddCar} handleClose={handleCloseAddCarModal}  />}
            {showSetting && <SettingModal show={showSetting} handleShowSetting={handleShowSetting} handleCloseSetting={handleCloseSetting} />}
            <div className="main-wrapper">
                <div className="spacer-4rem"></div>
                <h2 className="title">User Profile</h2>
                <div className="bio-fleet-img">
                    <img
                    sizes="(max-width: 1500px) 100vw, 1500px"
                    srcset={`
                    ${bioImgXs} 375w,
                    ${bioImgS} 752w,
                    ${bioImgM} 1040w,
                    ${bioImgL} 1280w,
                    ${bioImgXL} 1500w
                    `}
                    src={bioImgXL}
                    alt="user selected fleet"

                     />
                </div>
                <div className="bio-content-wrapper">
                    <div className="bio-main-wrapper">
                        <div className="bio-pic">
                            <img src={bioPic} alt="the user profile picture" />
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
                                        <p>{formattedTime}</p>
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
                        {console.log('car', profileUser.myCars !== undefined)}
                        { profileUser.myCars !== undefined &&
                            profileUser.myCars.map( car =>{
                               return (
                                <React.Fragment>
                                    <VehicleCard car={car} allowEdit={allowEdit}/>
                                    <div className="spacer-2rem"></div>
                                </React.Fragment>
                               )
                            })
                        }
                            <div className="spacer-2rem"></div>
                            <div style={{padding: '0 6px'}}>
                                <Button className="btn-add-car" onClick={handleShowAddCarModal}>Add my car</Button>
                            </div>
                            
                            <div className="spacer-2rem"></div>
                        </Col>
                        
                    </Row>
                    
                </div>
                
            </div>
        </Layout>
    )
}

export default BioPage