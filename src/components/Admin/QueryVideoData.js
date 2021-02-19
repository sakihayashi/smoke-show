import React, { useEffect, useState  } from 'react'
import {Helmet} from "react-helmet"
import { Button } from 'react-bootstrap'
import * as Realm from "realm-web"
import { youtubeAPI } from '../../utils/youtubeAPI'


const QueryVideoData = () =>{
    // const [videoData, setVideoData] = useState([])
    const EddieXChannelId = 'UCdOXRB936PKSwx0J7SgF6SQ'
    const EddiXuserId = '60230361f63ff517d4fdad14'
    const KirkUserId = '602303890ff2832f7d19a2af'
    const KirkChannelId = 'UCXPVB7s1TJTE0WjDpakGp5Q'
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
        };
    const app = new Realm.App(appConfig)

    const handleVideoSearch = async e =>{
        e.preventDefault()
        //last date query Feb 15th 2021
        //last day query for Eddie was Feb 18th 2021
        await youtubeAPI.get('/search', {
            params: {
                // q: searchKeyword,
                channelId: KirkChannelId,
                publishedAfter: '2021-02-13T00:00:00Z',
                publishedBefore: '2021-02-19T00:00:00Z',
                order: 'date'
            }
        }).then(async youtubeObj =>{
            console.log('res from youtube', youtubeObj)
            // setTitleStr("EddieX " + searchKeyword)
            const formatted = youtubeObj.data.items.map(video =>{

                video.videoId = video.id.videoId
                video.userId = KirkUserId
                video.channelId = KirkChannelId
                delete video.kind
                delete video.etag
                delete video.id
                return video
            })
            const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
            const collection = mongo.db("smoke-show").collection("youtube-videos")
            const result = await collection.insertMany(formatted)
            console.log(result)
        })
    }
    const updateLatest =async ()=>{
        const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
        try{
            await app.logIn(credentials).then( async user =>{
                const filter = {userId: KirkUserId}
                const numberOfVideos = 5
                const options = {sort: {"snippet.publishedAt": -1}, limit: numberOfVideos}
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const collection = mongo.db("smoke-show").collection("youtube-videos")
                await collection.find(filter, options).then(videos=>{
                    console.log('video', videos)
                    var tmp = new Array();
                    for (let i = 0; i < numberOfVideos; i++) {
                        tmp[i] = setInterval(async ()=> {
                            try{
                                await youtubeAPI.get('/videos', {
                                    params: {
                                        id: videos[i].videoId,
                                    }
                                }).then(async videoObj =>{
                                    console.log('obj', videoObj)
                                    console.log('desc', videoObj.data.items[0].snippet.description)
                                    try{
                                        await collection.updateOne(
                                            { videoId: videos[i].videoId },
                                            { $set: { 'snippet.description': videoObj.data.items[0].snippet.description }},
                                            { upsert: false}
                                        )
                                    }catch(err){
                                        console.log(err)
                                        clearInterval(tmp[i])
                                    }
                                    
                                    clearInterval(tmp[i])
                                })
                            }catch(err){
                                console.log(err)
                                clearInterval(tmp[i])
                            }
                     
                        }, 3000);
                    }
                })
            })
        }catch(err){
            console.log(err)
        }
        
    }
    const handleUpdateDesc = async (e) =>{
        const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
        try{
            await app.logIn(credentials).then(async user =>{
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const collection = mongo.db("smoke-show").collection("youtube-videos")

                const filter = {userId: EddiXuserId}
                // {"snippet.publishedAt": -1}
                await collection.find(filter).then(videos =>{
                    console.log('videos', videos)
                    var tmp = new Array();
                    var v = new Array();
                    for (let i = 144; i < 146; i++) {
                        // var j = 0;
                        tmp[i] = setInterval(async ()=> {
                            try{
                                await youtubeAPI.get('/videos', {
                                    params: {
                                        id: videos[i].videoId,
                                    }
                                }).then(async videoObj =>{
                                    console.log('obj', videoObj)
                                    console.log('desc', videoObj.data.items[0].snippet.description)
                                    try{
                                        await collection.updateOne(
                                            { videoId: videos[i].videoId },
                                            { $set: { 'snippet.description': videoObj.data.items[0].snippet.description }},
                                            { upsert: false}
                                        )
                                    }catch(err){
                                        console.log(err)
                                        clearInterval(tmp[i])
                                    }
                                    
                                    clearInterval(tmp[i])
                                })
                            }catch(err){
                                console.log(err)
                                clearInterval(tmp[i])
                            }
                     
                        }, 3000);
                    }
                })
            })
        }catch(err){
            console.log(err)
        }
      
    }
    return(
        <div>
        <h1>query youtube data</h1>
            <div></div>
            <center>
                {/* <Button onClick={handleVideoSearch}>Query data</Button> */}
                {/* <Button onClick={handleUpdateDesc}>Click me to update description</Button> */}
                {/* <Button onClick={updateLatest}>updateLatest</Button> */}
            </center>
            
        </div>
    )
}

export default QueryVideoData