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

const UpdateDB = (props) =>{
    const year = 2021
    const make = 'audi'

    const [userObj, setUserObj] = useState({email: '', password: ''})
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [msg, setMsg] = useState('')

    const maxAgeTest = 1 * 60 * 60

    const update = async () =>{
        const id = 401875194
        const filter = {id: id}
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionCars = mongo.db("smoke-show").collection("cars")
        const collectionNewCar = mongo.db("smoke-show").collection("cars-new")
        try {
            await collectionNewCar.findOne(filter).then(async newdata =>{
                const result = await collectionCars.updateOne(
                    {id: id},
                    {$set: {
                        name: newdata.name,
                        price: newdata.price,
                        totalSeating: newdata.totalSeating,
                        color: newdata.color,
                        features: newdata.features,
                        typeCategories: newdata.typeCategories,
                        modelName: newdata.modelName,
                        niceId: newdata.niceId
                    }},
                    { upsert: true }
                )
                if(result){
                    console.log(result)
                }else{
                    console.log('fail')
                }
            })
        } catch (error) {
            
        }
    }

    const checkDuplicates = async () =>{
        const year = 2020
        const make = 'audi'
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionCars = mongo.db("smoke-show").collection("cars")
        const collectionNewCar = mongo.db("smoke-show").collection("cars-new")
        const filter = {year: year, make: make}
        
        try {
            await collectionCars.find(filter).then(cars =>{
                const results = cars.map(car =>{
                    return car.id
                })
                Promise.all(results).then(res =>{
                    console.log('original', res.length)
                    const uniq = [...new Set(res)];
                    console.log('removed duplicates', uniq.length)

                    let duplicates = [...res]
                    uniq.forEach((item) => {
                    const i = duplicates.indexOf(item)
                    duplicates = duplicates
                        .slice(0, i)
                        .concat(duplicates.slice(i + 1, duplicates.length))
                    })
                    console.log(duplicates) 
                })
            })
        } catch (error) {
            
        }
    }

    const storeData = async () =>{
        const filter = {year: 2020}
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionCars = mongo.db("smoke-show").collection("cars")
        const collectionNewCar = mongo.db("smoke-show").collection("cars-new")
        const collectionAnalysis = mongo.db("smoke-show").collection("cars-data-analysis")
        try {
            await collectionNewCar.find(filter).then(async newcars =>{
                console.log(newcars)
                newcars.map( async newcar =>{
                    const filterCar = {id: newcar.id}
                    const res = await collectionCars.findOne(filterCar)
                    if(res){
                        // console.log('found', newcar.id)
                        const updated = await collectionCars.updateOne(
                            {id: newcar.id},
                            {$set: {
                                name: newcar.name,
                                price: newcar.price,
                                totalSeating: newcar.totalSeating,
                                color: newcar.color,
                                features: newcar.features,
                                typeCategories: newcar.typeCategories,
                                modelName: newcar.modelName,
                                niceId: newcar.niceId
                            }},
                            { upsert: true }
                        )
                        console.log('updated', updated)
                  
                    }else{
                        console.log('not found', newcar.id)
                        // const inserted = await collectionCars.insertOne(newcar)
                        // console.log('inserted', inserted)
                    }
                })
                
                // const results = cars.map(car =>{
                //     return car.id
                // })
                // Promise.all(results).then(res =>{
                //     console.log('original', res.length)
                //     const uniq = [...new Set(res)];
                //     console.log('removed duplicates', uniq.length)

                //     let duplicates = [...res]
                //     uniq.forEach((item) => {
                //     const i = duplicates.indexOf(item)
                //     duplicates = duplicates
                //         .slice(0, i)
                //         .concat(duplicates.slice(i + 1, duplicates.length))
                //     })

                //     console.log(duplicates) 
                // })
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
                <Button onClick={storeData} style={{minWidth: '200px'}} >
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
export default connect(null, mapDispatchToProps)(UpdateDB)