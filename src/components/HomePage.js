import React, { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import datacsv from '../assets/car-data.csv'
import * as d3 from 'd3'
// import * as Papa from 'papaparse'
import { youtubeAPI } from '../utils/youtubeAPI'


const HomePage = () =>{
    const [carData, setCarData] = useState([])
    const [video1Desc, setVideo1Desc] = useState()
    const [video2Desc, setVideo2Desc] = useState()

    const videoId1 = 'QHLojVxs-M0'
    const videoId2 = 'ifi5cGgJa7s'
    const videoEmbedURL = 'https://www.youtube.com/embed/'

//     items: Array(5)
// 0:
// etag: "IPLLqa9ikvoy_gLqxEcoiqqavC4"
// id: {kind: "youtube#channel", channelId: "UCdOXRB936PKSwx0J7SgF6SQ"}
// kind: "youtube#searchResult"
// snippet:
// channelId: "UCdOXRB936PKSwx0J7SgF6SQ"
// channelTitle: "EddieX"
// description: "If you like cars, and you like hearing someone with too much knowledge about cars talk about them, you should check out my Youtube channel! I'm planning on ..."
// liveBroadcastContent: "upcoming"
// publishTime: "2015-06-11T02:01:04Z"
// publishedAt: "2015-06-11T02:01:04Z"
// thumbnails:
// default: {url: "https://yt3.ggpht.com/a/AATXAJzxcCWM9He6uumiLOa71zR_7mR3feUT_MG2IfBY=s88-c-k-c0xffffffff-no-rj-mo"}
// high: {url: "https://yt3.ggpht.com/a/AATXAJzxcCWM9He6uumiLOa71zR_7mR3feUT_MG2IfBY=s800-c-k-c0xffffffff-no-rj-mo"}
// medium: {url: "https://yt3.ggpht.com/a/AATXAJzxcCWM9He6uumiLOa71zR_7mR3feUT_MG2IfBY=s240-c-k-c0xffffffff-no-rj-mo"}
// __proto__: Object
// title: "EddieX"

// id:
// kind: "youtube#video"
// videoId: "ifi5cGgJa7s"
// __proto__: Object
// kind: "youtube#searchResult"
// snippet:
// channelId: "UCdOXRB936PKSwx0J7SgF6SQ"
// channelTitle: "EddieX"
// description: "Use my referral link to get 12% off your BlendMount Radar Detector mount order! http://blendmount.refr.cc/eddiex Follow me on IG and FB at @eddiex616 to see ..."
// liveBroadcastContent: "none"
// publishTime: "2020-11-10T20:00:04Z"
// publishedAt: "2020-11-10T20:00:04Z"
// thumbnails: {default: {…}, medium: {…}, high: {…}}
// title: "The Best Mercedes AMG Ever! | SLS Black Series Review"

    const handleTest = async () =>{
        console.log('working?')
          await youtubeAPI.get('/videos', {
              params: {
                  id: videoId1
              }
          }).then(res =>{
              console.log('res', res)
            setVideo1Desc(res.data.items[0])
            console.log('test', video1Desc)
          })
    }
    const handleEddie = async () =>{
        await youtubeAPI.get('/search', {
            params: {
                q: 'Eddie X'
            }
        }).then(res =>{
            console.log('res eddir', res)
          setVideo1Desc(res.data.items[0])
          console.log('test', video1Desc)
        })
    }
    useEffect( () => {
        d3.csv(datacsv, function(data) {
    //         var PATTERN = 'bedroom',
    // filtered = myArray.filter(function (str) { return str.indexOf(PATTERN) === -1; });
        });
        
  
      })
      useEffect(async () => {
        //   console.log('working?')
        //   await youtubeAPI.get('/videos', {
        //       params: {
        //           id: videoId1
        //       }
        //   }).then(res =>{
        //     setVideo1Desc(res.data.items[0])
        //     console.log('test', res)
        //   })
        //   await youtubeAPI.get('/search', {
        //     params: {
        //         q: 'car'
        //     }
        // }).then(res =>{
        //     setVideo2Desc(res.data.items[0])
        //     console.log('test', res)
        // })
        
        
        

        // setVideo2Desc(video2Data)
          
      })
    return(
        <div className="main-wrapper">
            <div className="spacer-4rem"></div>
            <h2 className="title">New Today</h2>
            <Row>
                <Col sm={6}>
                    <Row>
                        <Col sm={8} >
                            <div className="videoWrapper">
                                <iframe src={videoEmbedURL + videoId1}
                                        frameBorder='0'
                                        allow='autoplay; encrypted-media'
                                        allowFullScreen
                                        title='video'
                                
                                />
                  
                            </div>
                            {/* <h3>{video1Desc.snippet.title}</h3> */}
                        </Col>
                        <Col sm={4}>
                            {}
                        </Col>
                    </Row>
                </Col>
                <Col sm={6}>
                    <Row>
                        <Col sm={8}>
                        <div className="videoWrapper">
                            <iframe width="560" height="315" 
                            src={videoEmbedURL + videoId2}
                            frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                        
                        </Col>
                        <Col sm={4}></Col>
                    </Row>

                </Col>
            </Row>
            <button onClick={handleTest}>test API</button><br/>
            <button onClick={handleEddie}>test API Eddie</button>
        </div>
    )
}

export default HomePage


// etag: "zSDmvaDlxia7m7rjosNr1ZzMUgY"
// items: Array(1)
// 0:
// etag: "sdyw-vxA45M_t1eQABAOPH3tGzk"
// id: "QHLojVxs-M0"
// kind: "youtube#video"
// snippet:
// categoryId: "2"
// channelId: "UCdOXRB936PKSwx0J7SgF6SQ"
// channelTitle: "EddieX"
// defaultAudioLanguage: "en"
// description: "Follow me on IG and FB at @eddiex616 to see daily posts and updates!↵Instagram: https://www.instagram.com/eddiex616/↵Facebook:  https://www.facebook.com/EddieX616/↵The 2020 Shelby GT500 is the most powerful production Mustang every built, with a 5.2L Supercharged V8 making 760HP and 625 lb-ft of torque. Paired with a 7 speed DCT transmission, this track monster is irresponsibly fast. Tremendously capable both around a track and in a straight line, the top tier Shelby takes everything to the next level. As a current Shelby GT350R owner, I can confidently say that the GT500 brings a completely different kind of driving experience. The more powerful GT500 is without a doubt much more capable, and despite being 500lbs heavier, will demolish the GT350 in almost every metric. I enjoyed my time with the GT500 so much that I now want to add one to my garage alongside the GT350R!↵↵Use my referral link to get 12% off your BlendMount Radar Detector mount order!↵http://blendmount.refr.cc/eddiex↵↵Music from https://www.epidemicsound.com/↵↵#ShelbyGT500 #Ford #Mustang"
// liveBroadcastContent: "none"
// localized: {title: "Here's Why I Want A 2020 Shelby GT500!", description: "Follow me on IG and FB at @eddiex616 to see daily …w.epidemicsound.com/↵↵#ShelbyGT500 #Ford #Mustang"}
// publishedAt: "2020-10-29T19:00:02Z"
// tags: (21) ["EddieX", "BMW", "audi", "mercedes", "supercar", "review", "automotive", "cars", "ford", "informational", "ford mustang", "shelby gt500", "ford gt500", "2020 shelby gt500", "gt350R", "shelby gt350", "gt350 vs gt500", "best mustang every", "shelby gt500 mustang", "mustang gt500", "ford performance"]
// thumbnails: {default: {…}, medium: {…}, high: {…}, standard: {…}, maxres: {…}}
