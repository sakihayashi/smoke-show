import React, { useEffect, useState, Fragment } from 'react'
import { Helmet } from "react-helmet"
import { Row, Col } from 'react-bootstrap'
import * as Realm from "realm-web"
import Pagination from 'react-bootstrap/Pagination'
import { numberWithCommas, urlify } from '../Global/functions'
import Avatar from 'react-avatar'
import Layout from '../Layout/Layout'
import { logInAsPublic, updateLogin } from '../../store/actions/authActions'
import { connect } from 'react-redux'
import jwt from 'jsonwebtoken'
import { getInfluencer }from '../../store/actions/influencerActions'
import './allVideos.scss'
import moment from 'moment'
import short from 'short-uuid'
import loadable from '@loadable/component'
import ReactPlayer from 'react-player/lazy'
import { adAllVideos, adAllVideosInfinite } from '../adData'
const SpecDiv = loadable(() => import('../SpecDiv'))
const Comments = loadable(() => import('../Comments'))
const SubNav = loadable(() => import('./SubNav'))

const AllVideos = (props) =>{
    const videoWatchURL = 'https://www.youtube.com/watch?v='
    let today = new Date()
    const timeISO = today.toISOString()
    let published = new Date('2021-03-01')
    const publishedISO = published.toISOString()
    const slug = 'all-videos'
    let influencerId;
    const name = props.match.params.username
    if(name === 'EddieX'){
        influencerId = '60230361f63ff517d4fdad14'
    }else if(name === 'Lexurious-Fleet'){
        influencerId = '602303890ff2832f7d19a2af'
    }else if(name === 'Elliott-Alvis'){
        influencerId = '603c3d4e79ca596edd9b6161'
    }
    const [videoArr, setVideoArr] = useState([])
    const [allVideoData, setAllVideoData] = useState([])
    const [views, setViews] = useState([])
    const [pgNum, setPgNum] = useState(null)
    const [middleNum, setMiddleNum] = useState(null)
    const [active, setActive] = useState(1)
    const [influencerName, setInfluencerName] = useState('')
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        };
    const app = new Realm.App(appConfig);
    
    const chunkArray = (allVideos) =>{
        let chunk_size = 12
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
    const runCounter = async (videoId, index) => {
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionYoutube = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("youtube-videos")
        const addedViews = Number(views[index] +1)
        const tempArr = [...views]
        tempArr[index] = addedViews

        try {
            await collectionYoutube.updateOne(
                {"videoId": videoId},
                { "$set": { "views": addedViews} }
            ).then(res => {
                console.log(res)
                // setViews(tempArr)
            })
            
        } catch (error) {
            console.log('err', error);
        }
    }

    const attachCarData = async (chunk, num) =>{
        
        setVideoArr([])
        setViews([])
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionCars = mongo.db("smoke-show").collection("cars")
        const collectionManual = mongo.db("smoke-show").collection("cars-manual")
        let arr = [...views]
        if(chunk){
            const mapResults = chunk[num].map(async (video, index) =>{
                if(typeof(video.views) !== 'undefined'){
                    arr[index] = Number(video.views)
                }else{
                    arr[index] = 0;
                }
                const filterCar = {_id: {"$oid": video.carDataId || '5fbc6d2f87a7a21330c372e5'}}

                const data = await collectionCars.findOne(filterCar)
                
                if(data){
                    video.carData = data
                    return video
                }else{

                    const data = await collectionManual.findOne(filterCar)
                    if(data){
                        video.carData = data
                        return video
                    }else{
                        console.log('no data')
                    }
                }
                        
            })
            Promise.all(mapResults).then(video =>{
                setVideoArr(video)
                setViews(arr)
            })
        }else{
            const results = allVideoData[num].map(async (video, index) =>{
                if(typeof(video.views) !== 'undefined'){
                    arr[index] = Number(video.views)
                }else{
                    arr[index] = 0;
                }
                const filterCar = {_id: {"$oid": video.carDataId || '5fbc6d2f87a7a21330c372e5'}}
                const data = await collectionCars.findOne(filterCar)
                
                if(data){
                video.carData = data
                return video

                }else{
                const data = await collectionManual.findOne(filterCar)
                    video.carData = data
                    return video
                }
                
            })
            Promise.all(results).then(res =>{
                setVideoArr(res)
                setViews(arr)
            })
        }
                
    }
    const getVideos = async (cre) =>{
        
        try{
            await app.logIn(cre).then(async  user =>{
                if(app.currentUser.id === user.id){
                    console.log('user login updated')
                }
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const mongoCollection = mongo.db("smoke-show").collection("youtube-videos")
                const filter = {userId: influencerId}
                const options = {sort: {"snippet.publishedAt": -1}}
                try{
                    await mongoCollection.find(filter, options).then(async videos =>{
                    //   console.log('videos', videos)
                        const res = Math.floor(videos.length / 12)
                        setPgNum(res)
                        if(res % 2 === 0){
                            setMiddleNum(res / 2)
                        }else{
                            const half = res/2
                            setMiddleNum(Math.ceil(half))
                        }
                        
                        const chunk = chunkArray(videos)
                        setAllVideoData(chunk)
                        return chunk
                    }).then( chunk =>{
                        attachCarData(chunk, 0)
                    })
                }catch(err){
                    console.log(err)
                }
                
            })
        }catch(err){
            console.log(err)
        }
        
    }

    const loginCheck = () =>{
        const tokenUser = sessionStorage.getItem('session_user')
        if(tokenUser){
            jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, function(err, decoded) {
                if (err) {
                    // timeout
                    const cre = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    getVideos(cre)
                    
                }else{
                    getVideos(decoded.cre)
                }
              });
            
        }else{
            const cre = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
            getVideos(cre)
            
        }
    }
    const getselectedPage =(number)=>{
        setActive(number)
        attachCarData(null, number)
    }
    const getPrevPage = () =>{
        if(active > 1){
            const num = active -1
            setActive(num)
            attachCarData(null, num)
            if(num < pgNum -1){
                if(num === 2){
                    setMiddleNum(3)
                }else if(num <= 1){
                    if(pgNum %2 === 0){
                        setMiddleNum(pgNum /2)
                    }else{
                        const temp = pgNum /2
                        setMiddleNum(Math.ceil(temp))
                    }
                    
                }else{
                    setMiddleNum(num)
                }
                
            }else if(num === pgNum -1){
                setMiddleNum(pgNum -2)
            }
            
        }else{
            return
        }
    }
    const getNextPage = () =>{
        if(active < pgNum){
            const num = active +1
            setActive(num)
            attachCarData(null, num)
            
            if( num > 2){
                if(pgNum -2 < num){
                    setMiddleNum(pgNum -2)
                }else(
                    setMiddleNum(num)
                )
                
            }else if(num === 2){
                setMiddleNum(3)
            }else if (num === pgNum -1){
                setMiddleNum(pgNum -2)
            }
        }else{
            return
        }
    }

    const paginationItems = () =>{
        let items = [];
        if(pgNum > 9){
            // const middle = pgNum / 2
            const middleMinus = middleNum -1
            const middlePlus = middleNum +1
            const paginationDiv = 
                    <Fragment>
                        {/* <Pagination.First /> */}
                        <Pagination.Prev onClick={()=>getPrevPage()}/>
                        <Pagination.Item active={1 === active} onClick={()=>getselectedPage(1)} >{1}</Pagination.Item>
                        <Pagination.Ellipsis />

                        <Pagination.Item  active={middleMinus === active} onClick={()=>getselectedPage(middleNum -1)} >{middleNum -1}</Pagination.Item>
                        <Pagination.Item  active={middleNum === active} onClick={()=>getselectedPage(middleNum)} >{middleNum}</Pagination.Item>
                        <Pagination.Item active={middlePlus === active} onClick={()=>getselectedPage(middlePlus)} >{middlePlus}</Pagination.Item>

                        <Pagination.Ellipsis />
                        <Pagination.Item  active={pgNum === active} onClick={()=>getselectedPage(pgNum)} >{pgNum}</Pagination.Item>
                        <Pagination.Next onClick={()=>getNextPage()}/>
                        {/* <Pagination.Last /> */}
                    </Fragment>
            return paginationDiv
        }else{
            for (let number = 1; number <= pgNum; number++) {
                items.push(
                    <Pagination.Item key={`page-${number}`} active={number === active} onClick={()=>getselectedPage(number)} >
                    {number}
                    </Pagination.Item>
                )
            }
            return items
        }
    }
    // const new_script = ()=>{
    //     return new Promise(function(resolve, reject){

    //             const script = document.createElement("script");
    //             script.setAttribute('data-layout', "all-videos");
    //             script.setAttribute('data-debug', "true");
    //             script.setAttribute('data-tmsclient', "The Smoke Show");
    //             script.setAttribute('id', "all-videos");
    //             script.src = "https://lib.tashop.co/the_smoke_show/adengine.js";
    //             script.async = true;
    //             const scriptW = document.createElement("script");
    //             scriptW.setAttribute('id', 'ad-w');
    //             scriptW.text = 'window.TAS = window.TAS || { cmd: [] }'
               
    //             script.addEventListener('load', function () {
    //               resolve();
    //             });
    //             script.addEventListener('error', function (e) {
    //               reject(e);
    //             });
    //             document.body.appendChild(script);
    //             document.body.appendChild(scriptW)
            
            
    //       })
    // }


    useEffect(() => {
        if(typeof(props.influencerObj.username) !== 'undefined'){
            setInfluencerName(props.influencerObj.username)
        }
    }, [props.influecerObj])
    useEffect( () => {
        
        // new_script()
        // if(allVideosScript){
        //     document.body.removeChild(allVideosScript)
        //     document.body.removeChild(scriptA)
        //     const script = document.createElement("script");
        //     script.setAttribute('data-layout', "all-videos");
        //     script.setAttribute('data-debug', "true");
        //     script.setAttribute('data-tmsclient', "The Smoke Show");
        //     script.setAttribute('id', "all-videos");
        //     script.src = "https://lib.tashop.co/the_smoke_show/adengine.js";
        //     script.async = true;
        //     document.body.appendChild(script);
        //     const scriptW = document.createElement("script");
        //     scriptW.setAttribute('id', 'ad-w');
        //     scriptW.text = 'window.TAS = window.TAS || { cmd: [] }'
        //     document.body.appendChild(scriptW)
        // }else{
        //     const script = document.createElement("script");
        //     script.setAttribute('data-layout', "all-videos");
        //     script.setAttribute('data-debug', "true");
        //     script.setAttribute('data-tmsclient', "The Smoke Show");
        //     script.setAttribute('id', "all-videos");
        //     script.src = "https://lib.tashop.co/the_smoke_show/adengine.js";
        //     script.async = true;
        //     document.body.appendChild(script);
        //     const scriptW = document.createElement("script");
        //     scriptW.setAttribute('id', 'ad-w');
        //     scriptW.text = 'window.TAS = window.TAS || { cmd: [] }'
        //     document.body.appendChild(scriptW)
        // }
        
        // const scriptW = document.createElement("script")
        // scriptW.innerHTML = "window.TAS = window.TAS || { cmd: [] }"
        
        loginCheck()
        props.getInfluencer(influencerId)
    }, [])
    
    return(
        <Layout >
            <Helmet>
                <meta charSet="utf-8" />
                <title>All Videos from {`${influencerName}`} | The Smoke Show</title>
                <meta name="description" content={`Enjoy all videos from the influencer + Vlogger ${influencerName}. Check out the related car statistics and more information.`} />
                <link rel="canonical" href={`https://thesmokeshow.com/${name}/all-videos`} />
                <script src="https://lib.tashop.co/the_smoke_show/adengine.js" async data-tmsclient="The Smoke Show" data-layout="all-videos" data-debug="true"></script>
                

                <script>{`window.TAS = window.TAS.reload() || { cmd: [] }`}</script>
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
                        {"@type": ["WebPage","CollectionPage"],
                        "@id": "https://thesmokeshow.com/influencer/${name}/${slug}/#webpage", "url": "https://thesmokeshow.com/influencer/influencer/${name}/${slug}/", "name": "Giveaways | The Smoke Show","isPartOf":{"@id":"https://thesmokeshow.com/#website"}, "datePublished": "${publishedISO}", "dateModified": "${timeISO}", "description": "Enjoy all videos from the influencer + Vlogger ${influencerName}. Check out the related car statistics and more information.", "breadcrumb":{"@id":"https://thesmokeshow.com/influencer/${name}/${slug}/#breadcrumb"},"inLanguage":"en","potentialAction":[{"@type":"ReadAction","target":["https://thesmokeshow.com/influencer/${name}/${slug}/"]}]},
                        {"@type":"BreadcrumbList","@id":"https://thesmokeshow.com/#breadcrumb",
                        "itemListElement":[{
                            "@type":"ListItem","position":1,
                            "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/","url":"https://thesmokeshow.com/","name":"Home"}
                            },
                            {
                                "@type":"ListItem",
                                "position":2,
                                "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/influencers/","url":"https://thesmokeshow.com/giveaways/","name":"Influencers and Vloggers"}
                            },
                            {
                                "@type":"ListItem",
                                "position":3,
                                "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/influencers/${name}/","url":"https://thesmokeshow.com/influencers/${name}/","name":"Influencer ${name} featured page"}
                            },
                            {
                                "@type":"ListItem",
                                "position":4,
                                "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/influencers/${name}/${slug}","url":"https://thesmokeshow.com/influencers/${name}//${slug}","name":"All videos from Influencer ${name}"}
                            }
                            ]}
                        ]
                    }
                `}
                </script>
            </Helmet>
            
            <div className="main-wrapper">
                <SubNav influencer={props.influencerObj} formattedFans={props.formattedFans} username={name} />
            <div className="spacer-4rem"></div>
            <h2 className="title">All Videos from {props.influencerObj.username && props.influencerObj.username}</h2>
            <div className="pagination-wrapper">
                <Pagination>
                    { pgNum && paginationItems() }
                </Pagination>
            </div>
            <Row style={{paddingLeft:'-7px', paddingRight:'-7px'}}>
            {   videoArr[0] &&
                videoArr.map((video, index) =>{
                    console.log('check how many times', video.videoId)
                    const unique = short.generate()
                    const str = video.carData.model
                    const id = video.videoId
                    const date = moment(video.snippet.publishedAt).fromNow()
                    const model = str.charAt(0).toUpperCase() +str.slice(1)
                    const name = video.carData.make
                    const titleCase = name.charAt(0).toUpperCase() +name.slice(1)
                    let price;
                    let weight
                    if(video.carData.features.Measurements && video.carData.features.Measurements["Curb weight"]){
                        weight = video.carData.features.Measurements["Curb weight"]
                        weight = numberWithCommas(weight)
                    }else{
                        weight = ''
                    }
                    
                    if(video.carData.price && video.carData.price.baseMSRP){
                        price = numberWithCommas(video.carData.price.baseMSRP)
                    }else{ price = ''}
                    const uniqueToDiv = Date.now();
                    return(
                        <Fragment key={unique} >
                            <Col sm={6} className="main-col" >
                                
                                <Row className="video-row">
                                    <Col sm >
                                        <div className="videoWrapper">
                                            <ReactPlayer
                                            onStart={() => runCounter(video.videoId, index)}
                                            width="560" 
                                            height="315"
                                            url={videoWatchURL + video.videoId}
                                            controls={true}
                                            />
                                        </div>
                                    
                                        <div className="video-title-div" dangerouslySetInnerHTML={{__html: video.snippet.title}} />
                                        <small>{date}</small> {' |'}
                                        { <small>{views[index] ? views[index] : 0 } views</small>
                                        }
                                            
                                        <Row className="comment-wrapper" >
                                            <div className="col-1" style={{margin:0,padding:0}} >
                                            {props.influencerObj.profilePic ? <img src={props.influencerObj.profilePic} 
                                            
                                            className="creator-profile-pic" alt={props.influencerObj.username} style={{width: 46, height: 46}}/> :
                                            <Avatar color={Avatar.getRandomColor('sitebase', ['red', 'green', 'teal'])} name={video.snippet.channelTitle} className="avator-smoke-show"/>
                                            }
                                            
                                            </div>
                                            <div className="col-11" style={{paddingRight:0, margin: 'auto'}} >
                                            <div className="creator-name"><strong>{video.snippet.channelTitle}</strong><br /> <span style={{color:'gray', fontSize: '13px'}}>{' '} {props.formattedFans} fans</span></div>
                                            </div>
                                            
                                            <input className="acd-input" type="checkbox" id={`title${index}`} />
                                    
                                            <label htmlFor={`title${index}`} className="acd-label">Show </label>
                                            <div className="desc-box">
                                                {video.snippet.description}
                                            </div> 
                                            <div className="content">
                                            <small className="whole-desc" dangerouslySetInnerHTML={{ __html: urlify(video.snippet.description) }}></small>
                                            </div>
                                        </Row>
                                        
                                        <div className="spacer-4rem"></div>
                                        <Comments videoId={id} />
                                        
                                    </Col>
                                    <Col sm="auto"  className="spec-col"  >
                                        <div style={{minWidth: '160px'}}>
                                        <SpecDiv video={video} titleCase={titleCase} price={price} model={model} dataid={video.carDataId || '5fbc6d2f87a7a21330c372e5'} weight={weight}/>
                                        </div>
                                        <div className="ad-container">
                                            {index < 6 ? 
                                            <div id={`unit-${adAllVideos[index]}`} className="tmsads" key={Math.random()}></div>
                                            :
                                            <div id={`smoke-show-allvideos-${uniqueToDiv}-${index}`} className="tmsads" data-ad={`unit-${adAllVideosInfinite}`} key={Math.random()}></div>
                                            }
                                            
                                        </div>
                                    </Col>
                                </Row>
                                
                            </Col>
                        </Fragment>
                    )
                })
            }
        </Row>
        <div className="spacer-4rem"></div>
       
        </div>
        </Layout>
    )
    }
    const mapDispatchToProps = (dispatch) =>{
        return{
            logInAsPublic: () => dispatch(logInAsPublic()),
            updateLogin: (credentials)=> dispatch(updateLogin(credentials)),
            getInfluencer: (id)=> dispatch(getInfluencer(id))
        }
    }
    const mapStateToProps = (state)=>{
        
        return{
            influencerObj: state.influ.influencerObj,
            formattedFans: state.influ.formattedFans
        }
    }

    export default connect(mapStateToProps, mapDispatchToProps )(AllVideos)
