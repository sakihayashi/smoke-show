import React, { useState, useEffect } from 'react'
import {logOutUser} from '../../store/actions/authActions'
import { connect } from 'react-redux'
import {Helmet} from "react-helmet"
import { Container, Form, Button, Alert } from 'react-bootstrap'
import AdminLoginDiv from './AdminLoginDiv'
import jwt from 'jsonwebtoken'
import * as Realm from "realm-web"
const appConfig = {
    id: process.env.REACT_APP_REALM_APP_ID,
    timeout: 10000, // timeout in number of milliseconds
  };
const app = new Realm.App(appConfig);

const CreateSiteMap = (props) =>{
  
    const [userObj, setUserObj] = useState({email: '', password: ''})
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [msg, setMsg] = useState('')
    const [uniqArr, setUniqArr] = useState([])
    const [finalArr, setFinalArr] = useState(null)

    const maxAgeTest = 1 * 60 * 60
    const getData = async () =>{

        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionYoutube = mongo.db("smoke-show").collection("youtube-videos")
        const collectionCars = mongo.db("smoke-show").collection("cars")
        const collectionManual = mongo.db("smoke-show").collection("cars-manual")
        const collectionData = mongo.db("smoke-show").collection("cars-data-analysis")
        
        const filter = {userId: '602303890ff2832f7d19a2af'}
        
        try {
            await collectionYoutube.find(filter).then(videos =>{
                const results = videos.map(video =>{
                    return video.carDataId
                })
                Promise.all(results).then(async res =>{
                    const unique = [...new Set(res)]
                    console.log('ids', unique)
                    const filter = {name: 'EddieX'}
                    const found = await collectionData.findOne(filter)
                    const dataArr = found.data.map(obj =>{
                        return obj
                    })
                    const combined = unique.concat(dataArr)
                    const uniqueFinal = [...new Set(combined)]
                    // setUniqArr(uniqueFinal)
                    const fulldata = uniqueFinal.map(async id =>{
                        const filter = {_id: {$oid: id}}
                        const res = await collectionCars.findOne(filter)
                        // console.log('data', res)
                        if(res){
                            return res
                        }else{
                            const manualRes = await collectionManual.findOne(filter)
                            return manualRes
                        }
                        
                    })
                    Promise.all(fulldata).then(all=>{
                        console.log('check final'. all)
                        setFinalArr(all)
                    })
                })
            })
        } catch (error) {
            
        }
    }
    const changeUserObj = (e) =>{
        setUserObj({
            ...userObj,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmitLogin = async (e) =>{
        setMsg('')
        e.preventDefault()
        const emailLowerCase = userObj.email.toLowerCase()
        const credentials = Realm.Credentials.emailPassword(emailLowerCase, userObj.password)
        try{
            app.logIn(credentials).then(async user =>{
                if(app.currentUser.id === user.id){
                    console.log('user updated')
                }else{
                    console.log('user is not updated')
                }
                setIsLoggedIn(true)
                const tokenCredentials = jwt.sign({ cre: credentials }, process.env.REACT_APP_JWT_SECRET, {expiresIn: maxAgeTest})
                sessionStorage.setItem('session_user', tokenCredentials)
      
            })
        }catch(err){
            console.log(err)
            setMsg('login fail')
        }
    }

    const handleLogout = () =>{
        props.logOutUser()
        setIsLoggedIn(false)
    }
    useEffect(() => {
        const tokenUser = sessionStorage.getItem('session_user')
        if(tokenUser){
            setIsLoggedIn(true)
        }else{
            setIsLoggedIn(false)
        }

    }, [])
    return(
<div>
        <Helmet>
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>
            {isLoggedIn ? 
            <Container className="" style={{marginTop: '4rem'}}>
                <center>
                {/* {resMsg && <Alert variant="success">Uploaded</Alert>} */}
  
                {/* <Button onClick={checkDuplicates} style={{minWidth: '200px'}} >check duplicates</Button> */}
                {finalArr && finalArr.map(data =>{
                    console.log(data.make)
                    {/* console.log(data._id.toString()) */}
                    {/* const oid = data._id.toString() */}
                    return (
                        <div>
                        {/* {`https://thesmokeshow.com/${data.make}/${data.year}/${data.model}/${data._id.toString()}`} */}
                            {`<url><loc>https://thesmokeshow.com/${data.make}/${data.year}/${data.model}/${data._id.toString()}</loc></url>`}
                            
                        </div>
                    )
                })}
                <Button onClick={getData} style={{minWidth: '200px'}} >
                data check
                </Button>
                <br/><br/><br/><br/>
                <Button onClick={handleLogout} style={{minWidth: '200px'}}>Logout</Button>
            </center>
            
            </Container>
            :
            <AdminLoginDiv handleSubmitLogin={handleSubmitLogin} handleChange={changeUserObj} msg={msg} />
            }
        </div>
    )
}
const mapDispatchToProps = (dispatch) =>{
    return{
        logOutUser: () => dispatch(logOutUser())
    }
}

export default connect(null, mapDispatchToProps)(CreateSiteMap)