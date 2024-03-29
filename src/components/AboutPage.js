import React from 'react'
import {Helmet} from "react-helmet"
import { Row, Col } from 'react-bootstrap'
import Layout from './Layout/Layout'
import './about.scss'

const AboutPage = () =>{

 let today = new Date()
 const timeISO = today.toISOString()
 let published = new Date('2021-03-01')
 const publishedISO = published.toISOString()
 const slug = 'about'
 const pageName = 'About Us'

 return(
     <Layout>
     <Helmet encodeSpecialCharacters={true}>
        <meta charSet="utf-8" />
        <title>About Us | The Smoke Show</title>
        <meta name="description" content="Who we are and how we started The Smoke Show. Stay in touch." />

        <link rel="canonical" href="https://thesmokeshow.com/about" />

        <script type="application/ld+json">
        {`
            {
                "@context": "http://schema.org",
                "@graph": [{"@type":"WebSite","@id":"https://thesmokeshow.com/#website",
                "url":"https://thesmokeshow.com/",
                "name":"The Smoke Show",
                "description":"",
                "potentialAction":[{"@type":"SearchAction","target":"https://thesmokeshow.com/search?s={search_term_string}","query-input":"required name=search_term_string"}],
                "inLanguage":"en"},
                {"@type": "WebPage",
                "@id": "https://thesmokeshow.com/${slug}/#webpage", "url": "https://thesmokeshow.com/${slug}/", "name": "${pageName} | The Smoke Show","isPartOf":{"@id":"https://thesmokeshow.com/#website"}, "datePublished": "${publishedISO}", "dateModified": "${timeISO}", "description": "The Smoke Show is a home for auto fans, built by auto fans. The best place to watch Car Vloggers and find all Car Info. Learn all about giveaways and buy swag!", "breadcrumb":{"@id":"https://thesmokeshow.com/${slug}/#breadcrumb"},"inLanguage":"en","potentialAction":[{"@type":"ReadAction","target":["https://thesmokeshow.com/${slug}/"]}]},
                {"@type":"BreadcrumbList","@id":"https://thesmokeshow.com/#breadcrumb",
                "itemListElement":[{
                    "@type":"ListItem","position":1,
                    "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/","url":"https://thesmokeshow.com/","name":"Home"}
                    },
                    {
                        "@type":"ListItem",
                        "position":2,
                        "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/${slug}/","url":"https://thesmokeshow.com/${slug}/","name":"${pageName}"}
                    }
                    ]}
                ]
            }
        `}
        </script>
        

    </Helmet>
        <div className="spacer-4rem"></div>
        <div className="main-wrapper">
            <div className="mission-wrapper">
                <h1 className="theme-text-color theme-text-p">The Smoke Show Mission Statement</h1>
                <div className="spacer-2rem"></div>
                <p className="about-p">
                Tired of BigTech and Old School Auto Magazines?<br />
                 Welcome to The Smoke Show, aka the world’s best auto social platform. <br /><br />
                 What are we trying to achieve? That’s simple, compiling everything we like to see, all in one place, and cutting out everything we don’t. <br /><br />
                 The Smoke Show lets users have more fun, gives more control to creators, and further analytics to relevant advertisers. The Smoke Show is a home for auto fans, built by auto fans.
                </p>
            </div>
            <div className="spacer-4rem"></div>
            <Row className="p-lr-4">
                <Col sm={6} className="mb-2rem">
                <div className="contact-div">
                    <h3 className="theme-text-color">Become an influencer</h3>
                    <p className="contact-p">
                    Want your video to be featured on the site?
                    <br /><br />
                    Chat with us at:
                    <br /><br />
                    hello@thehoongroup.com
                    </p>
                </div>
                </Col>
                <Col sm={6} className="mb-2rem" >
                <div className="contact-div">
                    <h3 className="theme-text-color">Advertising with us</h3>
                    <p className="contact-p">Want to have a direct channel for advertising next to sponsored content and reaching the automotive community?
                    <br /><br />
                    Reach out to us at:
                    <br /><br />
                    sales@thehoongroup.com
                    </p>
                </div>
                </Col>
                <Col sm={6} className="mb-2rem">
                <div className="contact-div">
                    <h3 className="theme-text-color">Support</h3>
                    <p className="contact-p">
                    Having technical trouble?
                    <br /><br />
                    Send us an email at:
                    <br /><br />
                    support@thehoongroup.com
                    </p>
                </div>
                </Col>
                <Col sm={6} className="mb-2rem">
                <div className="contact-div">
                    <h3 className="theme-text-color">Feedback</h3>
                    <p className="contact-p">We thrive on feedback, do you have some suggestion to improve The Smoke Show?

                    <br /><br />
                    Send it our way at:
                    <br /><br />
                    feedback@thehoongroup.com
                    </p>
                </div>
                </Col>
            </Row>
        </div>
        <div className="spacer-4rem"></div>
        {/* <center><Button onClick={checkRes}>click me</Button></center> */}
     </Layout>
 )
}

export default AboutPage