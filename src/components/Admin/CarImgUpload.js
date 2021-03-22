import React, { useState, useEffect } from 'react'
import {logOutUser} from '../../store/actions/authActions'
import { connect } from 'react-redux'
import {Helmet} from "react-helmet"
import { Container, Form, Button, Alert } from 'react-bootstrap'
// import AdminLoginDiv from './AdminLoginDiv'
import jwt from 'jsonwebtoken'
import * as Realm from "realm-web"
import loadable from '@loadable/component'

const appConfig = {
    id: process.env.REACT_APP_REALM_APP_ID,
    timeout: 10000, // timeout in number of milliseconds
  };
const app = new Realm.App(appConfig);

const AdminLoginDiv = loadable(() => import('./AdminLoginDiv'))


const CarImgUpload = (props) =>{
    const carmake = 'lamborghini'
    const caryear = '2016'
    const year = 2016
    const [userObj, setUserObj] = useState({email: '', password: ''})
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [msg, setMsg] = useState('')
    const [imgThumb, setImgThumb] = useState()
    const [pic, setPic] = useState()
    const [imgBase64, setImgBase64] = useState()
    const maxAgeTest = 1 * 60 * 60
    const [imgName, setImgName] = useState()
    const [carName, setCarName] = useState()
    const [resMsg, setResMsg] = useState()
    const bucketName = process.env.REACT_APP_AWS_BUCKET_NAME_CAR
    const baseUrl = 'https://s3.amazonaws.com/thesmokeshow'

    const changeUserObj = (e) =>{
        setUserObj({
            ...userObj,
            [e.target.name]: e.target.value
        })
    }
    const picUpload = (e) =>{

        const file = e.target.files[0] 
        console.log('file', file)
        let arr = file.name.split('_')
        arr.shift()
        console.log('arr', arr)
        let str = arr.join('')
        const index = str.lastIndexOf('.')
        const trimmed = str.slice(0, index)
        console.log('name?', trimmed.replaceAll("-", " "))
        // setCarName(trimmed.replaceAll("-", " "))
        setCarName(trimmed)
        // setImgName(file.name.replaceAll("-", " "))
        setImgName(file.name)
        setPic(e.target.files[0])
        setImgThumb(URL.createObjectURL(e.target.files[0]))
        const reader = new FileReader()
        reader.onload = (event) => {
        const base64 = event.target.result.split(",").pop()
          setImgBase64(base64)
        };
        reader.readAsDataURL(file)
    }
    const savePic = async () =>{
        console.log('pic', pic)
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionCars = mongo.db("smoke-show").collection("cars")

        const filekey = `/${carmake}/${caryear}/${imgName}`
        console.log(filekey)
        console.log(carName)
        try {
            await app.currentUser.functions.putImageObjToS3(imgBase64, 'thesmokeshow', filekey, pic.type).then(async res =>{
                console.log(res)
                const filter = {make: carmake, year: year, name: carName}
                await collectionCars.findOne(filter).then(async data =>{
                    console.log('data', data)
                    console.log('_data', data._id)
                    const replaced = filekey.replaceAll(" ", "+")
                    if(data){
                        await collectionCars.updateOne(
                            { _id: data._id},
                            { $set: {imgUrl: baseUrl + replaced}},
                            { upsert: true}
                        ).then(res =>{
                            console.log(res)
                        })
                    }
                })
            })
        } catch (error) {
            console.log(error)
        }
   
        // if(result){
        //     console.log(result)
        //     setResMsg(true)
        // }else{
        //     console.log('fail')
        // }
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
                <img src={imgThumb ? imgThumb : ''} 
                    style={{width: '200px', height: '200px', objectFit: 'cover'}}
                />
                <p>{pic && pic.name}</p>
                <p>uploading url: {imgName && imgName}</p>
                {resMsg && <Alert variant="success">Uploaded</Alert>}
                <Form style={{width: '500px', margin: '2rem auto', }}>
                    <Form.Group>
                        <Form.File 
                        id="exampleFormControlFile1" 
                        // label="Example file input"
                        onChange={picUpload}
                        />
                    </Form.Group>
                </Form>
                <Button style={{minWidth: '200px'}} onClick={savePic}>Upload an image</Button>
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
export default connect(null, mapDispatchToProps)(CarImgUpload)