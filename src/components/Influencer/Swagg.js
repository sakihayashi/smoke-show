import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../Layout/Layout'
import { Helmet } from "react-helmet"
import * as Realm from "realm-web"
import SubNav from './SubNav'
import { Row, Col } from 'react-bootstrap'
import './social.scss'
import teeSpringIcon from '../../assets/swagg/teespring-logo.jpg'
import printfulIcon from '../../assets/swagg/printful.jpg'
import { getInfluencer }from '../../store/actions/influencerActions'
import jwt from 'jsonwebtoken'
import { connect } from 'react-redux'


const SwaggInfluencer = (props) =>{
    const [influencer, setInfluencer] = useState({profileCover: '', profilePic: '', username: '', userId: '', swagg: {teeSpring: '', printful: ''}})
    const [formattedFans, setFormattedFans] = useState('')
    const [noData, setNodata] = useState(false)
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
      };
    const app = new Realm.App(appConfig)
    const userIdParam = props.match.params.id
    const getData = async () =>{
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionInfluencer = mongo.db("smoke-show").collection("influencers")
        const filter = {userId: userIdParam}
        try{
            await collectionInfluencer.findOne(filter).then(user =>{
                setInfluencer(user)
                if(!user.swagg.teeSpring && !user.swagg.printful) setNodata(true)
                if(user.fans > 999){
                    setFormattedFans(Math.sign(user.fans)*((Math.abs(user.fans)/1000).toFixed(1)) + 'k')
                }else{
                    setFormattedFans(Math.sign(user.fans)*Math.abs(user.fans))
                }

            })
        }catch(err){ console.log(err) }
    }
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

        if(typeof(props.influencerObj.swagg) !== 'undefined'){
            setInfluencer(props.influencerObj)
            if(!props.influencerObj.swagg.teeSpring && !props.influencerObj.swagg.printful) setNodata(true)
        }
        
    }, [props.influencerObj])

    useEffect(() => {
        // getData()
        loginCheck()
        props.getInfluencer(userIdParam)
    }, [])
    return(
        <Fragment>
            <Helmet>
                <title>Swagg Influencer | The Smoke Show</title>
            </Helmet>
            <Layout>
                <div className="main-wrapper" style={{minHeight: 'calc(100vh - 21rem)'}}>
                    <div className="spacer-4rem"></div>
                    <SubNav influencer={influencer} formattedFans={props.formattedFans}/>
                    <div className="spacer-4rem"></div>
                    <h2 className="title">{influencer.username} Swagg</h2>
                    <div className="spacer-4rem"></div>
                    <Row>
                        <Col sm={6}>
                            <ul style={{listStyle: 'none'}}>
                                { noData && <p>No Swagg</p>}
                                { influencer.swagg.teeSpring &&
                                <li className="social-media-container">
                                    <Link to={influencer.swagg.teeSpring}>
                                        <img src={teeSpringIcon} alt="Teespring" className="social-img"/>
                                        <p className="social-text">{influencer.swagg.teeSpring}</p>
                                    </Link>
                                </li>
                                }
                                {influencer.swagg.printful && 
                                <li className="social-media-container">
                                    <Link to={influencer.swagg.teeSpring}>
                                        <img src={printfulIcon} alt="Printful" className="social-img"/>
                                        <p className="social-text">{influencer.swagg.printful}</p>
                                    </Link>
                                </li>
                                }
                            </ul>
                        </Col>
                        <Col sm={6}>
                            
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

export default connect(mapStateToProps, mapDispatchToProps)(SwaggInfluencer)