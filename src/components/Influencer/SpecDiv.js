import React from 'react'
import powerIcon from '../../assets/global/Horsepower.png'
import pistonIcon from '../../assets/global/piston.png'
import priceIcon from '../../assets/global/Price-Tag-icon.png'
import weightIcon from '../../assets/global/weight.svg'
import transmissionIcon from '../../assets/global/transmission.svg'
import mileageIcon from '../../assets/global/mileage.svg'
import { Link } from 'react-router-dom'

const SpecDiv = (props) =>{
    const { video } = props
    const { carData } = props.video
    // const goToStatsPage = () =>{
    //     props.history.push()
    // }
  
    return(
        <div className="ad-size">
                                        
            <div className="spec-wrapper" >
                <img alt={video.carData.name} src={require(`../../assets/maker_logos/${props.titleCase}_Logo.png`).default} className="icon-s" loading="lazy" />{' '}
                <span className="spec-text" >
                    <strong >{video.carData.year}{' '}{props.titleCase}{' '}{props.model}</strong>
                </span><br/>
                <img alt="price" src={priceIcon} className="icon-s" /><span className="spec-text" loading="lazy" >{' '}${props.price}</span><br />
                <img alt="power " src={powerIcon} className="icon-s" /><span  className="spec-text" loading="lazy">{' '}{video.carData.features.Engine.Torque && video.carData.features.Engine.Torque}</span><br />
                <img alt="piston" src={pistonIcon}  className="icon-s" loading="lazy" /><span className="spec-text">{' '}{video.carData.features.Engine.Horsepower && video.carData.features.Engine.Horsepower}</span><br />
                <img alt="weight" src={weightIcon} style={{padding: '2px'}}   className="icon-s" loading="lazy" /><span className="spec-text">{' '}{carData.features.Measurements  ? carData.features.Measurements["Curb weight"] : ''}</span><br />
                {/* <img alt="mileage" src={mileageIcon} style={{padding: '2px'}}  className="icon-s" loading="lazy" /><span className="spec-text">{' '}
                {video.carData.features["Fuel"]["EPA mileage est"][' (cty/hwy)'] !== undefined && video.carData.features["Fuel"]["EPA mileage est"][' (cty/hwy)']}</span><br /> */}
                <Link 
                to={{
                    pathname: `/car-stats/${props.titleCase.toLowerCase()}/${video.carData.year}/${props.model.toLowerCase()}/${props.dataid}`
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