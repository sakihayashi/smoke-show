import React, { useEffect, useState, Fragment } from 'react'
import { Helmet } from "react-helmet"
import { Row, Col } from 'react-bootstrap'
import * as Realm from "realm-web"
import Pagination from 'react-bootstrap/Pagination'

import Avatar from 'react-avatar'
import Layout from '../Layout/Layout'
import { logInAsPublic, updateLogin } from '../../store/actions/authActions'
import { connect } from 'react-redux'
import jwt from 'jsonwebtoken'
import { getInfluencer }from '../../store/actions/influencerActions'
import './allVideos.scss'
import short from 'short-uuid'
import loadable from '@loadable/component'

const SpecDiv = loadable(() => import('../SpecDiv'))
const Comments = loadable(() => import('../Comments'))
const SubNav = loadable(() => import('./SubNav'))
const VideoDiv = loadable(()=> import('../VideoDiv'))

const AllVideos = (props) =>{
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
    }
    const videoEmbedURL = 'https://www.youtube.com/embed/'
    const [videoArr, setVideoArr] = useState([])
    const [allVideoData, setAllVideoData] = useState([])

    const [pgNum, setPgNum] = useState(null)
    const [middleNum, setMiddleNum] = useState(null)
    const [active, setActive] = useState(1)
    const [influencerName, setInfluencerName] = useState('')
  
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
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


    const attachCarData = async (chunk, num) =>{
        
       setVideoArr([])
        // try{
        //     await app.logIn(credentials).then( user =>{
                const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const collectionCars = mongo.db("smoke-show").collection("cars")
                const collectionManual = mongo.db("smoke-show").collection("cars-manual")
                if(chunk){
                    const mapResults = chunk[num].map(async video =>{
                        const filterCar = {_id: {"$oid": video.carDataId}}

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
                    })
                }else{
                    const results = allVideoData[num].map(async video =>{
                        const filterCar = {_id: {"$oid": video.carDataId}}
                        
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

    const numberWithCommas = (x) =>{
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

    useEffect(() => {
        if(typeof(props.influencerObj.username) !== 'undefined'){
            setInfluencerName(props.influencerObj.username)
        }
    }, [props.influecerObj])
    useEffect( () => {
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
                    const unique = short.generate()
                    const str = video.carData.model
                    const id = video.videoId
                    const model = str.charAt(0).toUpperCase() +str.slice(1)
                    const name = video.carData.make
                    const titleCase = name.charAt(0).toUpperCase() +name.slice(1)
                    let price;
                    if(video.carData.price && video.carData.price.baseMSRP){
                        price = numberWithCommas(video.carData.price.baseMSRP)
                    }else{ price = ''}
                    
                    return(
                        <Fragment key={unique} >
                            <Col sm={6} className="main-col" >
                                
                                <Row className="video-row">
                                    <Col sm >
                                    <VideoDiv video={video} videoId={id}/>
                                        {/* <div className="videoWrapper">
                                            <iframe src={videoEmbedURL + id}
                                                    frameBorder='0'
                                                    allow='autoplay; encrypted-media'
                                                    allowFullScreen
                                                    loading='lazy'
                                                    title={video.snippet.title}
                                            />
                                            
                                        </div> */}
                                        <div className="video-title-div" dangerouslySetInnerHTML={{__html: video.snippet.title}} />
                                        <Row className="comment-wrapper" >
                                            <div className="col-1" style={{margin:0,padding:0}} >
                                            {props.influencerObj.profilePic ? <img src={props.influencerObj.profilePic} 
                                            
                                            className="creator-profile-pic" alt={props.influencerObj.username}/> :
                                            <Avatar color={Avatar.getRandomColor('sitebase', ['red', 'green', 'teal'])} className="creator-profile-pic" name={video.snippet.channelTitle} />
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
                                            <small>{video.snippet.description}</small>
                                            </div>

                                        </Row>
                                        
                                        <div className="spacer-4rem"></div>
                                            <Comments videoId={id} />
                                        
                                    </Col>
                                    <Col sm="auto"  className="spec-col"  >
                                    <div style={{minWidth: '160px'}}>
                                    <SpecDiv video={video} titleCase={titleCase} price={price} model={model} dataid={video.carDataId}/>
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
