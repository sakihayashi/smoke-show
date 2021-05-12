import React from 'react'
import { carBrands } from './carTempData'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const CarStatsListsMake = () =>{
    
    return(
 
        <Container>
            <h2 className=" theme-text-p" style={{color: 'gray', textAlign: 'center', fontSize: '1rem'}}>Search car data by maker index</h2>
            <div className="spacer-2rem"></div>
                <Row className="list-container">
                    {carBrands.map(make =>{
                        const replaced = make.replace(" ", "-")
                        return(
                            <Col sm={4} className="list-pd" key={`car-maker-${make}`}>
                                <Link to={`/car-stats/${replaced.toLocaleLowerCase()}`}>
                                    {make}
                                </Link>
                            </Col>
                        )
                    })}
                </Row>
        </Container>

    )
}

export default CarStatsListsMake



