import React, { useEffect, useState, Fragment } from 'react'
import { Helmet } from "react-helmet"
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as Realm from "realm-web"
// import Avatar from 'react-avatar'
import './bioPage.scss'
import ReactPlayer from 'react-player/lazy'

import Layout from '../Layout/Layout'
import jwt from 'jsonwebtoken'
import loadable from '@loadable/component'
import moment from 'moment'
import { switchTabs } from '../functionsStats'

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
    }else if(name === 'Lexurious-Fleet'){
        influencerId = '602303890ff2832f7d19a2af'
    }

    const [featured, setFeatured] = useState()
    const [influencer, setInfluencer] = useState({userId: '', fname: '', lname: '', username: '', fans: null, desc: '', channelId: '', banner_img: '', profile_pic: '', featuredVideo: {id: '', title: ''}})

    const [formattedFans, setFormattedFans] = useState('')

    // const videoEmbedURL = 'https://www.youtube.com/embed/'
 
    const [latestVideos, setLatestVideos] = useState([])
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
      };
    const app = new Realm.App(appConfig);

    const numberWithCommas = (x) =>{
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const getInfluencer = async (mongo) =>{

            try {
                const mongoCollection = mongo.db("smoke-show").collection("influencers");
                const replaced = name.replace('-', ' ')
                const filter = {username: replaced} 
                await mongoCollection.findOne(filter).then( async res =>{
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
        
        if(videos){
            const results = videos.map(async video =>{
                const filterCar = {_id: {"$oid": video.carDataId}}
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
                                width="560" 
                                height="315"
                                url={videoWatchURL + featured.videoId}
                                controls={true}
                                />
                        }
                        </div>
                        <h3 style={{marginTop:'10px'}}>{featured && featured.snippet.title}</h3>
                        <small>{featured && moment(featured.snippet.publishedAt).fromNow()}</small>
                        {featured && <Comments videoId={featured.videoId} />
                                }
                    </Col>
                    <Col sm={6}>
                    <div className="bio-featured-stats">
                    {featured && <div className="bio-sub-title-wrapper">
                                    <img alt={featured.carData.name} src={require(`../../assets/maker_logos/${featured.makeTitle}_Logo.png`).default}  className="icon-f" loading="lazy" />
                                    <h3 className="sub-title" style={{fontSize: '1.75rem'}}>{featured.makeTitle} {' '}{featured.carData.year}{' '}{featured.modelTitle}</h3>
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
                                    <small className="wrap-text-desc">{featured && featured.snippet.description}</small>
                                </div>
                                <div className="spacer-2rem"></div>
                                
                            </div>
                            {/* </Col>
                            <Col sm="auto" className="bio-stats"> */}
                            
                            {/* {featured && 
                                <SpecDiv titleCase={featured.makeTitle} price={featured.price} video={featured} dataid={featured.carDataId} model={featured.modelTitle}/>
                            } */}
                                
                            {/* </Col>
                        </Row> */}
                        
                        
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
                                width="560" 
                                height="315"
                                url={videoWatchURL + video.videoId}
                                controls={true}
                                />
                            </div>
                                {/* <div className="videoWrapper">
                                    
                                    <iframe src={videoEmbedURL + video.videoId}
                                            frameBorder='0'
                                            allow='autoplay; encrypted-media'
                                            allowFullScreen
                                            title='video'
                                            loading='lazy'
                                    />
                                </div> */}
                                <h3 style={{marginTop:'10px'}}>{video.snippet.title}</h3>
                                <small>{date}</small>
                                <input className="acd-input" type="checkbox" id={`title${index}`} />
                                    
                                <label htmlFor={`title${index}`} className="acd-label">Show </label>
                                <div className="desc-box">
                                    {video.snippet.description}
                                </div> 
                                <div className="content">
                                    <small>{video.snippet.description}</small>
                                </div>
                                <div className="spacer-4rem"></div>
                                <Comments videoId={video.videoId}/>
                            </Col>
                            <Col sm="auto" className="bio-stats">
                                <div className="ad-size">
                      
                                <SpecDiv video={video} titleCase={titleCase} price={price} model={model} dataid={video.carDataId} weight={weight}/>
                                {/* <div className="ad-container">
                                    <p style={{color: 'gray'}}>ads will go here</p>
                                    <p style={{color: 'gray'}}> 160px x 600px <br/>for above 576px</p>
                                    <p style={{color: 'gray'}}> 300px x 250px <br/> for above 1400px </p>
                                </div> */}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    </Fragment>)
                    })
                }
            </Row>
            {/* <div className="spacer-4rem"></div> */}
            {/* <div className="title title-adj">
                <h2 style={{marginBottom: '-1rem'}}>{titleStr}</h2>
                <Form inline onSubmit={handleVideoSearch} style={{marginRight: '-8px'}}>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2 form-adj" onChange={handleChangeKeyword}/>
                </Form>
            </div> */}
            {/* <Row style={{paddingLeft:'-7px', paddingRight:'-7px'}}>
                {searchedCarData &&
                    searchedCarData.map((car, index) =>{
        
                        return <>
                        <Col sm={6} key={uid(car)}>
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
                 
                                </div>
                            </Col>
                        </Row>
                    </Col>
                        </>
                })
                }
                </Row> */}
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

