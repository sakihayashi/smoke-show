import React from 'react'
import {Helmet} from "react-helmet"
import { Row, Col } from 'react-bootstrap'
import Layout from './Layout/Layout'
import './about.scss'

const AboutPage = () =>{
    
 return(
     <Layout>
     <Helmet>
        <meta charSet="utf-8" />
        <title>About Us | The Smoke Show</title>
        <meta name="description" content="Who we are and how we started The Smoke Show. Stay in touch." />
        <meta name="robots" content="noindex, nofollow" />

        {/* <link rel="canonical" href="http://mysite.com/example" /> */}
    </Helmet>
        <div className="spacer-4rem"></div>
        <div className="main-wrapper">
            <div className="mission-wrapper">
                <h4 className="theme-text-color">The Smoke Show Mission Statement</h4>
                <div className="spacer-2rem"></div>
                <p className="about-p">We are tired of old school auto magazine. Our goal is to create he next generation of the auto community, by consolidating car entertainment and information. Everything you want to see, with nothing that you don’t. This will be a home for Auto Fans, built by auto fans.</p>
            </div>
            <div className="spacer-4rem"></div>
            <Row>
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
     </Layout>
 )
}

export default AboutPage