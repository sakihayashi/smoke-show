import React from 'react'
import {Helmet} from "react-helmet"
import Layout from './Layout/Layout'
import { Row  } from 'react-bootstrap'
import './giveaways.scss'
import { giveAwaysArr } from './giveAwayData'
import { openLoginModal, attachMsg, swapToSignup } from '../store/actions/authActions'
import { connect } from 'react-redux'
// import {
//     EmailShareButton,
//     FacebookShareButton,
//     TwitterShareButton,
//   } from "react-share";
// import short from 'short-uuid'
// import { FacebookShareCount } from "react-share";

// import facebookIcon from '../assets/global/Facebook-icon.svg'
// import twitterIcon from '../assets/global/Twitter-icon.svg'
// import emailIcon from '../assets/global/Messages-icon.svg'
import GiveawayCount from './GiveawayCount'

const Giveaways = (props) =>{
    const sharePathname = props.location.pathname
    const shareUrl = `https://thesmokeshow.com/${sharePathname}`
    let today = new Date()
    const timeISO = today.toISOString()
    let published = new Date('2021-03-01')
    const publishedISO = published.toISOString()
    const slug = 'giveaways'
    return(
        <Layout>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Giveaways | The Smoke Show</title>
            <meta name="description" content="Checkout our giveaways and entry now to win!" />
            
            <link rel="canonical" href="https://thesmokeshow.com/giveaways" />
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
                        {"@type": "WebPage",
                        "@id": "https://thesmokeshow.com/giveaways/#webpage", "url": "https://thesmokeshow.com/giveaways/", "name": "Giveaways | The Smoke Show","isPartOf":{"@id":"https://thesmokeshow.com/#website"}, "datePublished": "${publishedISO}", "dateModified": "${timeISO}", "description": "The Smoke Show is a home for auto fans, built by auto fans. The best place to watch Car Vloggers and find all Car Info. Learn all about giveaways and buy swag!", "breadcrumb":{"@id":"https://thesmokeshow.com/giveaways/#breadcrumb"},"inLanguage":"en","potentialAction":[{"@type":"ReadAction","target":["https://thesmokeshow.com/giveaways/"]}]},
                        {"@type":"BreadcrumbList","@id":"https://thesmokeshow.com/#breadcrumb",
                        "itemListElement":[{
                            "@type":"ListItem","position":1,
                            "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/","url":"https://thesmokeshow.com/","name":"Home"}
                            },
                            {
                                "@type":"ListItem",
                                "position":2,
                                "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/giveaways/","url":"https://thesmokeshow.com/giveaways/","name":"Giveaways"}
                            }
                            ]}
                        ]
                    }
                `}
        </script>
        </Helmet>
            <div className="spacer-4rem"></div>
            <div className="main-wrapper" style={{minHeight: 'calc(100vh - 21rem)'}}>
            <h2 className="title">Giveaways</h2>
            <div className="notice-div">
            All active giveaways in the Car Community.<br/>
            Only VERIFIED and CONFIRMED events from influencers will be found here.
            </div>
                <Row>
                <GiveawayCount data={giveAwaysArr[0]} shareUrl={shareUrl}  />
                {/* { giveAwaysArr.map(data =>{
                    const unique = short.generate()
                    return(
                        <Col sm={6} key={unique}>
                            <Card className="givaways-card">
                                <Card.Img variant="top" src={data.imgUrl} />
                                    
                                <Card.Body>
                                    <Card.Title className="card-title">
                                    <div className="card-title-text">
                                        <div className="card-left"></div>
                                        <strong>{data.item}</strong>{' '} giveaway
                                    
                                    <div className="share-btn-wrapper">
                                        <TwitterShareButton
                                            url={shareUrl}
                                            quote={data.item}
                                            className="social-share-btn"
                                        >
                                            <img src={twitterIcon} alt="share via facebook" className="share-icon"/>
                                        </TwitterShareButton>

                                        <div className="link-counter">
                                     
                                        </div>
                                        <FacebookShareButton
                                            url={shareUrl}
                                            quote={data.item}
                                            className="social-share-btn"
                                        >
                                            <img src={facebookIcon} alt="share via facebook" className="share-icon"/>
                                        </FacebookShareButton>

                                        <div className="link-counter">
                                            <FacebookShareCount url={shareUrl} className="">
                                            {count => count}
                                            </FacebookShareCount>
                                        </div>
                                        <EmailShareButton
                                            url={shareUrl}
                                            quote={data.item}
                                            className="social-share-btn"
                                        >
                                            <img src={emailIcon} alt="share via email" className="share-icon"/>
                                        </EmailShareButton>
                                        <div className="link-counter">
                                         
                                        </div>
                                    </div>
                                    </div>
                                    <p>by {data.influencer} {' '} 
                                    <span className="card-mute-text">| {data.entries.length} {' '} entries</span></p>
                                    
                                    </Card.Title>
                                    <Card.Text>
                                    <p>
                                        <strong>How to enter:</strong><br/> {data.howTo}
                                    </p><br/>
                                    <p>
                                        <strong>Details:</strong> <br/>{data.details}
                                    </p>
                                    </Card.Text>
                                    <div className="counter-div">
                                        <div className="counter-wrapper">
                                            <div className="ends-in">Ends in:</div>
                                            <div className="counter-box">
                                                <span className="timer-num">10 </span>
                                                <span className="unit-div">days</span>
                                            </div>
                                            <div className="counter-box">
                                                <span className="timer-num">12</span>
                                                <span className="unit-div">hours</span>
                                            </div>
                                            <div className="counter-box">
                                                <span className="timer-num">21</span>
                                                <span className="unit-div">minutes</span>
                                            </div>
                                            <div className="counter-box">
                                                <span className="timer-num">13</span>
                                                <span className="unit-div">seconds</span>
                                            </div>
                                        </div>
                                        <div className="padding-btn">
                                            <Button className="login-btn ">Entry now</Button>
                                        </div>
                                    </div>
                                    
                                </Card.Body>
                            </Card>
                        </Col>
                        )
                })} */}
                    
                </Row>
            </div>

        </Layout>
    )
}
const mapDispatchToProps = (dispatch)=>{
    return{
        openLoginModal: (state) => dispatch(openLoginModal(state)),
        attachMsg: (msg)=> dispatch(attachMsg(msg)),
        swapToSignup: (state) => dispatch(swapToSignup(state))
    }
}
const mapStateToProps = (state) => {
    //syntax is propName: state.key of combineReducer.key
    return{
        isLoggedIn: state.auth.isLoggedIn
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Giveaways)