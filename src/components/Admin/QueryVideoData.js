// import React, { useEffect, useState  } from 'react'
// import {Helmet} from "react-helmet"
// import { Row, Col, Form, FormControl } from 'react-bootstrap'
// import * as Realm from "realm-web"
// import { youtubeAPI } from '../../utils/youtubeAPI'
// import { carTempData } from './carTempData'
// import { commentsTempData } from './commentsTempData' 

// const QueryVideoData = () =>{
//     const [period, setPeriod] = useState()
//     const handleVideoSearch = async e =>{
//         e.preventDefault()
//         await youtubeAPI.get('/search', {
//             params: {
//                 q: searchKeyword,
//                 channelId: EddieXChannelId
//             }
//         }).then(res =>{
//             console.log('res from youtube', res)
//             setTitleStr("EddieX " + searchKeyword)
//             const searchResult = res.data.items
//             console.log('is this array?', res.data.items)
//             const datayoutube =[]
//             searchResult.map(data =>{
//                 datayoutube.push({
//                     videoId: data.id.videoId,
//                     youtube:{
//                         snippet: {title: data.snippet.title}
//                     }
//                 })
//                 return
//             })
//             setSearchedCarData(datayoutube)
//             console.log('use state check: ', searchedCarData)
            
            
// // etag: "DGXOPdigGW4SFrRywMEE_lwUuwY"
// // id:
// // kind: "youtube#video"
// // videoId: "iXrO7LJTUkE"
// // __proto__: Object
// // kind: "youtube#searchResult"
// // snippet:
// // channelId: "UCdOXRB936PKSwx0J7SgF6SQ"
// // channelTitle: "EddieX"
// // description: "Follow me on IG and FB at @eddiex616 to see daily posts and updates! The Dodge Durango SRT and Ford Explorer ST are two 3 row SUVs that offer some ..."
// // liveBroadcastContent: "none"
// // publishTime: "2020-02-17T20:00:10Z"
// // publishedAt: "2020-02-17T20:00:10Z"
// // thumbnails: {default: {…}, medium: {…}, high: {…}}
// // title: "2020 Dodge Durango SRT vs 2020 Ford Explorer ST | Is The V8 Worth $20,000 More?"

//         })
//     }
//     return(
//         <div>
//             <div></div>
//         </div>
//     )
// }

// export default QueryVideoData