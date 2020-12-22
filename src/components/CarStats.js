import React, { useState, Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from './Layout/Layout'
import { Row, Col, Button} from 'react-bootstrap'
import './carStats.scss'
import { v4 as uuidv4 } from 'uuid';
import priceIcon from '../assets/global/Price-Tag-icon.svg'
import powerIcon from '../assets/global/Horsepower.svg'
import weightIcon from '../assets/global/weight.svg'
import pistonIcon from '../assets/global/piston.png'
import cylinderIcon from '../assets/global/cylinder.svg'
import transmissionIcon from '../assets/global/transmission.svg'
import driveIcon from '../assets/global/drive_icon.svg'
import mileageIcon from '../assets/global/mileage.svg'

const CarStats = (props) =>{
    const statsArr = ['Main Stats', 'Engine', 'Warranty', 'Measurements', 'Comfort & Convenience', 'Drive Train', 'Suspension', 'Color']

    const [activeTab, setActiveTab] = useState('Main Stats')
    let searchedCars = []
    console.log('cars',props.history.location.cars)
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
        let engine, warranty, measurements, comfort, drivetrain, suspension, mileage, weight, totalSeating, colors, baseMSRP
        if(car.features['Engine'] !== undefined) engine = car.features['Engine']
        if(car.features['Warranty'] !== undefined) warranty = car.features['Warranty']
        if(car.features['Measurements'] !== undefined) measurements = car.features['Measurements']
        if(car.features['Measurements'] !== undefined) weight = car.features['Measurements']['Curb weight']
        if(car.features['Comfort & Convenience'] !== undefined) comfort = car.features['Comfort & Convenience']
        if(car.features['Drive Train'] !== undefined) drivetrain = car.features['Drive Train']
        if(car.features['Suspension'] !== undefined) suspension = car.features['Suspension']
        // if(car.features['Fuel']['EPA mileage est'][' (cty/hwy)'] !== undefined) mileage = car.features['Fuel']['EPA mileage est'][' (cty/hwy)']
        if(car.features['Fuel']['EPA mileage est'] == undefined) {
            console.log('no mileage')
        }else{mileage = car.features['Fuel']['EPA mileage est'][' (cty/hwy)']}
        if(car.totalSeating !== undefined) totalSeating = car.totalSeating
        if(car.color !== undefined) colors = car.color
        // if(car.price !== undefined || car.price.baseMSRP !== undefined) baseMSRP = car.price.baseMSRP
        if(car.price === undefined){
            mileage = null
        }else if(car.price.baseMSRP === undefined){
            mileage = null
        }else{
            mileage = car.price.baseMSRP
        }
        // if(car.price.baseMSRP === 'undefined'){
        //     baseMSRP = false
        // }else{baseMSRP = car.price.baseMSRP}
        
        switch(tab) {
            case 'Main Stats':
              return <Fragment>
                        {baseMSRP &&
                        <div className="stats-box">
                        <div  className="xs-txt">
                            <img src={priceIcon} alt="price" className="icon-stats" />
                            <div>SMRP</div>
                        </div>
                        <div className="stats-label">
                            ${' '} {car.price.baseMSRP}
                        </div>
                        
                        </div>}

                        {weight &&
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={weightIcon} alt="weight" className="icon-stats" />
                                <div>Curb weight</div>
                            </div>
                            <div className="stats-label">
                                {car.features['Measurements']['Curb weight']}
                            </div>
                        </div>
                        }
                        {drivetrain &&
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={driveIcon} alt="drive" className="icon-stats" />
                                <div>Drive type</div>
                            </div>
                            <div className="stats-label">
                                {drivetrain['Drive type']}
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
                        {car.features.Engine.Torque && 
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={pistonIcon} alt="torque" className="icon-stats" />
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
                                Hoursepower
                            </div>
                            <div className="stats-label">
                                { car.features.Engine.Horsepower}
                            </div>
                        </div>
                        }
                        {car.features.Engine.Cylinders &&
                        <div className="stats-box">
                            <div className="xs-txt">
                                <img src={cylinderIcon} alt="Cylinders" className="icon-stats" />
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
                            return <div className="stats-box-outline">
                                    <div className="color-thumbnail" style={{backgroundColor: `rgb(${color.rgb})`}}></div>
                                    <div className="color-name">{color.name}</div>
                                    </div>
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
    useEffect(() => {
        if(!props.history.location.cars) props.history.push('/car-search')
    }, [])
    return(
        <Layout>
            <div className="main-wrapper">
                <div className="spacer-4rem"></div>
                {carData && carData.map((car, index) =>{
                    car.tabs = statsArr
                    const maker = car.make.toUpperCase()
                    const model = car.model.toUpperCase()
                    return(
                        <Fragment>
                            <h2 className="title">{car.year} {' '} {maker} {' '} {model}</h2>
                            <p className="theme-text-p">{car.name}</p>
                            <Row>
                                <Col sm={4}>
                                    <img src="https://smoke-show.s3.amazonaws.com/car-photos/Ferrari-F8_Spider-2020-1280-01.jpg" alt="Ferrari F8 spider" style={{width: '100%'}}/>
                                </Col>
                                <Col sm={8} style={{paddingLeft: 0}} >
                                    <div className="box-shadow-white car-stats-wrapper" >
                                        <table className="stats-tab-ul">
                                            <tr>
                                            {car.tabs.map(tab =>{
                                                const uuid = uuidv4()
                                                return(
                                                        <td key={uuid} id={uuid} name={tab} custom={tab} onClick={()=>handleTabClick(tab, index)} className={ tab === car.activeTab ? 'tab-link tab-active' : 'tab-link' }>{tab}</td>                                       
                                                )
                                                
                                            })}
                                         
                                            </tr>
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