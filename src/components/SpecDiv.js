import React from 'react'
import powerIcon from '../assets/global/Horsepower.png'
import pistonIcon from '../assets/global/piston.png'
import priceIcon from '../assets/global/Price-Tag-icon.png'

const SpecDiv = (props) =>{
    const adInsert = async () =>{
        try {
            window._mNHandle.queue.push(function (){
                window._mNDetails.loadTag("554833626", "300x250", "554833626");
            });
        }
        catch (error) {}
    }
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
            
        </div>
    )
}

export default SpecDiv 