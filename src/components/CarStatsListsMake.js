import React, { useEffect, useState } from 'react'
import Layout from './Layout/Layout'
import { carBrands, carsAllYear } from './carTempData'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const CarStatsListsMake = () =>{
    
    const [chunk1, setChunk1] = useState(null)
    const [chunk2, setChunk2] = useState(null)
    const [chunk3, setChunk3] = useState(null)
    // const loginCheck = () =>{
    //     const tokenUser = sessionStorage.getItem('session_user')
    //     if(tokenUser){
    //         jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, (err, decoded)=>{
    //             if(err){
    //                 const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
    //                 return credentials
    //             }else{
    //                 return decoded.cre
    //             }
    //         })
    //     }else{
    //         const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
    //         return credentials
    //     }
    // }
    // const getData = async () =>{
        
    // }

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
        <Layout>
            <div className="spacer-4rem"></div>
            <div className="main-wrapper" style={{minHeight: 'calc(100vh - 22rem)'}}>
            <h1 className="title">Car maker list</h1>
            <div className="spacer-1rem"></div>
            <Container>
                <Row>
                    <Col sm={4}>
                        <ul style={{listStyle: 'none'}}>
                        {chunk1 && chunk1.map(make =>{
                            return(
                                <Link to={`${make.toLocaleLowerCase()}`}>
                                    <li>{make}</li>
                                </Link>
                            )                            
                         })}
                        </ul>
                    </Col>
                    <Col sm={4}>
                        <ul style={{listStyle: 'none'}}>
                        {chunk2 && chunk2.map(make =>{
                            return(
                                <Link to={`${make.toLocaleLowerCase()}`}>
                                    <li>{make}</li>
                                </Link>
                            )                            
                         })}
                        </ul>
                    </Col>
                    <Col sm={4}>
                        <ul style={{listStyle: 'none'}}>
                        {chunk3 && chunk3.map(make =>{
                            return(
                                <Link to={`${make.toLocaleLowerCase()}`}>
                                    <li>{make}</li>
                                </Link>
                            )                            
                         })}
                        </ul>
                    </Col>
                </Row>
            </Container>
            </div>
            
        </Layout>
    )
}

export default CarStatsListsMake



