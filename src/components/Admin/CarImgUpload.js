import React, { useState, useEffect } from 'react'
import {logOutUser} from '../../store/actions/authActions'
import { connect } from 'react-redux'
import {Helmet} from "react-helmet"
import { Container, Form, Button, Alert } from 'react-bootstrap'
// import AdminLoginDiv from './AdminLoginDiv'
import jwt from 'jsonwebtoken'
import * as Realm from "realm-web"
import loadable from '@loadable/component'
import { carsAllYear, carYears } from '../carTempData'

const appConfig = {
    id: process.env.REACT_APP_REALM_APP_ID,
    timeout: 10000, // timeout in number of milliseconds
  };
const app = new Realm.App(appConfig);

const AdminLoginDiv = loadable(() => import('./AdminLoginDiv'))

const CarImgUpload = (props) =>{
    // const carmake = 'lamborghini'
    // const caryear = '2016'
    const [carObj, setCarObj] = useState({})
    // const year = 2016
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
    const bucketName = process.env.REACT_APP_BUCKET_NAME_CAR
    const baseUrl = 'https://s3.amazonaws.com/thesmokeshow'

    const changeUserObj = (e) =>{
        setUserObj({
            ...userObj,
            [e.target.name]: e.target.value
        })
        
    }
    const picUploadNiceId = (e) =>{
        console.log('car obj', carObj)
        const file = e.target.files[0] 
        console.log('file', file)
        let arr = file.name.split('_')
        arr.shift()
        console.log('arr', arr)
        let str = arr.join('')
        const index = str.lastIndexOf('.')
        const trimmed = str.slice(0, index)
        // console.log('name?', trimmed.replaceAll("-", " "))
        // // setCarName(trimmed.replaceAll("-", " "))
        // const replaced = trimmed.replace(':', '/')
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
    const picUpload = (e) =>{
        console.log('car obj', carObj)
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
        const replaced = trimmed.replace(':', '/')
        setCarName(replaced)
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
    const handleChange = (e) =>{
        setCarObj({
            ...carObj,
            [e.target.name]: e.target.value
        })

        console.log(e.target.value)
        console.log(carObj)
    }
    const savePicNiceId = async () =>{
        console.log('pic', pic)
        console.log(carObj)
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionCars = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("cars")

        const filekey = `/${carObj.make}/${carObj.year}/${imgName}`
        console.log(filekey)
        try {
            await app.currentUser.functions.putImageObjToS3(imgBase64, bucketName, filekey, pic.type).then(async res =>{
                console.log(res)
                
                const filter = {make: carObj.make, year: Number(carObj.year), niceId: carName}
                await collectionCars.findOne(filter).then(async data =>{
                    console.log('data', data)
                    console.log('_id', data._id)
                    // const replaced = filekey.replaceAll(" ", "+")
                    if(data){
                        await collectionCars.updateOne(
                            { _id: {"$oid": data._id.toString()}},
                            { $set: {imgUrl: baseUrl + filekey}},
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

    }
    const savePic = async () =>{
        console.log('pic', pic)
        console.log(carObj)
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionCars = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("cars")

        const filekey = `/${carObj.make}/${carObj.year}/${imgName}`
        console.log(filekey)
        try {
            await app.currentUser.functions.putImageObjToS3(imgBase64, bucketName, filekey, pic.type).then(async res =>{
                console.log(res)
                
                const filter = {make: carObj.make, year: Number(carObj.year), name: carName}
                await collectionCars.findOne(filter).then(async data =>{
                    console.log('data', data)
                    console.log('_id', data._id)
                    const replaced = filekey.replaceAll(" ", "+")
                    if(data){
                        
                        await collectionCars.updateOne(
                            { _id: {"$oid": data._id.toString()}},
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
                    <Form.Group controlId="select1">
                        <Form.Label>Slelect Make</Form.Label>
                        <Form.Control as="select" name="make" custom onChange={handleChange}>
                        {carsAllYear && carsAllYear.map(car =>{
                            return(
                                <option  value={car} key={car}>{car}</option>
                            )
                            
                        })}
                        </Form.Control>
                    </Form.Group>
                    <div className="spacer-2rem"></div>
                    <Form.Group controlId="select1">
                        <Form.Label>Example select</Form.Label>
                        <Form.Control as="select" name="year" custom onChange={handleChange}>
                        {carYears && carYears.map(year =>{
                            return(
                                <option  value={year} key={year}>{year}</option>
                            )
                            
                        })}
                        </Form.Control>
                    </Form.Group>
                    <br/><br/>
                    <Form.Group>
                        <Form.File 
                        id="exampleFormControlFile1" 
                        label="NiceId "
                        onChange={picUploadNiceId}
                        style={{background: 'aquamarine', padding: '1rem'}}
                        />
                    </Form.Group>
                    <div className="spacer-2rem"></div>
                    <Form.Group>
                        <Form.File 
                        id="exampleFormControlFile2" 
                        label="Name field"
                        onChange={picUpload}
                        style={{background: 'lightgray', padding: '1rem'}}
                        />
                    </Form.Group>
                </Form>
                <Button style={{minWidth: '200px', background: 'aquamarine', color: 'black'}}  onClick={savePicNiceId}>NiceID</Button><br/><br/><br/>
                <Button style={{minWidth: '200px'}} variant="warning" onClick={savePic}>Name -deprecated</Button>
                <br/><br/><br/>
                <Button onClick={handleLogout} variant="secondary" style={{minWidth: '200px'}}>Logout</Button><br/><br/><br/>
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