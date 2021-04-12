import React, { useState, Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from './Layout/Layout'
import { Button} from 'react-bootstrap'
import './carStats.scss'

import { Helmet } from 'react-helmet'
import { switchTabs } from './functionsStats'
import loadable from '@loadable/component'

const CarStatsCard = loadable(() => import('./CarStatsCard'))


const CarStats = (props) =>{
    const statsArr = ['Main Stats', 'Engine', 'Measurements', 'Comfort & Convenience', 'Drive Train', 'Suspension', 'Color', 'Warranty']
    const [carImages, setCarImages] = useState([])
    const [carData, setCarData] = useState()
    let searchedCars = []

    const handleTabClick = (tab, index) =>{
        let tempCarArr = [...carData]
       
       tempCarArr[index].activeTab = tab
       setCarData(tempCarArr)
    }
    

    useEffect(() => {
        if(props.history.location.cars){
            searchedCars = props.history.location.cars.map(item => ({...item, tabs: statsArr, activeTab: 'Main Stats'}))
            setCarData(searchedCars)
        }else{props.history.push('/car-search')}
    }, [])
    return(
        <Layout>
            <Helmet encodeSpecialCharacters={true}>
                {/* <title>{carData && carData[0].make}, {carData && carData[0].year}, {carData && carData[0].model} Specs, Reviews, and Pricing | The Smoke Show</title> */}
                <title>{typeof(carData) !== 'undefined' && `${carData[0].make}, ${carData[0].year}, ${carData[0].model}, Statistics, Specs`}</title>
                
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
                <div className="ad-div tmsads" id="unit-1617929086580"></div>
                <div className="spacer-4rem"></div>
                <Link to="/car-search">
                    <Button className="login-btn">Start New Search</Button>
                </Link>
                
            </div>
            
        </Layout>
    )
}

export default CarStats