import React, { Fragment, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import Layout from '../Layout/Layout'
import { Helmet } from "react-helmet"
import SubNav from './SubNav'
import * as Realm from "realm-web"
import './social.scss'
import { getInfluencer }from '../../store/actions/influencerActions'
import instaIcon from '../../assets/social/instagram.svg'
import fbIcon from '../../assets/social/facebook.svg'
import twitterIcon from '../../assets/social/twitter.svg'
import tiktokIcon from '../../assets/social/TikTok.svg'
import amazonIcon from '../../assets/social/Amazon-Affiliate-program.jpg'
import { connect } from 'react-redux'
import jwt from 'jsonwebtoken'

const Social = (props) =>{
    let today = new Date()
    const timeISO = today.toISOString()
    let published = new Date('2021-03-01')
    const publishedISO = published.toISOString()
    const slug = 'social'
    let userIdParam;
    const name = props.match.params.username
    if(name === 'EddieX'){
        userIdParam = '60230361f63ff517d4fdad14'
    }else if(name === 'Lexurious-Fleet'){
        userIdParam = '602303890ff2832f7d19a2af'
    }
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
      };
    const app = new Realm.App(appConfig);
    const [influencer, setInfluencer] = useState({profileCover: '', profilePic: '', username: '', userId: '', social: {instagram: '', facebook: '', twitter: ''}})

    const userLogin =async (cre) =>{
         try{
             await app.logIn(cre).then(user =>{
                 console.log('user logged in', user.id)
             })
         }catch(err){console.log(err)}
    }
    const loginCheck = () =>{
        const tokenUser = sessionStorage.getItem('session_user')
        if(tokenUser){
            jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, function(err, decoded) {
                if (err) {
                    // timeout
                    const cre = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    userLogin(cre)
                    
                }else{
                    userLogin(decoded.cre)
                }
              });
            
        }else{
            const cre = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
            userLogin(cre)
        }
    }
    useEffect(() => {
        if(props.influencerObj.username){
            setInfluencer(props.influencerObj)
        }
        
    }, [props.influencerObj])

    useEffect(() => {
        loginCheck()
        props.getInfluencer(userIdParam)
    }, [])
    return(
        <Fragment>
            <Helmet>
                <title>Influencer Social Media Links | The Smoke Show</title>
                <meta name="description" content={`Check out ${name}'s social media links here. Stay in touch and come back to The Smoke Show`} />
                <link rel="canonical" href={`https://thesmokeshow.com/influencer/${name}/${slug}/`} />
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
                        "@id": "https://thesmokeshow.com/influencer/${name}/${slug}/#webpage", "url": "https://thesmokeshow.com/influencer/influencer/${name}/${slug}/", "name": "Giveaways | The Smoke Show","isPartOf":{"@id":"https://thesmokeshow.com/#website"}, "datePublished": "${publishedISO}", "dateModified": "${timeISO}", "description": "Check out ${name}'s social media links here. Stay in touch and come back to The Smoke Show", "breadcrumb":{"@id":"https://thesmokeshow.com/influencer/${name}/${slug}/#breadcrumb"},"inLanguage":"en","potentialAction":[{"@type":"ReadAction","target":["https://thesmokeshow.com/influencer/${name}/${slug}/"]}]},
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
                                "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/influencers/${name}/${slug}","url":"https://thesmokeshow.com/influencers/${name}//${slug}","name":"Swagg links from Influencer ${name}"}
                            }
                            ]}
                        ]
                    }
                `}
        </script>
            </Helmet>
            <Layout>
                <div className="main-wrapper">
                    <div className="spacer-4rem"></div>
                    <SubNav influencer={influencer} formattedFans={props.formattedFans} username={name} />
                    <div className="spacer-4rem"></div>
                    <h2 className="title">{influencer.username} Social Media</h2>
                    <div className="spacer-4rem"></div>
                    <Row>
                        <Col sm={6}>
                            <ul style={{listStyle: 'none'}}>
                            {influencer.social.instagram  && 
                                <li className="social-media-container">
                                    <Link to={influencer.social.instagram}>
                                        <img className="social-img" src={instaIcon} alt="Instagram" />
                                        <p className="social-text">{influencer.social.instagram}</p>
                                    </Link>
                                </li>
                            }
                            
                            {influencer.social.facebook && 
                                <li className="social-media-container">
                                    <Link to={influencer.social.facebook}>
                                        <img className="social-img" src={fbIcon} alt="Instagram" />
                                        <p className="social-text">{influencer.social.facebook}</p>
                                    </Link>
                                </li>
                            }
                            {influencer.social.twitter && 
                                <li className="social-media-container">
                                    <Link to={influencer.social.twitter}>
                                        <img className="social-img" src={twitterIcon} alt="Instagram" />
                                        <p className="social-text">{influencer.social.twitter}</p>
                                    </Link>
                                </li>
                            }
                            {influencer.social.tiktok && 
                                <li className="social-media-container">
                                    <Link to={influencer.social.tiktok}>
                                        <img className="social-img" src={tiktokIcon} alt="Instagram" />
                                        <p className="social-text">{influencer.social.tiktok}</p>
                                    </Link>
                                </li>
                            }
                            </ul>
                        </Col>
                        <Col sm={6}>
                            <ul style={{listStyle: 'none'}}>
                            {influencer.social.amazon && 
                                <li className="social-media-container">
                                    <Link to={influencer.social.amazon}>
                                        <img className="social-img" src={amazonIcon} alt="Instagram" />
                                        <p className="social-text">{influencer.social.amazon}</p>
                                    </Link>
                                </li>
                            }
                            </ul>
                        </Col>
                    </Row>
                    
                </div>
            </Layout>
        </Fragment>
        
    )
}
const mapDispatchToProps = (dispatch) =>{
    return{
        getInfluencer: (id)=> dispatch(getInfluencer(id))
    }
}
const mapStateToProps = (state)=>{
    return{
        influencerObj: state.influ.influencerObj,
        formattedFans: state.influ.formattedFans
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Social)