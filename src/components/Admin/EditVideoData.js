import React, { useState, Fragment, useEffect } from 'react'
import * as Realm from "realm-web"
import Helmet from 'react-helmet'
import { Container, Row, Col, Form, Pagination, Button } from 'react-bootstrap'
import jwt from 'jsonwebtoken'

const EditVideoData = () =>{
    const [activePag, setActivePag] = useState(0)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userObj, setUserObj] = useState({email: '', password: ''})
    const app = new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID })
    const [allVideos, setAllVideos] = useState([])
    const [message, setMessage] = useState('')
    const [carDataId, setCarDataId] = useState('')
    const [editVideoId, setEditVideoId] = useState('')
    const [editMode, setEditMode] = useState(false)
    const maxAgeTest = 1 * 60 * 60
    const [items, setItems] = useState([])

    const handlePagNum = (num) =>{
        setActivePag(num)
    }
    const chunk_size = 15
    
    const handleChange = (e) =>{
        setUserObj({
            ...userObj,
            [e.target.name]: e.target.value
        })
    }

    const videoEmbedURL = 'https://www.youtube.com/embed/'

    const chunkArray = (allVideos) =>{
        
        let index = 0;
        let arrayLength = allVideos.length;
        let tempArray = [];
        let myChunk
        
        for (index = 0; index < arrayLength; index += chunk_size) {
            myChunk = allVideos.slice(index, index+chunk_size);
            // Do something if you want with the group
            tempArray.push(myChunk);
        }

        return tempArray;
    }
    
    const handleSubmitLogin = async (e) =>{
        e.preventDefault()
        const emailLowerCase = userObj.email.toLowerCase()
        const credentials = Realm.Credentials.emailPassword(emailLowerCase, userObj.password)
        try{
            app.logIn(credentials).then(async user =>{
                setIsLoggedIn(true)
                const customData = user.customData
                const token = jwt.sign({ userData: customData }, process.env.REACT_APP_JWT_SECRET, {expiresIn: maxAgeTest})
                const tokenCredentials = jwt.sign({ cre: credentials }, process.env.REACT_APP_JWT_SECRET, {expiresIn: maxAgeTest})
                sessionStorage.setItem('session_token', token)
                sessionStorage.setItem('session_user', tokenCredentials)
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
                const mongoCollection = mongo.db("smoke-show").collection("youtube-videos")
                const filter = {channelId: 'UCdOXRB936PKSwx0J7SgF6SQ'}
                await mongoCollection.find(filter).then( videos =>{
                    console.log(videos)
                    const chunkedVideos = chunkArray(videos)
                    setAllVideos(chunkedVideos)
                    
                })
            })
        }catch(err){
            console.log(err)
            setMessage('login fail')
        }
        
    }

    const loginDiv =
    <Container style={{alignItems: 'center', justifyContent: 'center', marginTop: '5rem'}}>
        <Form onSubmit={handleSubmitLogin}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleChange}/>
                <Form.Text className="text-muted">
                </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={handleChange} name="password" />
            </Form.Group>
            <br />
            <Button variant="primary" type="submit">
                Log in
            </Button>
        </Form>
    </Container>
    
    const handleChangeCarData = (e) =>{
        setCarDataId(e.target.value)
        setEditVideoId(e.target.name)
    }
    const handleDataUpdate = async (e) =>{
        e.preventDefault()
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
        const collectionYoutube = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("youtube-videos")
        let str = carDataId
        str = str.replace(/\s/g, '')
        setCarDataId(str)
        try{
            await collectionYoutube.updateOne(
                { "videoId": editVideoId},
                { "$set": { "carDataId": carDataId } },
                { upsert: true}
            ).then( async res =>{
                console.log(res)
                // e.target.reset()
                setEditVideoId('')
                setCarDataId('')
                setEditMode(false)
                const filter = {channelId: 'UCdOXRB936PKSwx0J7SgF6SQ'}
                await collectionYoutube.find(filter).then( videos =>{
                    const chunkedVideos = chunkArray(videos)
                    setAllVideos(chunkedVideos)
                })
            })
        }catch(err){
            console.log(err)
        }
        
    }
    const editCarData = (video)=>{
        // setEditVideoId(video.videoId)
        return(
            <Form>
                <Form.Group >
                    <Form.Label>Edit car data ID</Form.Label>
                    <Form.Control as="textarea" rows={2} name={video.videoId} value={allVideos[activePag].carDataId && allVideos[activePag].carDataId } onChange={handleChangeCarData} />
                </Form.Group>
                
                <div className="bio-edit-btn-wrapper">
                    <Button variant="primary" type="submit" onClick={handleDataUpdate} className="bio-edit-btn">
                        Submit
                    </Button>
                </div>
                
            </Form>
        )
    }
    const makePagination = (num) =>{
        let temp = []
        for (let i = 0; i < num; i++) {
            temp.push(
                <Pagination.Item key={i} active={ i === activePag} onClick={()=>{handlePagNum(i)}}>
                {i}
                </Pagination.Item>,
            );
            // console.log('loop', temp)
            if(i == num -1){
                setItems(temp)
            }
        }
        
    }
    const queryData = async () =>{
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
        const collectionYoutube = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("youtube-videos")
        const filter = {channelId: 'UCdOXRB936PKSwx0J7SgF6SQ'}
        await collectionYoutube.find(filter).then( videos =>{
            makePagination(Math.ceil(videos.length/chunk_size))
            const chunkedVideos = chunkArray(videos)
            setAllVideos(chunkedVideos)
        })
    }
    useEffect(() => {
        const tokenUser = sessionStorage.getItem('session_user')
        if(tokenUser){
            setIsLoggedIn(true)
            queryData()
        }else{
            setIsLoggedIn(false)
        }

    }, [])
    return(
        <Fragment>
            <Helmet>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            {isLoggedIn ? 
            <Container>
                <h1>Edit video data</h1>
                <center><Pagination>{items}</Pagination></center>
                <hr />
                <Row>
                {console.log('array 0', allVideos[0])}
                { allVideos[activePag] && 
                    allVideos[activePag].map(video =>{
                        return(
                            <Col style={{marginBottom: '2rem'}}>
                                <iframe src={videoEmbedURL + video.videoId}
                                    frameBorder='0'
                                    allow='autoplay; encrypted-media'
                                    allowFullScreen
                                    title='video'
                                />
                                <h3>{video.snippet.title}</h3>
                                <p>Date: {video.snippet.publishedAt}</p>
                                <p>Youtube videoId: {video.videoId}</p>
                                {video.carDataId ? 
                                <div>
                                <p>Car data ID: {video.carDataId ? video.carDataId : 'No data'}</p>
                                 {/* <Button onClick={()=>setEditMode(true)}>Edit</Button> */}
                                
                                </div>
                                
                                 :
                                editCarData(video)
                                }
                                {/* {editMode && editCarData(video)} */}
                            </Col>
                        )
                        
                        
                    })
                }
            
                </Row>
            </Container>
            : loginDiv}
        </Fragment>
    )
}

export default EditVideoData