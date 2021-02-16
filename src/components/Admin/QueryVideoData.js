import React, { useEffect, useState  } from 'react'
import {Helmet} from "react-helmet"
import { Row, Col, Form, FormControl } from 'react-bootstrap'
import * as Realm from "realm-web"
import { youtubeAPI } from '../../utils/youtubeAPI'


const QueryVideoData = () =>{
    // const [videoData, setVideoData] = useState([])
    // const EddieXChannelId = 'UCdOXRB936PKSwx0J7SgF6SQ'
    const KirkChannelId = 'UCXPVB7s1TJTE0WjDpakGp5Q'
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
        };
    const app = new Realm.App(appConfig)

    const handleVideoSearch = async e =>{
        e.preventDefault()
        await youtubeAPI.get('/search', {
            params: {
                // q: searchKeyword,
                channelId: KirkChannelId,
                publishedAfter: '2021-02-01T00:00:00Z',
                publishedBefore: '2021-02-15T00:00:00Z',
                order: 'date'
            }
        }).then(async youtubeObj =>{
            console.log('res from youtube', youtubeObj)
            // setTitleStr("EddieX " + searchKeyword)
            const formatted = youtubeObj.data.items.map(video =>{

                video.videoId = video.id.videoId
                // video.userId = '60230361f63ff517d4fdad14'
                video.userId = '602303890ff2832f7d19a2af'
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
    return(
        <div>
        <h1>query youtube data</h1>
            <div></div>
            <center>
                <button onClick={handleVideoSearch}>Click me</button>
            </center>
            
        </div>
    )
}

export default QueryVideoData