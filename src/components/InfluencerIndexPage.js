import React, { useEffect, useState } from 'react'
import {Helmet} from "react-helmet"
import { Row, Col, Card, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import * as Realm from "realm-web"
import { uid } from 'react-uid'
import { NavLink } from 'react-router-dom'
import Layout from './Layout/Layout'
import './influencerIndexPage.scss'
import jwt from 'jsonwebtoken'


const InfluencerIndexPage = () =>{

    const videoEmbedURL = 'https://www.youtube.com/embed/'

    const [influencers, setInfluencers] = useState([])
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
      };
    const app = new Realm.App(appConfig);
   

    const getInfluencers = async (credentials) =>{

        try{
            await app.logIn(credentials).then(async user =>{
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const mongoCollection = mongo.db("smoke-show").collection("influencers")
                try {
            
                    const filter = {isActive: true} 
                    await mongoCollection.find(filter).then(resAll =>{
                        console.log('find all', resAll);
                        setInfluencers(resAll)
                    })
                   
                 }catch(error){console.log(error)}
            })
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        let token = sessionStorage.getItem('session_token')
        if(token){
            jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, decoded)=>{
                if(err){
                    console.log(err)
                    const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    getInfluencers(credentials)
                }else{
                    const credentials = Realm.Credentials.emailPassword(decoded.userData.login.email, decoded.userData.login.password)
                    getInfluencers(credentials)
                }
            });
            
         }else{
            const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
            getInfluencers(credentials)
         }
        

      }, [])

    return(
        <Layout>
        <Helmet>
          <meta charSet="utf-8" />
          <title>All influencers | The Smoke Show</title>
          <meta name="description" content="Check out our influencers / authors" />
          <meta name="robots" content="noindex, nofollow" />
          {/* <link rel="canonical" href="http://mysite.com/example" /> */}
        </Helmet>
            <div className="main-wrapper footer-pos">
                <div className="spacer-4rem"></div>
                <div className="title title-adj">
                    <h2 >All Influencers</h2>
                </div>
                <Row style={{paddingLeft:'-7px', paddingRight:'-7px'}}>
                {influencers && influencers.map(influencer =>{
                    return(
                        <Col sm={6} md={4} key={uid(influencer)}>
                            <Card className="card-influencer" >
                                <div className="videoWrapper">
                                        <iframe src={videoEmbedURL + influencer.featuredVideo.id}
                                                frameBorder='0'
                                                allow='autoplay; encrypted-media'
                                                allowFullScreen
                                                title='video'
                                        />
                                </div>
                                <Card.Body>
                                    <Card.Title>{influencer.username}</Card.Title>
                                    <Card.Text className="influencer-desc">{influencer.desc}</Card.Text>
                                    <NavLink 
                                    to={{
                                        pathname: `/influencer/${influencer.userId}`,
                                        state: { influencer: influencer }
                                        // influencer: influencer
                                    }}
                                    activeStyle={{
                                        color: "gray"
                                    }}
                                    >
                                        <Button className="login-btn">See {influencer.username}'s Bio</Button>
                                    </NavLink>
                                    
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                    
                })}
                
                </Row>
                <div className="spacer-4rem"></div>
            </div>
        </Layout>
        
    )
}
const mapStateToProps = (state) => {
    //syntax is propName: state.key of combineReducer.key
    return{
      username: state.user.username,
    }
  }

export default connect(mapStateToProps)(InfluencerIndexPage)

