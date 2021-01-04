import React, { useState, Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from './Layout/Layout'
import { Row, Col, Button} from 'react-bootstrap'
import './carStats.scss'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios';

import priceIcon from '../assets/global/Price-Tag-icon.svg'
import powerIcon from '../assets/global/Horsepower.svg'
import weightIcon from '../assets/global/weight.svg'
import pistonIcon from '../assets/global/piston.png'
// import cylinderIcon from '../assets/global/cylinder.svg'
import transmissionIcon from '../assets/global/transmission.svg'
import driveIcon from '../assets/global/drive_icon.svg'
import mileageIcon from '../assets/global/mileage.svg'
import torqueIcon from '../assets/global/torque.png'
import frontWheels from '../assets/global/front-wheels.png'
import rearWheels from '../assets/global/rear-wheels.png'
import allWheels from '../assets/global/all-wheels.png'

const CarStats = (props) =>{
    const statsArr = ['Main Stats', 'Engine', 'Measurements', 'Comfort & Convenience', 'Drive Train', 'Suspension', 'Color', 'Warranty']
    const [carImages, setCarImages] = useState([])
    
    const [activeTab, setActiveTab] = useState('Main Stats')
    let searchedCars = []
    if(props.history.location.cars){
        searchedCars = props.history.location.cars.map(item => ({...item, tabs: statsArr, activeTab: 'Main Stats'}))
    }else{props.history.push('/car-search')}
    
    const [carData, setCarData] = useState(searchedCars)
    
    const handleTabClick = (tab, index) =>{
        let tempCarArr = [...carData]
       
       tempCarArr[index].activeTab = tab
       setCarData(tempCarArr)
    }
    

    const switchTabs = (car, tab) =>{
        let engine, warranty, measurements, comfort, drivetrain, suspension, mileage, weight, totalSeating, colors, baseMSRP, rearseats, driveIcon, driveType

        if(car.features['Engine'] !== undefined) engine = car.features['Engine']
        if(car.features['Warranty'] !== undefined) warranty = car.features['Warranty']
        if(car.features['Measurements'] !== undefined) measurements = car.features['Measurements']
        if(car.features['Measurements'] !== undefined) weight = car.features['Measurements']['Curb weight']
        if(car.features['Comfort & Convenience'] !== undefined) comfort = car.features['Comfort & Convenience']
        if(car.features['Drive Train'] !== undefined){
            drivetrain = car.features['Drive Train']
            driveType = drivetrain['Drive type']
        } 
        if(driveType === undefined){
            driveType = null
        }else if(driveType === 'all wheel drive' || drivetrain['Drive type'] === 'four wheel drive'){
            driveIcon = allWheels
        }else if(driveType === 'front wheel drive'){
            driveIcon = frontWheels
        }else if(driveType === 'rear wheel drive'){
            driveIcon = rearWheels
        }else{driveIcon = allWheels}

        if(car.features['Suspension'] !== undefined) suspension = car.features['Suspension']
        if(car.features['Rearseats'] !== undefined) rearseats = car.features['Rearseats'] 
        if(car.features['Fuel']['EPA mileage est'] == undefined) {
            console.log('no mileage')
        }else{mileage = car.features['Fuel']['EPA mileage est'][' (cty/hwy)']}
        if(car.totalSeating !== undefined) totalSeating = car.totalSeating
        if(car.color !== undefined) colors = car.color
     
        if(car.price === undefined){
            baseMSRP = null
        }else if(car.price.baseMSRP === undefined){
            baseMSRP = null
        }else{
            baseMSRP = car.price.baseMSRP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        
        switch(tab) {
            case 'Main Stats':
              return <Fragment>
                        {baseMSRP &&
                        <div className="stats-box">
                        <div  className="xs-txt">
                            <img src={priceIcon} alt="price" className="icon-stats" />
                            <div>MSRP</div>
                        </div>
                        <div className="stats-label">
                            ${' '} {baseMSRP}
                        </div>
                        
                        </div>}

                        {weight &&
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={weightIcon} alt="weight" className="icon-stats" />
                                <div>Curb weight</div>
                            </div>
                            <div className="stats-label">
                                {weight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </div>
                        </div>
                        }
                        {mileage &&
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={mileageIcon} alt="mileage" className="icon-stats" />
                                <div>Mileage</div>
                            </div>
                            <div className="stats-label">
                                {mileage}
                            </div>
                        </div>
                        }
                        
                        {drivetrain &&
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={transmissionIcon} alt="transmission" className="icon-stats" />
                                <div>Transmission</div>
                            </div>
                            <div className="stats-label">
                                {drivetrain['Transmission']}
                            </div>
                        </div>
                        }
                        {driveType &&
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={driveIcon} alt="drive" className="icon-stats" />
                                <div>Drive type</div>
                            </div>
                            <div className="stats-label">
                                {driveType}
                            </div>
                        </div>
                        }
                        {car.features.Engine.Torque && 
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={torqueIcon} alt="torque" className="icon-stats" />
                                Torque
                            </div>
                            <div className="stats-label">
                                { car.features.Engine.Torque }
                            </div>
                        </div>
                        }
                        {car.features.Engine.Horsepower &&
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={powerIcon} alt="hoursepower" className="icon-stats" />
                                Horsepower
                            </div>
                            <div className="stats-label">
                                { car.features.Engine.Horsepower}
                            </div>
                        </div>
                        }
                        {car.features.Engine.Cylinders &&
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={pistonIcon} alt="Cylinders" className="icon-stats" />
                                Cylinders
                            </div>
                            <div className="stats-label">
                                { car.features.Engine.Cylinders}
                            </div>
                            
                        </div>
                        }
                    </Fragment>
            case 'Engine':
                return <Fragment>
                        { engine && Object.entries(engine).map(([key, value]) =>{
                            return <div className="stats-box"><strong>{key}</strong>:  {value}</div>
                        })}
                      </Fragment>
            case 'Warranty':
                return <Fragment>
                        {warranty && Object.entries(warranty).map(([key, value]) =>{
                            return <div className="stats-box"><strong>{key}</strong>:  {value}</div>
                        })}
                      </Fragment>
            case 'Measurements':
                return <Fragment>
                        {totalSeating && 
                            <div className="stats-box">Total Seating: {totalSeating}</div>
                        }
                        {rearseats && Object.entries(rearseats).map(([key, value]) =>{
                            return <div className="stats-box"><strong>{key}</strong>:  {value}</div>
                        })
                        }
                        { measurements && Object.entries(measurements).map(([key, value]) =>{
                            return <div className="stats-box"><strong>{key}</strong>:  {value}</div>
                        })}
                          
                     
                      </Fragment>  
            case 'Comfort & Convenience':
                return <Fragment>
                        { comfort && Object.keys(comfort).map((key, index)=>{
                            return <div className="stats-box">{key}</div>
                        })}
                          
                       
                      </Fragment> 
            case 'Drive Train':
                return <Fragment>
                        { drivetrain && Object.entries(drivetrain).map(([key, value]) =>{
                            if(value === true){
                                return <div className="stats-box">{key}<strong></strong></div>
                            }else{
                                return <div className="stats-box"><strong>{key}</strong>:  {value}</div>
                            }
                            
                        })}
                      </Fragment>
            case 'Suspension':
                return <Fragment>
                        { suspension && Object.keys(suspension).map((key, index)=>{
                            return <div className="stats-box">{key}</div>
                        })}
                          
                       
                      </Fragment>    
            case 'Color':
                return <Fragment>
                        <p><strong>Exterior</strong></p>
                        { colors && colors['EXTERIOR'].map((color, index)=>{
                            const uuid = uuidv4()
                            return <Fragment>
                                    <div className="stats-box-outline" key={uuid}>
                                    <div className="color-thumbnail" style={{backgroundColor: `rgb(${color.rgb})`}}></div>
                                    <div className="color-name">{color.name}</div>
                                    </div>
                                   </Fragment>
                        })}
                          <hr />
                       <p><strong>Interior</strong></p>
                       { colors && colors['INTERIOR'].map((color, index)=>{
                            return <div className="stats-box-outline">
                                    <div className="color-thumbnail" style={{backgroundColor: `rgb(${color.rgb})`}}></div>
                                    <div className="color-name">{color.name}</div>
                                    </div>
                        })}
                      </Fragment>  
            default:
              return <Fragment>
                        <div className="stats-box">Error</div>
                    </Fragment>
          }
    }
    const getImgData = async () =>{
        const selected = props.history.location.selected
        console.log('selected', selected)
        const url = `https://api.carsxe.com/images?key=${process.env.REACT_APP_CARXE_API_KEY}&year=${selected.year}&make=${selected.make}&model=${selected.model}&format=json&angle=front`
        await axios.get(url).then(res =>{
            console.log('img data', res.data)
            setCarImages(res.dataimages)
            
        })
        // try{
        //     await fetch(url, {
        //         // crossDomain:true,
        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application/json',
        //           },
        //       }).then(response => response.json()).then(result =>{
        //             console.log('res', result)
        //             setCarImages(result.images)
        //         })
        // }catch(err){
        //     console.log(err)
        // }
        

    }
    useEffect(() => {
        
        // getImgData()
    }, [])
    return(
        <Layout>
            <div className="main-wrapper">
                <div className="spacer-4rem"></div>
                {carData && carData.map((car, index) =>{
                    car.tabs = statsArr
                    const maker = car.make.toUpperCase()
                    const model = car.model.toUpperCase()
                    console.log('check', carImages)
                    let carImg;
                    if(carImages[0]){
                        carImg = carImages[0].link
                    }else{
                        carImg = 'https://smoke-show.s3.amazonaws.com/car-photos/Ferrari-F8_Spider-2020-1280-01.jpg'
                        }
                    return(
                        <Fragment key={car.name}>
                            <h2 className="title">{car.year} {' '} {maker} {' '} {model}</h2>
                            <p className="theme-text-p">{car.name}</p>
                            <Row>
                                <Col sm={4}>
                                    {/* <img src="https://smoke-show.s3.amazonaws.com/car-photos/Ferrari-F8_Spider-2020-1280-01.jpg" alt="Ferrari F8 spider" style={{width: '100%'}}/> */}
                                    <img src={carImg} alt={car.name} style={{width: '100%'}}/>
                                </Col>
                                <Col sm={8} style={{paddingLeft: 0}} >
                                    <div className="box-shadow-white car-stats-wrapper" >
                                        <table className="stats-tab-ul">
                                        <tbody>
                                            <tr>
                                            {car.tabs.map(tab =>{
                                                const uuid = uuidv4()
                                                return(
                                                        <td key={uuid} id={uuid} name={tab} custom={tab} onClick={()=>handleTabClick(tab, index)} className={ tab === car.activeTab ? 'tab-link tab-active' : 'tab-link' }>{tab}</td>                                       
                                                )
                                                
                                            })}
                                         
                                            </tr>
                                            </tbody>
                                        </table>
                                        <div className="stats-div">
                                            {switchTabs(car, car.activeTab)}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <div className="spacer-4rem"></div>
                        </Fragment>
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

export default CarStats