import React, { useEffect, useState } from 'react'
import { Row, Col, Form, FormControl } from 'react-bootstrap'
import datacsv from '../assets/car-data.csv'
import * as d3 from 'd3'
// import * as Papa from 'papaparse'
import { youtubeAPI } from '../utils/youtubeAPI'
import { carTempData } from './carTempData'

import powerIcon from '../assets/global/Horsepower.png'
import pistonIcon from '../assets/global/piston.png'
import priceIcon from '../assets/global/Price-Tag-icon.png'
// import speedIcon from '../assets/global/Speed-icon.png'
// import ford from '../assets/car-brand-logos/Ford_Logo.png'
// import mercedes from '../assets/car-brand-logos/MercedesBenz_Logo.png'

const HomePage = () =>{
 
    // const videoIds = ['QHLojVxs-M0', 'ifi5cGgJa7s']
    const videoEmbedURL = 'https://www.youtube.com/embed/'
    const EddieXChannelId = 'UCdOXRB936PKSwx0J7SgF6SQ'
    const [searchKeyword, setSearchKeyword] = useState('')
    const [titleStr, setTitleStr] = useState('Your search result')
    const [searchedCarData, setSearchedCarData] = useState([])
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

    const handleTest = async (e) =>{
       
        await youtubeAPI.get('/videos', {
              params: {
                  id: carTempData[0].videoId
              }
          }).then(res =>{
              console.log('res', res)
              carTempData[0].youtube = res.data.items[0]
            // setVideo1Desc(res.data.items[0])
            // setCarData(

            // )
          })
        await youtubeAPI.get('/videos', {
            params: {
                id: carTempData[1].videoId
            }
        }).then(res =>{
            console.log('res2', res)
            carTempData[1].youtube = res.data.items[0]
        })
    }
    const handleEddie = async () =>{
        await youtubeAPI.get('/search', {
            params: {
                q: 'Eddie X'
            }
        }).then(res =>{
            console.log('res eddir', res)
        //   setVideo1Desc(res.data.items[0])
        })
    }
    const handleChangeKeyword = (e) =>{
        setSearchKeyword(e.target.value)
    }
    const handleVideoSearch = async e =>{
        e.preventDefault()
        await youtubeAPI.get('/search', {
            params: {
                q: searchKeyword,
                channelId: EddieXChannelId
            }
        }).then(res =>{
            console.log('res from youtube', res)
            setTitleStr("EddieX " + searchKeyword)
            const searchResult = res.data.items
            console.log('is this array?', res.data.items)
            const datayoutube =[]
            searchResult.map(data =>{
                datayoutube.push({
                    videoId: data.id.videoId,
                    youtube:{
                        snippet: {title: data.snippet.title}
                    }
                })
            })
            setSearchedCarData(datayoutube)
            console.log('use state check: ', searchedCarData)
            
            
// etag: "DGXOPdigGW4SFrRywMEE_lwUuwY"
// id:
// kind: "youtube#video"
// videoId: "iXrO7LJTUkE"
// __proto__: Object
// kind: "youtube#searchResult"
// snippet:
// channelId: "UCdOXRB936PKSwx0J7SgF6SQ"
// channelTitle: "EddieX"
// description: "Follow me on IG and FB at @eddiex616 to see daily posts and updates! The Dodge Durango SRT and Ford Explorer ST are two 3 row SUVs that offer some ..."
// liveBroadcastContent: "none"
// publishTime: "2020-02-17T20:00:10Z"
// publishedAt: "2020-02-17T20:00:10Z"
// thumbnails: {default: {…}, medium: {…}, high: {…}}
// title: "2020 Dodge Durango SRT vs 2020 Ford Explorer ST | Is The V8 Worth $20,000 More?"

        })
    }
    useEffect( () => {
        d3.csv(datacsv, function(data) {
    //         var PATTERN = 'bedroom',
    // filtered = myArray.filter(function (str) { return str.indexOf(PATTERN) === -1; });
        });
        
  
      })
    //   useEffect(async () => {
    //     await youtubeAPI.get('/videos', {
    //         params: {
    //             id: carTempData[0].videoId
    //         }
    //     }).then(res =>{
    //         console.log('res', res)
    //         carTempData[0].youtube = res.data.items[0]
       
    //     })
    //   await youtubeAPI.get('/videos', {
    //       params: {
    //           id: carTempData[1].videoId
    //       }
    //   }).then(res =>{
    //       console.log('res2', res)
    //       carTempData[1].youtube = res.data.items[0]
    //   })
          
    //   })
    return(
        <div className="main-wrapper">
            <div className="spacer-4rem"></div>
            <h2 className="title">New Today</h2>
            <Row style={{paddingLeft:'-7px', paddingRight:'-7px'}}>
            {
                carTempData.map((car, index) =>{
       
                    return <>
                    <Col sm={6} key={car.videoId}>
                    <Row>
                        <Col sm={8} >
                            <div className="videoWrapper">
                                <iframe src={videoEmbedURL + car.videoId}
                                        frameBorder='0'
                                        allow='autoplay; encrypted-media'
                                        allowFullScreen
                                        title='video'
                                
                                />
                  
                            </div>
                            <h3 style={{marginTop:'10px'}}>{car.youtube.snippet.title}</h3>
                        </Col>
                        <Col sm={4} style={{paddingLeft:0}}>
                            <div className="spec-wrapper">
                            <img alt={car.name} key={car.logoUrl} src={require(`../assets/car-brand-logos/${car.logoUrl}`).default} className="icon-s" />{' '}<span className="spec-text"><strong>{car.name}</strong></span><br/>
                            <img alt="price" key={priceIcon} src={priceIcon} className="icon-s" /><span className="spec-text">{' '}${car.price}</span><br />
                            <img alt="power " key={powerIcon} src={powerIcon} className="icon-s" /><span className="spec-text">{' '}{car.engine}</span><br />
                            <img alt="piston" key={pistonIcon} src={pistonIcon} className="icon-s" /><span className="spec-text">{' '}{car.hoursepower}</span><br />
                            </div>
                        </Col>
                    </Row>
                </Col>
                    </>
                })
            }
           </Row>
           <div className="spacer-4rem"></div>
           <div className="title title-adj">
            <h2 style={{marginBottom: '-1rem'}}>{titleStr}</h2>
            <Form inline onSubmit={handleVideoSearch} style={{marginRight: '-8px'}}>
                <FormControl type="text" placeholder="Search" className="mr-sm-2 form-adj" onChange={handleChangeKeyword}/>
            </Form>
            </div>
            <Row style={{paddingLeft:'-7px', paddingRight:'-7px'}}>
            {searchedCarData &&
                searchedCarData.map((car, index) =>{
       
                    return <>
                    <Col sm={6} key={car.videoId}>
                    <Row>
                        <Col sm={8} >
                            <div className="videoWrapper">
                                <iframe src={videoEmbedURL + car.videoId}
                                        frameBorder='0'
                                        allow='autoplay; encrypted-media'
                                        allowFullScreen
                                        title='video'
                                
                                />
                    
                            </div>
                            <h3 style={{marginTop:'10px'}}>{car.youtube.snippet.title}</h3>
                        </Col>
                        <Col sm={4} style={{paddingLeft:0}}>
                            <div className="spec-wrapper">
                            {/* <img alt={car.name} key={car.logoUrl} src={require(`../assets/car-brand-logos/${car.logoUrl}`).default} className="icon-s" />{' '}<span className="spec-text"><strong>{car.name}</strong></span><br/>
                            <img alt="price" key={priceIcon} src={priceIcon} className="icon-s" /><span className="spec-text">{' '}${car.price}</span><br />
                            <img alt="power " key={powerIcon} src={powerIcon} className="icon-s" /><span className="spec-text">{' '}{car.engine}</span><br />
                            <img alt="piston" key={pistonIcon} src={pistonIcon} className="icon-s" /><span className="spec-text">{' '}{car.hoursepower}</span><br /> */}
                            </div>
                        </Col>
                    </Row>
                </Col>
                    </>
             })
            }
            </Row>
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
