import React from 'react'
import {Helmet} from "react-helmet"
import { Row, Col, Button } from 'react-bootstrap'
import Layout from './Layout/Layout'
import './about.scss'
import * as Realm from "realm-web"


const AboutPage = () =>{
    // const id = process.env.REACT_APP_REALM_APP_ID
    // const config = { id };
    // const app = new Realm.App(config);
    // const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
    // const checkRes = async () =>{
    //     try {

    //         await app.logIn(credentials).then( async user =>{
    //             const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
    //             const collectionUsers = mongo.db("smoke-show").collection("users")
    //             const filter = {username: 'smokySaki'}
    //             try {
    //                 await collectionUsers.findOne(filter).then(res =>{
    //                     console.log(res)
    //                     if(res){
    //                         console.log('null read?')
    //                     }else{
    //                         console.log('null is false')
    //                     }
    //                 })
    //             } catch (error) {
                    
    //             }
    //         })
    //     } catch (error) {
            
    //     }
    // }
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
                <p className="about-p">
                Tired of BigTech and Old School Auto Magazines?<br />
                 Welcome to The Smoke Show, aka the world’s best auto social platform. <br /><br />
                 What are we trying to achieve? That’s simple, compiling everything we like to see, all in one place, and cutting out everything we don’t. <br /><br />
                 The Smoke Show lets users have more fun, gives more control to creators, and further analytics to relevant advertisers. The Smoke Show is a home for auto fans, built by auto fans.
                </p>
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
        {/* <center><Button onClick={checkRes}>click me</Button></center> */}
     </Layout>
 )
}

export default AboutPage