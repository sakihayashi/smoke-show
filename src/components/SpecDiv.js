import React from 'react'
import powerIcon from '../assets/global/Horsepower.png'
import pistonIcon from '../assets/global/piston.png'
import priceIcon from '../assets/global/Price-Tag-icon.png'

const SpecDiv = (props) =>{
    return(
        <div className="ad-size">
                                        
            <div className="spec-wrapper" >
                <img alt={props.video.carData.name} src={require(`../assets/maker_logos/${props.titleCase}_Logo.png`).default} className="icon-s" />{' '}
                <span className="spec-text" >
                    <strong >{props.video.carData.year}{' '}{props.titleCase}{' '}{props.model}</strong>
                </span><br/>
                <img alt="price" src={priceIcon} className="icon-s" /><span className="spec-text" >{' '}${props.video.carData.price.baseMSRP}</span><br />
                <img alt="power " src={powerIcon} className="icon-s" /><span  className="spec-text">{' '}{props.video.carData.features.Engine.Torque}</span><br />
                <img alt="piston" key={pistonIcon} src={pistonIcon}  className="icon-s" /><span className="spec-text">{' '}{props.video.carData.features.Engine.Horsepower}</span><br />
            </div>
            <div className="ad-container">
                <p style={{color: 'gray'}}>ads will go here</p>
                <p style={{color: 'gray'}}> 160px x 600px <br/>for above 576px</p>
                <p style={{color: 'gray'}}> 300px x 250px <br/> for above 1400px </p>
            </div>
        </div>
    )
}

export default SpecDiv 