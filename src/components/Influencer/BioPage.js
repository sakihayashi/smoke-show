import React, { useEffect, useState, Fragment } from 'react'
import { Helmet } from "react-helmet"
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as Realm from "realm-web"
// import Avatar from 'react-avatar'
import './bioPage.scss'
import ReactPlayer from 'react-player/lazy'
import { adInfluencer, adFeatured } from '../adData'
import Layout from '../Layout/Layout'
import jwt from 'jsonwebtoken'
import loadable from '@loadable/component'
import moment from 'moment'
import { switchTabs } from '../functionsStats'
import { numberWithCommas, urlify } from '../Global/functions'

const SpecDiv = loadable(() => import('../SpecDiv'))
const Comments = loadable(() => import('../Comments'))
const SubNav = loadable(() => import('./SubNav'))

const BioPage = (props) =>{
    const videoWatchURL = 'https://www.youtube.com/watch?v='
    let today = new Date()
    const timeISO = today.toISOString()
    let published = new Date('2021-03-01')
    const publishedISO = published.toISOString()
    const slug = props.match.params.username
    let pageName = `Influencer + Vlogger ${slug.replace("-", " ")} on The Smoke Show`

    let influencerId;
    const name = props.match.params.username
    if(name === 'EddieX'){
        influencerId = '60230361f63ff517d4fdad14'
    } else if(name === 'Lexurious-Fleet'){
        influencerId = '602303890ff2832f7d19a2af'
    } else if(name === 'Elliott-Alvis'){
        influencerId = '603c3d4e79ca596edd9b6161'
    }
    
    const [featured, setFeatured] = useState()
    const [influencer, setInfluencer] = useState({userId: '', fname: '', lname: '', username: '', fans: null, desc: '', channelId: '', banner_img: '', profile_pic: '', featuredVideo: {id: '', title: ''}})
    const [views, setViews] = useState([])
    const [formattedFans, setFormattedFans] = useState('')
    const [featuredViews, setFeaturedViews] = useState(null)
    const [latestVideos, setLatestVideos] = useState([])
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
      };
    const app = new Realm.App(appConfig);

    const getInfluencer = async (mongo) =>{

            try {
                const mongoCollection = mongo.db("smoke-show").collection("influencers");
                const replaced = name.replace('-', ' ')
                const filter = {username: replaced} 
                await mongoCollection.findOne(filter).then( async res => {
                    console.log({res})
                    setInfluencer(res)
                    const collectionFans = mongo.db("smoke-show").collection(`fans-${res.username}`)
                    try{
                        await collectionFans.count().then(num =>{
                            if(num > 999){
                                setFormattedFans(Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k')
                            }else{
                                setFormattedFans(Math.sign(num)*Math.abs(num))
                            }
                        })
                    }catch(err){console.log(err)}
                    
                })
             }catch(error){console.log(error)}
        
    }
    const getVideos = async (mongo) =>{
        setLatestVideos([])
        const collectionVideos = mongo.db("smoke-show").collection("youtube-videos")
        const collectionCars = mongo.db("smoke-show").collection("cars")
        const collectionManual = mongo.db("smoke-show").collection("cars-manual")
 
        const filter = {userId: influencerId}
        const options = {sort: {"snippet.publishedAt": -1}, limit: 7 }
        const videos = await collectionVideos.find(filter, options)
        let arr = [...views]
        if(videos){
            const results = videos.map(async (video, index) => {
                if(typeof(video.views) !== 'undefined'){
                    arr[index] = Number(video.views)
                }else{
                    arr[index] = 0;
                }
                const filterCar = {_id: {"$oid": video.carDataId || '5fbc6d2f87a7a21330c372e5'}}
                const data =  await collectionCars.findOne(filterCar)
                if(data){
                video.carData = data
                return video
                }else{
                    const anotherData = await collectionManual.findOne(filterCar)
                    if(anotherData){
                        video.carData = anotherData
                        return video
                  
                    }else{
                        console.log('no data')
                        video.carData = {}
                        return video
                    }
                }
            })
            Promise.all(results).then(res =>{
                let removed = res.shift()
                let removedViews = arr.shift()
                setViews(arr)
                setFeaturedViews(Number(removedViews))
                const str = removed.carData.model
                const modelTitle = str.charAt(0).toUpperCase() +str.slice(1)
                const make = removed.carData.make
                const makeTitle = make.charAt(0).toUpperCase() +make.slice(1)
                removed.makeTitle = makeTitle
                removed.modelTitle = modelTitle
                if(removed.carData.price && removed.carData.price.baseMSRP){
                    removed.price = numberWithCommas(removed.carData.price.baseMSRP)
                }else{ removed.price = ''}
                setFeatured(removed)
                setLatestVideos(res)
            })
        }
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
                setViews(tempArr)
            })
            
        } catch (error) {
            console.log('err', error);
        }
    }
    const runCounterFeatured = async (id) => {
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionYoutube = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("youtube-videos")
        const addedViews = Number(featuredViews + 1)
        try {
            await collectionYoutube.updateOne(
                {"videoId": id},
                { "$set": { "views": addedViews} }
            ).then(res => {
                console.log(res)
                setFeaturedViews(addedViews)
            })
            
        } catch (error) {
            console.log('err', error);
        }
    }
    const checkToken = async () =>{
        const token = sessionStorage.getItem('session_user')
        if(token){
            jwt.verify(token, process.env.REACT_APP_JWT_SECRET, async( err, decoded) =>{
                if(err){
                    const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    await app.logIn(credentials).then( user =>{
                    const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                    return mongo
                }).then( mongo => {
                    getInfluencer(mongo)
                    getVideos(mongo)
                })
                }else{
                    const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                    getInfluencer(mongo)
                    getVideos(mongo)
                }
            })
        }else{
            const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    await app.logIn(credentials).then( user =>{
                    const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                    return mongo
                }).then( mongo => {
                    getInfluencer(mongo)
                    getVideos(mongo)
                })
        }
    }
      useEffect(() => {
        checkToken()
      }, [])

    return(
        <Layout>
            <Helmet>
                <title>Influencer {name.replace("-", " ")} Featured Page | The Smoke Show</title>
                <meta name="description" content={influencer && influencer.desc} />
                <link rel="canonical" href={`https://thesmokeshow.com/influencer/${name}`} />
                <script src="https://lib.tashop.co/the_smoke_show/adengine.js" async data-tmsclient="The Smoke Show" data-layout="influencer" data-debug="true"></script>
                <script>{`window.TAS = window.TAS.reload() || { cmd: [] }`}</script>

                <script type="application/ld+json">
        {`
            {
                "@context": "http://schema.org",
                "@graph": [
                    {"@type":"WebSite",
                    "@id":"https://thesmokeshow.com/#website",
                "url":"https://thesmokeshow.com/",
                "name":"The Smoke Show",
                "description":"",
                "potentialAction":[{"@type":"SearchAction","target":"https://thesmokeshow.com/search?s={search_term_string}","query-input":"required name=search_term_string"}],
                "inLanguage":"en"},
                {"@type": ["WebPage","CollectionPage"],
                "@id": "https://thesmokeshow.com/influencer/${slug}/#webpage", 
                "url": "https://thesmokeshow.com/influencer/${slug}/", 
                "name": "${pageName}","isPartOf":{"@id":"https://thesmokeshow.com/#website"}, 
                "datePublished": "${publishedISO}", "dateModified": "${timeISO}", "description": "${influencer && influencer.desc}", 
                "breadcrumb":{"@id":"https://thesmokeshow.com/influencer/${slug}/#breadcrumb"},
                "inLanguage":"en",
                "potentialAction":[{"@type":"ReadAction","target":["https://thesmokeshow.com/influencer/${slug}/"]}]},
                {"@type":"BreadcrumbList","@id":"https://thesmokeshow.com/influencer/${slug}/#breadcrumb",
                "itemListElement":[{
                    "@type":"ListItem","position":1,
                    "item":{"@type":"WebPage",
                    "@id":"https://thesmokeshow.com/",
                    "url":"https://thesmokeshow.com/",
                    "name":"Home"}
                    },
                    {
                        "@type":"ListItem",
                        "position":2,
                        "item":{"@type":"WebPage",
                        "@id":"https://thesmokeshow.com/influencers/","url":"https://thesmokeshow.com/influencers/","name":"List of Influencers and Vloggers"}
                    },
                    {
                        "@type":"ListItem",
                        "position": 3,
                        "item":{"@type":"WebPage",
                        "@id":"https://thesmokeshow.com/influencer/${slug}/","url":"https://thesmokeshow.com/influencer/${slug}/","name":"${pageName}"}
                    }
                    ]}
                ]
            }
        `}
        </script>

            </Helmet>
            <div className="main-wrapper">
   
                <SubNav influencer={influencer} formattedFans={formattedFans} username={name}/>

                <div className="spacer-2rem"></div>
                <h2 className="title">Newest Vlog</h2>
                <Row className="bio-main-row">
                    <Col sm={6}>
                        <div className="videoWrapper">
                        {featured && 
                            <ReactPlayer
                                onStart={() => runCounterFeatured(featured.videoId)}
                                width="560" 
                                height="315"
                                url={videoWatchURL + featured.videoId}
                                controls={true}
                                />
                        }
                        </div>
                        <h3 style={{marginTop:'10px'}}>{featured && featured.snippet.title}</h3>
                        <small>{featured && moment(featured.snippet.publishedAt).fromNow()}</small>{' | '}
                        { <small>{featuredViews ? featuredViews : 0 } views</small>
                                }
                        {featured && <Comments videoId={featured.videoId} />
                                }
                    </Col>
                    <Col sm={6}>
                    <div className="bio-featured-stats">
                    {featured && <div className="bio-sub-title-wrapper">
                                    <img alt={featured.carData.name} src={require(`../../assets/maker_logos/${featured.makeTitle}_Logo.png`).default}  className="icon-f" loading="lazy" />
                                    <h3 className="sub-title" style={{fontSize: '1.75rem'}}>{featured.carData.year}{' '}{featured.makeTitle} {' '}{featured.modelTitle}</h3>
                                 </div>
                    }
                            
                                <div className="stats-div">
                                    {featured && switchTabs(featured.carData, 'Main Stats')}
                                </div>
                                {featured && 
                                    <Link 
                                        to={{
                                            pathname: `/car-stats/${featured.carData.make}/${featured.carData.year}/${featured.carData.model.toLowerCase()}/${featured.carData._id.toString()}`
                                        }}
                                        >
                                        <div className="btn-spec" style={{margin: '0 20px'}}>
                                            See more stats
                                        </div>
                                    </Link>
                                }
                        
                                </div>
                                <div className="bio-desc-wrapper">
                                <div className="spacer-2rem"></div>
                                <input className="acd-input" type="checkbox" id={`title-featured`} />
                                        
                                <label className="show-label" htmlFor={`title-featured`} className="acd-label">Show </label>
                                <div className="desc-box-featured">
                                    { featured && featured.snippet.description}
                                </div> 
                                <div className="content">
                                {featured &&
                                    <small className="wrap-text-desc" dangerouslySetInnerHTML={{ __html: urlify(featured.snippet.description) }}></small>
                                }
                                    
                                </div>
                                <div className="spacer-4rem"></div>
                                <div className="ad-featured">
                                <div id={`unit-${adFeatured}`} className="tmsads"></div>
                                </div>
                            </div>
                        
                    </Col>
                </Row>
                <div className="spacer-4rem"></div>
                <h2 className="title">Recent Vlogs</h2>
                <Row className="bio-main-row">
                { latestVideos && 
                    latestVideos.map((video, index) =>{
                        const str = video.carData.model
                        const model = str.charAt(0).toUpperCase() +str.slice(1)
                        const name = video.carData.make
                        const titleCase = name.charAt(0).toUpperCase() +name.slice(1)
                        const date = moment(video.snippet.publishedAt).fromNow()
                        let price;
                        const car = video.carData
                        let weight = video.carData.features.Measurements["Curb weight"]
                        
                        if(video.carData.price && video.carData.price.baseMSRP){
                            price = numberWithCommas(video.carData.price.baseMSRP)
                        }else{ price = ''}
                        if(weight){
                            weight = numberWithCommas(weight)
                        }else{
                            weight= 'N/A'
                        }
                        return (
                        <Fragment key={video.videoId}>
                        <Col sm={6} >
                        <Row>
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
                   
                                <h3 style={{marginTop:'10px'}}>{video.snippet.title}</h3>
                                <small>{date}</small> {' |'}
                                { <small>{views[index] ? views[index] : 0 } views</small>
                                }
                                <input className="acd-input" type="checkbox" id={`title${index}`} />
                                    
                                <label htmlFor={`title${index}`} className="acd-label">Show </label>
                                <div className="desc-box">
                                    {video.snippet.description}
                                </div> 
                                <div className="content">
                                    <small className="whole-desc" dangerouslySetInnerHTML={{ __html: urlify(video.snippet.description) }}></small>
                                </div>
                                <div className="spacer-4rem"></div>
                                <Comments videoId={video.videoId}/>
                            </Col>
                            <Col sm="auto" className="bio-stats">
                                <div className="ad-size">
                      
                                <SpecDiv video={video} titleCase={titleCase} price={price} model={model} dataid={video.carDataId} weight={weight}/>
                                <div className="ad-container">
                                    <div id={`unit-${adInfluencer[index]}`} className="tmsads" key={Math.random()}></div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    </Fragment>)
                    })
                }
            </Row>
       
            </div>
        </Layout>
        
    )
}


const mapDispatchToProps = (dispatch) =>{
    return{
        
    }
}
const mapStateToProps = (state) => {
    //syntax is propName: state.key of combineReducer.key
    return{
      username: state.user.username,
      mongo: state.auth.mongo
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(BioPage)

