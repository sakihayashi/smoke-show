import React, { useEffect, useState } from 'react'
import Layout from './Layout/Layout'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import * as Realm from "realm-web"

const CarStatsListsYear = () =>{
    const makeName = props.match.params.make
    const [years, setYears] = useState()
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
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                const collectionCars = mongo.db("smoke-show").collection("cars")
                const filter = {make: makeName}
                const reuslts = await collectionCars.find(filter)
                let tempArr;
                const tempArr = results.map(car =>{
                    return car.year
                })
                const unique = [...new Set(tempArr)]
                setYears(unique)
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
            <h1 className="title">Car maker list</h1>
            <div className="spacer-1rem"></div>
            <Container>
                <Row>
                    <Col sm={4}>
                        <ul style={{listStyle: 'none'}}>
                        {years && years.map(year =>{
                            
                        })}
                        </ul>
                    </Col>
                </Row>
            </Container>
            </div>
            
        </Layout>
    )
}

export default CarStatsListsYear



