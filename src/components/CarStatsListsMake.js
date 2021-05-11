import React, { useEffect, useState } from 'react'
import { carBrands } from './carTempData'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const CarStatsListsMake = () =>{
    
    const [chunk1, setChunk1] = useState(null)
    const [chunk2, setChunk2] = useState(null)
    const [chunk3, setChunk3] = useState(null)

    useEffect(() => {
        const len = carBrands.length
        const third = Math.floor(len/3)
        setChunk1(carBrands.slice(0, third))
        setChunk2(carBrands.slice(third, third*2))
        setChunk3(carBrands.slice(third*2, len))
        // const cre = loginCheck()
        // getData(cre)
    }, [])
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
                    {/* <Col sm={4} className="list-pd">
                        <ul style={{listStyle: 'none'}}>
                        {chunk1 && chunk1.map(make =>{
                            const replaced = make.replace(" ", "-")
                            return(
                                <Link to={`/car-stats/${replaced.toLocaleLowerCase()}`} key={make}>
                                    <li>{make}</li>
                                </Link>
                            )                            
                         })}
                        </ul>
                    </Col> */}
                    {/* <Col sm={4} className="list-pd">
                        <ul style={{listStyle: 'none'}}>
                        {chunk2 && chunk2.map(make =>{
                            const replaced = make.replace(" ", "-")
                            return(
                                <Link to={`/car-stats/${replaced.toLocaleLowerCase()}`} key={make}>
                                    <li>{make}</li>
                                </Link>
                            )                            
                         })}
                        </ul>
                    </Col>
                    <Col sm={4} className="list-pd">
                        <ul style={{listStyle: 'none'}}>
                        {chunk3 && chunk3.map(make =>{
                            const replaced = make.replace(" ", "-")
                            return(
                                <Link to={`/car-stats/${replaced.toLocaleLowerCase()}`} key={make}>
                                    <li >{make}</li>
                                </Link>
                            )                            
                         })}
                        </ul>
                    </Col> */}
                </Row>
            </Container>

    )
}

export default CarStatsListsMake



