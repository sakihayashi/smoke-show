import React, { useState, useEffect } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import * as Realm from "realm-web"
import { youtubeAPI } from '../../utils/youtubeAPI'
import {Helmet} from "react-helmet"
import jwt from 'jsonwebtoken'
import {logOutUser} from '../../store/actions/authActions'
import { connect } from 'react-redux'

import AdminLoginDiv from './AdminLoginDiv'

const QueryVideoData = (props) =>{
    const [carObj, setCarObj] = useState({id: '', name: ''})
    const [userObj, setUserObj] = useState({email: '', password: ''})
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [msg, setMsg] = useState('')
    //last query data Feb 20 2021 for both Kirk and Eddie

    // const [videoData, setVideoData] = useState([])
    const EddieXChannelId = 'UCdOXRB936PKSwx0J7SgF6SQ'
    const EddiXuserId = '60230361f63ff517d4fdad14'
    const KirkUserId = '602303890ff2832f7d19a2af'
    const KirkChannelId = 'UCXPVB7s1TJTE0WjDpakGp5Q'

    const maxAgeTest = 1 * 60 * 60
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
        };
    const app = new Realm.App(appConfig)
    const changeUserObj = (e) =>{
        setUserObj({
            ...userObj,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmitLogin = async (e) =>{
        setMsg('')
        e.preventDefault()
        const emailLowerCase = userObj.email.toLowerCase()
        const credentials = Realm.Credentials.emailPassword(emailLowerCase, userObj.password)
        try{
            app.logIn(credentials).then(async user =>{
                if(app.currentUser.id === user.id){
                    console.log('user updated')
                }else{
                    console.log('user is not updated')
                }
                setIsLoggedIn(true)
                const customData = user.customData
                const token = jwt.sign({ userData: customData }, process.env.REACT_APP_JWT_SECRET, {expiresIn: maxAgeTest})
                const tokenCredentials = jwt.sign({ cre: credentials }, process.env.REACT_APP_JWT_SECRET, {expiresIn: maxAgeTest})
                sessionStorage.setItem('session_token', token)
                sessionStorage.setItem('session_user', tokenCredentials)
      
            })
        }catch(err){
            console.log(err)
            setMsg('login fail')
        }
        
    }

    // const handleVideoSearch = async e =>{
    //     e.preventDefault()

    //     await youtubeAPI.get('/search', {
    //         params: {
    //             // q: searchKeyword,
    //             channelId: KirkChannelId,
    //             publishedAfter: '2021-02-21T00:00:00Z',
    //             publishedBefore: '2021-02-23T23:59:59Z',
    //             order: 'date'
    //         }
    //     }).then(async youtubeObj =>{
    //         console.log('res from youtube', youtubeObj)
    //         // setTitleStr("EddieX " + searchKeyword)
    //         const formatted = youtubeObj.data.items.map(video =>{

    //             video.videoId = video.id.videoId
    //             video.userId = KirkUserId
    //             video.channelId = KirkChannelId
    //             delete video.kind
    //             delete video.etag
    //             delete video.id
    //             return video
    //         })
    //         const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
    //         const collection = mongo.db("smoke-show").collection("youtube-videos")
    //         const result = await collection.insertMany(formatted)
    //         console.log(result)
    //     })
    // }

    // const updateLatest =async ()=>{
    //     const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
        
    //     try{
    //         await app.logIn(credentials).then( async user =>{
    //             const filter = {userId: KirkUserId}
    //             const numberOfVideos = 5
    //             const options = {sort: {"snippet.publishedAt": -1}, limit: numberOfVideos}
    //             const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
    //             const collection = mongo.db("smoke-show").collection("youtube-videos")
    //             await collection.find(filter, options).then(videos=>{
    //                 console.log('video', videos)
    //                 var tmp = new Array();
    //                 for (let i = 0; i < numberOfVideos; i++) {
    //                     tmp[i] = setInterval(async ()=> {
    //                         try{
    //                             await youtubeAPI.get('/videos', {
    //                                 params: {
    //                                     id: videos[i].videoId,
    //                                 }
    //                             }).then(async videoObj =>{
    //                                 console.log('obj', videoObj)
    //                                 console.log('desc', videoObj.data.items[0].snippet.description)
    //                                 try{
    //                                     await collection.updateOne(
    //                                         { videoId: videos[i].videoId },
    //                                         { $set: { 'snippet.description': videoObj.data.items[0].snippet.description }},
    //                                         { upsert: false}
    //                                     )
    //                                 }catch(err){
    //                                     console.log(err)
    //                                     clearInterval(tmp[i])
    //                                 }
                                    
    //                                 clearInterval(tmp[i])
    //                             })
    //                         }catch(err){
    //                             console.log(err)
    //                             clearInterval(tmp[i])
    //                         }
                     
    //                     }, 3000);
    //                 }
    //             })
    //         })
    //     }catch(err){
    //         console.log(err)
    //     }
        
    // }

    // const handleUpdateDesc = async (e) =>{
    //     const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
    //     try{
    //         await app.logIn(credentials).then(async user =>{
    //             const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
    //             const collection = mongo.db("smoke-show").collection("youtube-videos")

    //             const filter = {userId: EddiXuserId}
    //             // {"snippet.publishedAt": -1}
    //             await collection.find(filter).then(videos =>{
    //                 console.log('videos', videos)
    //                 var tmp = new Array();
    //                 var v = new Array();
    //                 for (let i = 144; i < 146; i++) {
    //                     // var j = 0;
    //                     tmp[i] = setInterval(async ()=> {
    //                         try{
    //                             await youtubeAPI.get('/videos', {
    //                                 params: {
    //                                     id: videos[i].videoId,
    //                                 }
    //                             }).then(async videoObj =>{
    //                                 console.log('obj', videoObj)
    //                                 console.log('desc', videoObj.data.items[0].snippet.description)
    //                                 try{
    //                                     await collection.updateOne(
    //                                         { videoId: videos[i].videoId },
    //                                         { $set: { 'snippet.description': videoObj.data.items[0].snippet.description }},
    //                                         { upsert: false}
    //                                     )
    //                                 }catch(err){
    //                                     console.log(err)
    //                                     clearInterval(tmp[i])
    //                                 }
                                    
    //                                 clearInterval(tmp[i])
    //                             })
    //                         }catch(err){
    //                             console.log(err)
    //                             clearInterval(tmp[i])
    //                         }
                     
    //                     }, 3000);
    //                 }
    //             })
    //         })
    //     }catch(err){
    //         console.log(err)
    //     }
      
    // }

    // const handleCheckVideoId =async ()=>{
    //     const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
    //     try{
    //         await app.logIn(credentials).then(user=>{
    //             const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
    //             const collection = mongo.db("smoke-show").collection("youtube-videos")
    //             let tempArr = []
    //             const filter = {userId: KirkUserId}
    //             collection.find(filter).then(videos =>{
    //                 videos.map(video =>{
    //                     tempArr.push(video.videoId)
    //                 })
    //                 return tempArr
    //             }).then(async arr =>{
    //                 console.log('all videos: ', arr)
    //                 const collectionTemp = mongo.db("smoke-show").collection("cars-data-analysis")
    //                 const allIds =  {allVideoIds: arr}
    //                 const res = await collectionTemp.insertOne(allIds)
    //                 console.log(res)
    //             })
    //         })
    //     }catch(err){
    //         console.log(err)
    //     }
    // }
    const checkYoutubeId = async() =>{
        let tempArr = []
        await youtubeAPI.get('/search', {
            params: {
                channelId: KirkChannelId,
                publishedAfter: '2021-01-01T00:00:00Z',
                publishedBefore: '2021-02-20T23:59:59Z',
                order: 'date'
            }
        }).then(async youtubeObj =>{
            console.log('res from youtube', youtubeObj)
            youtubeObj.data.items.map(video =>{
                tempArr.push(video.id.videoId)
            })  
            return tempArr
            
        }).then( async arr =>{
            const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
            const collection = mongo.db("smoke-show").collection("cars-data-analysis")
            const youtubeIds = {allVideoIds: arr, source: 'youtube'}
            const result = await collection.insertOne(youtubeIds)
            // const result = await collection.updateOne(
            //     {source: 'youtube'},
            //     { $push: {allVideoIds: { $each: arr }}}
            // )
            console.log(result)
        })
    }
    const filterArray = (arr1, arr2) => {
        const filtered = arr1.filter(el => {
            console.log('doing?', arr2.indexOf(el) === -1)
           return arr2.indexOf(el) === -1;
        });
        return filtered;
     };
    // const checkMissing = async () =>{
    //     const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
    //     const collection = mongo.db("smoke-show").collection("cars-data-analysis")
    //     let tempArr = []
    //     const filterSmoke = {source: 'smokeShow'}
    //     const filterYoutube = {source: 'youtube'}
    //     const smokeShow = await collection.findOne(filterSmoke)
    //     const youtube = await collection.findOne(filterYoutube)
       
    //      const result = filterArray(youtube.allVideoIds, smokeShow.allVideoIds)
    //      console.log(result);
    // }
    const addMissing = async () =>{
        setMsg('')
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionVideos = mongo.db("smoke-show").collection("youtube-videos")
        const filter = {videoId: carObj.id}
        try {
            await collectionVideos.findOne(filter).then( res =>{
                console.log('res', res)
                if(res){
                    setMsg('This videoId is in DB already.')
                    return
                }else{
                    console.log('running?')
                    let influencer = {userId: '', channelId: ''}
                    if(carObj.name === 'EddieX'){
                        influencer.userId = EddiXuserId
                        influencer.channelId = EddieXChannelId
                        return influencer
                    }else if(carObj.name === 'Kirk'){
                        influencer.userId = KirkUserId
                        influencer.channelId = KirkChannelId
                        return influencer
                    }
                }
                
            }).then(async influencer =>{
                await youtubeAPI.get('/videos', {
                    params: {
                        id: carObj.id
                    }
                }).then(async res =>{
                    const youtubeData = res.data.items[0]
                    const formatted = {
                        videoId: carObj.id,
                        userId: influencer.userId,
                        channelId: influencer.channelId,
                        snippet: {
                            publishedAt: youtubeData.snippet.publishedAt,
                            title:  youtubeData.snippet.title,
                            description: youtubeData.snippet.description,
                            thumbnails: youtubeData.snippet.thumbnails,
                            channelTitle: youtubeData.snippet.channelTitle,
                            liveBroadcastContent: youtubeData.snippet.liveBroadcastContent
                        }            
                    }
                    // const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                    // const collection = mongo.db("smoke-show").collection("youtube-videos")
                    const result = await collectionVideos.insertOne(formatted)
                    console.log(result)
                    setMsg('Success!')
                })
            })
        } catch (error) {
            console.log(error)
            // setMsg('error!')
        }
        
        
    }
    const handleChange = (e) =>{
        setCarObj({
            ...carObj,
            [e.target.name]: e.target.value
        })
        console.log(carObj)
    }
    const handleLogout = () =>{
        props.logOutUser()
        setIsLoggedIn(false)
    }
    useEffect(() => {
        const tokenUser = sessionStorage.getItem('session_user')
        if(tokenUser){
            setIsLoggedIn(true)
        }else{
            setIsLoggedIn(false)
        }

    }, [])

    return(
        <div>
        <Helmet>
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div style={{marginTop: '4rem'}}></div>
        <center><h1>query youtube data</h1></center>

        <center style={{maxWidth: '600px', margin: '0 auto'}}>
            { isLoggedIn ?
            
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Video ID</Form.Label>
                    <Form.Control type="text" name="id" placeholder="Enter youtube video ID" onChange={handleChange}/>
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <br/><br/>
                <Form.Control as="select" name="name" onChange={handleChange}>
                    <option>Select an influencer</option>
                    <option>EddieX</option>
                    <option>Kirk</option>
                </Form.Control>
                {/* <Button variant="primary" type="submit">
                    Submit
                </Button> */}<br/><br/>
                {msg && <Alert variant="danger">{msg}</Alert>}
                
                <Button onClick={addMissing}>Add data</Button>
                <br/><br/><br/><br/>
                <Button onClick={handleLogout}>Logout</Button>
            </Form>
            :
            <AdminLoginDiv handleSubmitLogin={handleSubmitLogin} handleChange={changeUserObj} msg={msg} />
            }
                {/* <Button onClick={handleVideoSearch}>Query data</Button> */}
                {/* <Button onClick={handleUpdateDesc}>Click me to update description</Button> */}
                {/* <Button onClick={updateLatest}>updateLatest</Button> */}
                {/* <Button onClick={checkYoutubeId}>Check all videoId in youtube</Button> */}
                {/* <Button onClick={handleCheckVideoId}>Check video ids in DB</Button> */}
                {/* <Button onClick={checkMissing}>filter arrays</Button> */}
                
            </center>
            
        </div>
    )
}
const mapDispatchToProps = (dispatch) =>{
    return{
        logOutUser: () => dispatch(logOutUser())
    }
}
export default connect(null, mapDispatchToProps)(QueryVideoData)

