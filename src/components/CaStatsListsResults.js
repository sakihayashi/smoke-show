import React, { useEffect, useState } from 'react'
import Layout from './Layout/Layout'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import * as Realm from "realm-web"
import jwt from 'jsonwebtoken'

import loadable from '@loadable/component'
import { switchTabs } from './functionsStats'

const CarStatsCard = loadable(() => import('./CarStatsCard'))


const CarStatsListsResults = (props) =>{
    const makeName = props.match.params.make
    const carYear = props.match.params.year
    const carModel = props.match.params.model

    let title;
    if(makeName.includes("-")){
        let splitted = makeName.split("-")
        let temp =[]
        for(let i=0; i < splitted.length; i++){
            temp.push(splitted[i].charAt(0).toUpperCase() + splitted[i].slice(1))
        }
        title = temp.join(" ")
    }else{
        let str = makeName
        title = str.charAt(0).toUpperCase() + str.slice(1)
    }

    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
        };
    const app = new Realm.App(appConfig)
    const [carData, setCarData] = useState()
    const [carImages, setCarImages] = useState([])
    const statsArr = ['Main Stats', 'Engine', 'Measurements', 'Comfort & Convenience', 'Drive Train', 'Suspension', 'Color', 'Warranty']

    const handleTabClick = (tab, index) =>{
        let tempCarArr = [...carData]
       
       tempCarArr[index].activeTab = tab
       setCarData(tempCarArr)
    }

    const loginCheck = () =>{
        const tokenUser = sessionStorage.getItem('session_user')
        if(tokenUser){
            jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, (err, decoded)=>{
                if(err){
                    const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    return credentials
                }else{
                    return decoded.cre
                }
            })
        }else{
            const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
            return credentials
        }
    }
    const getData = async (cre) =>{
        try {
            await app.logIn(cre).then(async user =>{
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const collectionCars = mongo.db("smoke-show").collection("cars")
                const filter = {make: makeName, year: Number(carYear), model: carModel}
                const results = await collectionCars.find(filter)
                const temp = results.map(item => ({...item, tabs: statsArr, activeTab: 'Main Stats'}))
                setCarData(temp)
            })
        } catch (error) {
            
        }
    }

    useEffect(() => {
  
        const cre = loginCheck()
        getData(cre)
    }, [])
    return(
        <Layout>
            <Helmet encodeSpecialCharacters={true}>
                <title>Car Statistics {title} {carYear} {carModel} | The Smoke Show</title>
                <meta name="description" content="Place the meta description text here." />

            </Helmet>
            <div className="main-wrapper stats-container">
                <div className="spacer-4rem"></div>
                {carData && carData.map((car, index) =>{
                    car.tabs = statsArr
                 
                    let carImg;
                    if(carImages[0]){
                        carImg = carImages[0].link
                    }else{
                        carImg = 'https://smoke-show.s3.amazonaws.com/car-photos/Ferrari-F8_Spider-2020-1280-01.jpg'
                        }
                    return(

                        <CarStatsCard car={car} index={index} handleTabClick={handleTabClick} switchTabs={switchTabs} />
                      
                    )
                })
                }
                <div className="spacer-4rem"></div>
                <Link to="/car-search">
                    <Button className="login-btn">Start New Search</Button>
                </Link>
                
            </div>
        </Layout>
    )
}

export default CarStatsListsResults



