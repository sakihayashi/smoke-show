import React, { useEffect, useState } from 'react'
import {Helmet} from "react-helmet"
import { Row, Col, Card, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import * as Realm from "realm-web"
import { uid } from 'react-uid'
import { NavLink } from 'react-router-dom'
import Layout from './Layout/Layout'
import './influencerIndexPage.scss'

const InfluencerIndexPage = () =>{

    const videoEmbedURL = 'https://www.youtube.com/embed/'

    const [influencers, setInfluencers] = useState([])
    // var d = new Date();
    // var n = new Date().getTime();
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
      };
    const app = new Realm.App(appConfig);

    const getInfluencers = async () =>{
        const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTHAPI);
        try {
        //   const app = new Realm.App(appConfig);
      
          // an authenticated user is required to access a MongoDB instance
          await app.logIn(credentials).then( async user =>{
            const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
            const mongoCollection = mongo.db("smoke-show").collection("influencers");
            const filter = {isActive: true} 
            await mongoCollection.find(filter).then(resAll =>{
                console.log('find all', resAll);
                setInfluencers(resAll)
            })
           
          }
          )
         }catch(error){console.log(error)}
    }

    useEffect(() => {
        getInfluencers()

      }, [])

    return(
        <Layout>
        <Helmet>
          <meta charSet="utf-8" />
          <title>The list of influencers | The Smoke Show</title>
          <meta name="description" content="Check out our influencers / authors" />
          <meta name="robots" content="noindex, nofollow" />
          {/* <link rel="canonical" href="http://mysite.com/example" /> */}
        </Helmet>
            <div className="main-wrapper footer-pos">
                <div className="spacer-4rem"></div>
                <div className="title title-adj">
                    <h2 >List of Influencers</h2>
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

