import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet"
import * as Realm from "realm-web"
import Layout from '../Layout/Layout'
import { connect } from 'react-redux'
import noImg from '../../assets/global/no_image.jpg'
import editIcon from '../../assets/global/edit-icon.svg'
import { Button, Row, Col, Form } from 'react-bootstrap'
import { attachMsg, logOutUser, openLoginModal } from '../../store/actions/authActions'
import './garage.scss'

import jwt from 'jsonwebtoken'
import moment from 'moment'
import { getInfluencer }from '../../store/actions/influencerActions'
import loadable from '@loadable/component'

const SettingModal = loadable(() => import('./SettingModal'))
const SubNav = loadable(() => import('./SubNav'))
const VehicleCard = loadable(() => import('./vehicleCard'))
const CreateNewCar = loadable(() => import('./CreateNewCar'))

const Garage = (props) =>{
    let today = new Date()
    const timeISO = today.toISOString()
    let published = new Date('2021-03-01')
    const publishedISO = published.toISOString()
    const slug = 'garage'
    let userIdParam;
    const name = props.match.params.username
    if(name === 'EddieX'){
        userIdParam = '60230361f63ff517d4fdad14'
    }else if(name === 'Lexurious-Fleet'){
        userIdParam = '602303890ff2832f7d19a2af'
    }
    const [profileUser, setProfileUser] = useState({fname: '', lname: '', profilePic: '', profileCover: '', username: '', profileDesc: '', favSong: '', favArtist: ''})
    const [allowEdit, setAllowEdit] = useState(false)
    const [editMode, setEditMode] = useState({about: false, song: false, artist: false})
    // const [formattedFans, setFormattedFans] = useState('')
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
                if(userIdParam === user.id){
                    console.log('param matched')
                    setAllowEdit(true)
                }else{
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
        const tokenUser = sessionStorage.getItem('session_user')
        if(token){
            jwt.verify(token, process.env.REACT_APP_JWT_SECRET, function(err, decoded) {
                if (err) {
                    console.log('time out')
                    // timeout
                    const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    props.logOutUser()
                    props.openLoginModal(true)
                    getInfluencerData(credentials)
                }else{
                    console.log('logged in')
                    const credentials = jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET)
                    getInfluencerData(credentials.cre)
                    if(decoded.userData.userId === userIdParam){
                        setAllowEdit(true)
                    }else{setAllowEdit(false)}
                }
              });
            
        }else{
            console.log('no token')
            const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
            getInfluencerData(credentials)
        }
    }
    useEffect(() => {
        if(props.customData.userId === userIdParam){
            setAllowEdit(true)
        }else{
            setAllowEdit(false)
        }
    }, [props.customData])

    useEffect(() => {
        // getDataAsCurrent()
        loginCheck()
        props.getInfluencer(userIdParam)
    }, [])

    return(
        <Layout   >
        <Helmet>
            <meta charSet="utf-8" />
            <title>Influencer Garage page | The Smoke Show</title>
            <meta name="description" content={`An Influencer + car Vlogger ${name} profile page on The Smoke Show. Check out ${name}'s garage, dream cars and more information here`} />
            <link rel="canonical" href={`https://thesmokeshow.com/${name}/${slug}`} />
            <script type="application/ld+json">
            {`
                    {
                        "@context": "http://schema.org",
                        "@graph": [{"@type":"WebSite","@id":"https://thesmokeshow.com/#website",
                        "url":"https://thesmokeshow.com/",
                        "name":"The Smoke Show",
                        "description":"The Smoke Show is a home for auto fans, built by auto fans. The best place to watch Car Vloggers and find all Car Info. Learn all about giveaways and buy swag!",
                        "potentialAction":[{"@type":"SearchAction","target":"https://thesmokeshow.com/search?s={search_term_string}","query-input":"required name=search_term_string"}],
                        "inLanguage":"en"},
                        {"@type": "WebPage",
                        "@id": "https://thesmokeshow.com/influencer/${name}/${slug}/#webpage", "url": "https://thesmokeshow.com/influencer/influencer/${name}/${slug}/", "name": "Influencer + Vlogger ${name}'s Garage page","isPartOf":{"@id":"https://thesmokeshow.com/#website"}, "datePublished": "${publishedISO}", "dateModified": "${timeISO}", "description": "An Influencer + Vlogger ${name} profile page on The Smoke Show. Check out ${name}'s garage, dream cars and more information here.", "breadcrumb":{"@id":"https://thesmokeshow.com/influencer/${name}/${slug}/#breadcrumb"},"inLanguage":"en","potentialAction":[{"@type":"ReadAction","target":["https://thesmokeshow.com/influencer/${name}/${slug}/"]}]},
                        {"@type":"BreadcrumbList","@id":"https://thesmokeshow.com/#breadcrumb",
                        "itemListElement":[{
                            "@type":"ListItem","position":1,
                            "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/","url":"https://thesmokeshow.com/","name":"Home"}
                            },
                            {
                                "@type":"ListItem",
                                "position":2,
                                "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/influencers/","url":"https://thesmokeshow.com/influencers/","name":"Car Influencers and Vloggers"}
                            },
                            {
                                "@type":"ListItem",
                                "position":3,
                                "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/influencers/${name}/","url":"https://thesmokeshow.com/influencers/${name}/","name":"Car Influencer ${name}'s featured page"}
                            },
                            {
                                "@type":"ListItem",
                                "position":4,
                                "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/influencers/${name}/${slug}","url":"https://thesmokeshow.com/influencers/${name}//${slug}","name":"All videos from car Influencer + Vlogger ${name}"}
                            }
                            ]}
                        ]
                    }
                `}
        </script>
        </Helmet>
        {showAddCar && <CreateNewCar show={showAddCar} handleClose={handleCloseAddCarModal} profileUser={profileUser} updateProfileData={updateProfileData} updateCarData={updateCarData} />}
            {showSetting && <SettingModal show={showSetting} handleShowSetting={handleShowSetting} handleCloseSetting={handleCloseSetting} profileUser={profileUser}  updateProfileData={updateProfileData} updateUserDetails={updateUserDetails}/>}
            <div className="main-wrapper">
                <div className="spacer-4rem"></div>
                <SubNav influencer={profileUser} formattedFans={props.formattedFans} allowEdit={allowEdit} handleShowSetting={handleShowSetting} />
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
const mapDispatchToProps = (dispatch) =>{
    return{
        openLoginModal: (state) => dispatch(openLoginModal(state)),
        attachMsg: (msg)=> dispatch(attachMsg(msg)),
        logOutUser: ()=>dispatch(logOutUser()),
        getInfluencer: (id)=> dispatch(getInfluencer(id))
    }
}
const mapStateToProps = (state) =>{
    return{
        customData: state.auth.customData,
        influencerObj: state.influ.influencerObj,
        formattedFans: state.influ.formattedFans
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Garage)