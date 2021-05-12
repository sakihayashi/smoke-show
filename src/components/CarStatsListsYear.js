import React, { useEffect, useState } from 'react'
import Layout from './Layout/Layout'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import * as Realm from "realm-web"
import jwt from 'jsonwebtoken'
import { Helmet } from "react-helmet"
import { jsonLD2 } from './jsonLD'

const CarStatsListsYear = (props) =>{
    const makeName = props.match.params.make
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
    let today = new Date()
    const timeISO = today.toISOString()
    let published = new Date('2021-03-01')
    const publishedISO = published.toISOString()
    const slug = `car-stats/${makeName}`
    const pageName = `Search Car Statistics for ${makeName}`
    const dataLD = { slug, pageName, publishedISO, timeISO }

    const [years, setYears] = useState([])
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
         
                const unique = await user.functions.yearsFromMake(makeName)
        
                unique.sort((a, b) => b - a)
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
            <Helmet>
                <title>Car Statistics Search for {title} | The Smoke Show</title>
                <meta name="description" content={`Search ${title.toUpperCase()} car statistics | engines, price, warranty, color, and more information`} />
                <script src="https://lib.tashop.co/the_smoke_show/adengine.js" async data-tmsclient="The Smoke Show" data-layout="searches" data-debug="true"></script>
                <script>{`window.TAS = window.TAS.reload() || { cmd: [] }`}</script>
                <script type="application/ld+json">{jsonLD2(dataLD)}</script>
            </Helmet>
            <div className="spacer-4rem"></div>
            <div className="main-wrapper" style={{minHeight: 'calc(100vh - 22rem)'}}>
            <h1 className="title">{title} car data year list</h1>
            <div className="spacer-1rem"></div>
            <Container>
            <Row className="list-container">
                { years && years.map((year) =>{
                    return(
                        <Col sm={4} className="list-pd" key={year} >
                            <Link to={`/car-stats/${makeName}/${year}`} >
                            {year}
                            </Link>
                        </Col>
                    )

                })}
                </Row>
            </Container>
            </div>
            <div className="ad-on-search">
                <div id="unit-1620778820240" class="tmsads"></div>
            </div>
        </Layout>
    )
}

export default CarStatsListsYear



