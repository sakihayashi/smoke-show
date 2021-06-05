import React, { useEffect, useState } from 'react'
import { Helmet } from "react-helmet"
import Layout from '../Layout/Layout'
import { Col, Row, Card, Button } from 'react-bootstrap'
import axios from 'axios'
import './insta.scss'

const Instagram = () =>{
    const [instaData, setInstaData] = useState([])


    useEffect(() =>{
        axios.get(`https://graph.instagram.com/me/media?fields=id,caption,permalink,media_url&access_token=${process.env.REACT_APP_INSTA}`)
      .then(res => {
        console.log('res', res)
        setInstaData(res.data.data)
      })
    }, [])
    return(
        <Layout>
            <Helmet>

            </Helmet>
            <div className="main-wrapper">
            <div className="spacer-4rem"></div>
            <h2 className="title">Instagram Feed</h2>
                <Row className="insta-row" >
                    {instaData[0] && 
                        instaData.map(data =>{
                            const instaLink = data.permalink.replace('/', '')
                            console.log('data.media_url', data.media_url)
                            // const srcLink = data.media_url.replace('/', '')
                            return (
                                <Col md={4}>
                                    <Card style={{ width: '100%' }} className="square">
                                        <Card.Img variant="top" src={data.media_url} />
                                        <Card.Body>
                                            {/* <Card.Title>Card Title</Card.Title> */}
                                            <Card.Text>
                                            {data.caption}
                                            </Card.Text>
                                            <a href={instaLink}>
                                            <Button variant="outline-primary">Go Instagram</Button>
                                            </a>
                                            
                                        </Card.Body>
                                    </Card>
                                </Col>
                                
                                // <Col md={3}>
                                //     <a href={instaLink}>
                                //     <h3>{data.caption}</h3>
                                //     <div className="square">
                                //         <img src={data.media_url} alt={data.caption} className="content"/>
                                //     </div>
                                    
                                //     </a>
                                    
                                // </Col>
                            )
                        })
                        
                    }
                    
                </Row>
            </div>
            
        </Layout>
    )
}

export default Instagram