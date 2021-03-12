import React from 'react'
import powerIcon from '../assets/global/Horsepower.png'
import pistonIcon from '../assets/global/piston.png'
import priceIcon from '../assets/global/Price-Tag-icon.png'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const SpecDiv = (props) =>{
    const { video } = props
    // const goToStatsPage = () =>{
    //     props.history.push()
    // }
  
    return(
        <div className="ad-size">
                                        
            <div className="spec-wrapper" >
                <img alt={video.carData.name} src={require(`../assets/maker_logos/${props.titleCase}_Logo.png`).default} className="icon-s" loading="lazy" />{' '}
                <span className="spec-text" >
                    <strong >{video.carData.year}{' '}{props.titleCase}{' '}{props.model}</strong>
                </span><br/>
                <img alt="price" src={priceIcon} className="icon-s" /><span className="spec-text" loading="lazy" >{' '}${props.price}</span><br />
                <img alt="power " src={powerIcon} className="icon-s" /><span  className="spec-text" loading="lazy">{' '}{video.carData.features.Engine.Torque}</span><br />
                <img alt="piston" src={pistonIcon}  className="icon-s" loading="lazy" /><span className="spec-text">{' '}{video.carData.features.Engine.Horsepower}</span><br />
                <Link 
                to={{
                    pathname: `car-stats/${props.titleCase.toLowerCase()}/${video.carData.year}/${props.model.toLowerCase()}/${props.dataid}`,
                    state: {test: 'test'}
                }}
       

                >
                    <div className="btn-spec">
                        See more stats
                    </div>
                </Link>
                
            </div>
            
        </div>
    )
}

export default SpecDiv 