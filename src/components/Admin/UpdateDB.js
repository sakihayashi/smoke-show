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
    const yearG = {$in:[1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010]}
    const makeG = 'mercury'

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
    const checkCarIds = () =>{
        const make = makeG
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
    }

    const checkDuplicates = async () =>{
        // const year = 2020
        const make = makeG
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionCars = mongo.db("smoke-show").collection("cars")
        const collectionNewCar = mongo.db("smoke-show").collection("cars-new")
        const collectionYoutube= mongo.db("smoke-show").collection("youtube-videos")
        const filter = {make: make}
        console.log('running', filter)
        
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
                    console.log('dups', duplicates) 
                    let count = 0
                    duplicates.map(async id =>{
                        const filter = {id: id}
                        const resArr = await collectionCars.find(filter)
                        
                        if(resArr){
                            resArr.map(async obj =>{
                                const filter = {carDataId: obj._id.toString()}
                                const found = await collectionYoutube.find(filter)
                                console.log('res', found)
                                if(found.length === 0){
                                    console.log('ok')
                                }else{
                                    console.log('do not remove this id', obj._id.toString())
                                }
                            })
                        }else{
                            console.log('sth wrong in your code')
                        }
                    })
                })
            })
        } catch (error) {
            console.log(error)
        }
    }
    const deleteDups = async () =>{
    // const year = 2020
    const make = makeG
    const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
    const collectionCars = mongo.db("smoke-show").collection("cars")
    // const collectionNewCar = mongo.db("smoke-show").collection("cars-new")
    // const collectionYoutube= mongo.db("smoke-show").collection("youtube-videos")
    const filter = {make: make}
    console.log('running', filter)
    
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
                console.log('dups', duplicates) 
                let count = 0
                duplicates.map(async id =>{
                    const filter = {id: id}
                    const resArr = await collectionCars.find(filter)
                                    
                    if(resArr.length === 1){
                        console.log('no need to do anything')
                    }else if(resArr.length > 1){
                        const preserved = resArr.shift()
                        console.log('presearved', preserved)
                        resArr.map(async dup =>{
                            const filter = {_id: {$oid: dup._id.toString()}}
                            const removed = await collectionCars.deleteOne(filter)
                            count++
                            console.log('finally removed', removed)
                            console.log('numbers', count)
                        })
                    }

                })
            })
        })
    } catch (error) {
        console.log(error)
    }
    }
    const updateMissing = async () =>{
        const filter= {make: makeG, niceId: { $exists: false }}
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionCars = mongo.db("smoke-show").collection("cars")
        const collectionFullSet = mongo.db("full-set-test").collection("full-2021-march")
        const missingCars = await collectionCars.find(filter)
        if(missingCars){
            missingCars.map(async car =>{
                const found = await collectionFullSet.findOne({id: Number(car.id)})
                if(found){
                    console.log('found id', Number(car.id))
                    const updated = await collectionCars.updateOne(
                        {id: found.id},
                        {$set: {
                            name: found.name,
                            price: found.price,
                            totalSeating: found.totalSeating,
                            color: found.color,
                            features: found.features,
                            typeCategories: found.typeCategories,
                            modelName: found.modelName,
                            niceId: found.niceId
                        }},
                        { upsert: false }
                    )
                    console.log('updated', updated)
                }else{
                    console.log('no such id in new set', Number(car.id))
                }
            })
        }else{
            console.log('no missing data found. check query string')
        }

    }
    const checkNum =async () =>{
        const make = makeG
        const filter = {make: makeG}
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionCars = mongo.db("smoke-show").collection("cars")
        const collectionFullSet = mongo.db("full-set-test").collection("full-2021-march")
        const newCars = await collectionCars.find(filter)
        console.log(newCars)
        newCars.map(async newcar =>{
            const filter = {make: makeG, id: newcar.id}
         
             const response = await collectionFullSet.find(filter)
             if(response.length !== 0){
                 console.log('found')
             }else if(response.length === 0){
                console.log('not found', newcar)
             }
        })
    }
    const manualInsert = async () =>{
        const filter ={id: 401874663}
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionCars = mongo.db("smoke-show").collection("cars")
        const collectionFullSet = mongo.db("full-set-test").collection("full-2021-march")
        try {
            await collectionFullSet.findOne(filter).then(async newcar =>{
                await collectionCars.insertOne(newcar).then(res =>{
                    console.log(res)
                })
            })
        } catch (error) {
            console.log('sth going on', error)
        }
    }
    const storeData = async () =>{
 
        // const filter = {make: makeG, year: yearG}
        const filter = {make:makeG}
        console.log('filter', filter)
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionCars = mongo.db("smoke-show").collection("cars")
        const collectionFullSet = mongo.db("full-set-test").collection("full-2021-march")
        // const collectionAnalysis = mongo.db("smoke-show").collection("cars-data-analysis")
        try {
            await collectionFullSet.find(filter).then(async newcars =>{
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
                            { upsert: false }
                        )
                        console.log('updated', updated)
                        // return
                  
                    }else{
                        // console.log('not found', newcar.id)
                        const inserted = await collectionCars.insertOne(newcar)
                        console.log('inserted', inserted)
                    }
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
  
                <Button onClick={checkDuplicates} style={{minWidth: '200px'}} >check duplicates</Button><br/><br/>
                <Button onClick={deleteDups} style={{minWidth: '200px', background: 'pink'}} >DELETE duplicates</Button><br/><br/><br/>
                <Button onClick={storeData} style={{minWidth: '200px'}} >
                Update data 
                </Button>
                <br/><br/>
                <Button onClick={checkNum} style={{minWidth: '200px'}}>Check number of cars</Button>

                {/* <br/><br/>
                <Button onClick={manualInsert} style={{minWidth: '200px'}}>Manual Insert</Button> */}
                {/* <Button onClick={updateMissing} style={{minWidth: '200px'}} >
                Update Missing data in current
                </Button> */}
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