import React, { useEffect, useState } from 'react'
import Layout from './Layout/Layout'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import * as Realm from "realm-web"
import jwt from 'jsonwebtoken'


const CarStatsListsModel = (props) =>{
    const makeName = props.match.params.make
    const carYear = props.match.params.year
    let title;
    if(makeName.includes("-")){
        let splitted = makeName.split("-")
        let temp =[]
        for(let i=0; i < splitted.length; i++){
            temp.push(splitted[i].charAt(0).toUpperCase() + splitted[i].slice(1))
        }
        title = temp.join(" ")
    }else{
        let str = makeName
        title = str.charAt(0).toUpperCase() + str.slice(1)
    }

    const [chunk1, setChunk1] = useState(null)
    const [chunk2, setChunk2] = useState(null)
    const [chunk3, setChunk3] = useState(null)
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
        };
    const app = new Realm.App(appConfig);
    const loginCheck = () =>{
        const tokenUser = sessionStorage.getItem('session_user')
        if(tokenUser){
            jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, (err, decoded)=>{
                if(err){
                    const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
                    return credentials
                }else{
                    return decoded.cre
                }
            })
        }else{
            const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
            return credentials
        }
    }
    const getData = async (cre) =>{
        try {
            await app.logIn(cre).then(async user =>{
                const unique = await user.functions.modelsFromMakeYear(makeName, Number(carYear))
                const len = unique.length
                const third = Math.ceil(len/3)
                setChunk1(unique.slice(0, third))
                setChunk2(unique.slice(third, third*2))
                setChunk3(unique.slice(third*2, len))
            })
        } catch (error) {
            
        }
    }

    useEffect(() => {
  
        const cre = loginCheck()
        getData(cre)
    }, [])
    return(
        <Layout>
            <div className="spacer-4rem"></div>
            <div className="main-wrapper" style={{minHeight: 'calc(100vh - 22rem)'}}>
            <h1 className="title">{title} {carYear} car data model list</h1>
            <div className="spacer-2rem"></div>
            <Container>
            <Row className="list-container">
                    <Col sm={4} className="list-pd">
                        <ul style={{listStyle: 'none'}}>
                        {chunk1 && chunk1.map(model =>{
                            return(
                                <Link to={`/car-stats/${makeName}/${carYear}/${model}`} key={model}>
                                    <li>{model.toUpperCase()}</li>
                                </Link>
                            )                            
                         })}
                        </ul>
                    </Col>
                    <Col sm={4} className="list-pd">
                        <ul style={{listStyle: 'none'}}>
                        {chunk2 && chunk2.map(model =>{
                            return(
                                <Link to={`/car-stats/${makeName}/${carYear}/${model}`} key={model}>
                                    <li>{model.toUpperCase()}</li>
                                </Link>
                            )                            
                         })}
                        </ul>
                    </Col>
                    <Col sm={4} className="list-pd">
                        <ul style={{listStyle: 'none'}}>
                        {chunk3 && chunk3.map(model =>{
                            return(
                                <Link to={`/car-stats/${makeName}/${carYear}/${model}`} key={model}>
                                    <li >{model.toUpperCase()}</li>
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

export default CarStatsListsModel



