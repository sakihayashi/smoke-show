import React, { Fragment } from 'react'
import { v4 as uuidv4 } from 'uuid'

import transmissionIcon from '../assets/global/transmission.svg'
import mileageIcon from '../assets/global/mileage.svg'
import torqueIcon from '../assets/global/torque.png'
import frontWheels from '../assets/global/front-wheels.png'
import rearWheels from '../assets/global/rear-wheels.png'
import allWheels from '../assets/global/all-wheels.png'
import priceIcon from '../assets/global/Price-Tag-icon.svg'
import powerIcon from '../assets/global/Horsepower.svg'
import weightIcon from '../assets/global/weight.svg'
import pistonIcon from '../assets/global/piston.png'

export const switchTabs = (car, tab) =>{
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

    if(car.price === undefined || car.price === null){
        baseMSRP = ''
        
    }else if(car.price.baseMSRP === undefined || car.price.baseMSRP === null){
        baseMSRP = ''
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
                        return <div className="stats-box" key={key}><strong>{key}</strong>:  {value}</div>
                    })}
                  </Fragment>
        case 'Measurements':
            return <Fragment>
                    {totalSeating && 
                        <div className="stats-box">Total Seating: {totalSeating}</div>
                    }
                    {rearseats && Object.entries(rearseats).map(([key, value]) =>{
                        return <div className="stats-box" key={key}><strong>{key}</strong>:  {value}</div>
                    })
                    }
                    { measurements && Object.entries(measurements).map(([key, value]) =>{
                        return <div className="stats-box" key={key}><strong>{key}</strong>:  {value}</div>
                    })}
                      
                 
                  </Fragment>  
        case 'Comfort & Convenience':
            return <Fragment>
                    { comfort && Object.keys(comfort).map((key, index)=>{
                        return <div className="stats-box" key={key}>{key}</div>
                    })}
                      
                   
                  </Fragment> 
        case 'Drive Train':
            return <Fragment>
                    { drivetrain && Object.entries(drivetrain).map(([key, value]) =>{
                        if(value === true){
                            return <div className="stats-box" key={key}>{key}<strong></strong></div>
                        }else{
                            return <div className="stats-box" key={key}><strong>{key}</strong>:  {value}</div>
                        }
                        
                    })}
                  </Fragment>
        case 'Suspension':
            return <Fragment>
                    { suspension && Object.keys(suspension).map((key, index)=>{
                        return <div className="stats-box" key={key}>{key}</div>
                    })}
                      
                   
                  </Fragment>    
        case 'Color':
            return <Fragment>
                    <p><strong>Exterior</strong></p>
                    { colors && colors['EXTERIOR'] && colors['EXTERIOR'].map((color, index)=>{
                        const uuid = uuidv4()
                        return <Fragment key={uuid}>
                                <div className="stats-box-outline" >
                                <div className="color-thumbnail" style={{backgroundColor: `rgb(${color.rgb})`}}></div>
                                <div className="color-name">{color.name}</div>
                                </div>
                               </Fragment>
                    })}
                      <hr />
                   <p><strong>Interior</strong></p>
                   { colors && colors['INTERIOR'] && colors['INTERIOR'].map((color, index)=>{
                        return <div className="stats-box-outline" key={color.name}>
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
