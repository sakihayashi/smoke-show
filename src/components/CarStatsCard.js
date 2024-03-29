import React, { Fragment } from 'react'
import { Row, Col } from 'react-bootstrap'
import short from 'short-uuid'

const CarStatsCard = (props) =>{
    const { car, index, handleTabClick, switchTabs } = props
    const maker = car.make.toUpperCase()
    const model = car.model.toUpperCase()
    let carImg = 'https://d32cnvod31xbse.cloudfront.net/default/no-image.jpg'
  
    if(car.imgUrl){
        if(car.imgUrl.includes('s3.amazonaws.com/thesmokeshow')){
            
            carImg = car.imgUrl.replace('s3.amazonaws.com/thesmokeshow', 'd32cnvod31xbse.cloudfront.net')
            console.log(carImg)
        }else{
            carImg = car.imgUrl
        }
    }

    return(
        <Fragment key={car.name +index}>
            <h1 className="title">{maker} {' '} {model} {' '} {car.year}</h1>
            <p className="theme-text-p">{car.name}</p>
            <Row style={{paddingRight: '3px'}}>
                <Col sm={4}>
                    <img src={ carImg } alt={car.name} style={{width: '100%'}}/> 
                    {/* <img src={carImg} alt={car.name} style={{width: '100%'}}/> */}
                </Col>
                <Col sm={8} style={{paddingLeft: 0}} >
                    <div className="box-shadow-white car-stats-wrapper" >
                        <table className="stats-tab-ul">
                        <tbody>
                            <tr>
                            {car.tabs.map(tab =>{
                                const uuid = short.generate()
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
}

export default CarStatsCard