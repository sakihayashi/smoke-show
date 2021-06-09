import React, { useEffect, useState } from 'react'
import { Helmet } from "react-helmet"
import Layout from '../Layout/Layout'
import { Col, Row, Card, Button, Carousel } from 'react-bootstrap'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './insta.scss'
// import { Carousel } from 'bootstrap'

const Instagram = () =>{
    const [instaData, setInstaData] = useState([])
 
    const filterCarousel =  (data) =>{
        const result = data.map(async data =>{
            
            if(data.media_type === 'CAROUSEL_ALBUM'){
                const res = await axios.get(`https://graph.instagram.com/${data.id}/children?fields=media_url&access_token=IGQVJVLTJSRmRhemp3MTBqekJZAeFZAfYzFZANjJreEhCc1lVY05FaWd4T0tfN1NLVWp2WG52MG5ETTByR3NSVFo3M01PWk4tdFpzYzN2Ql9XMVRmelRmVEhwbFFwSDgzdzVOdDU5TkJB`)
                
                data.imgArr = res.data.data
                console.log('image arr attached', data)
                return data
            }else{
                return data
            }
        })
        Promise.all(result).then(res =>{
            console.log('res in promise all', res)
            setInstaData(res)
            
        })
        
    }
    useEffect(() =>{
        // axios.get(`https://graph.instagram.com/me/media?fields=id,caption,permalink,media_url&access_token=${process.env.REACT_APP_INSTA}`)
        // IGQVJVLTJSRmRhemp3MTBqekJZAeFZAfYzFZANjJreEhCc1lVY05FaWd4T0tfN1NLVWp2WG52MG5ETTByR3NSVFo3M01PWk4tdFpzYzN2Ql9XMVRmelRmVEhwbFFwSDgzdzVOdDU5TkJB
        axios.get(`https://graph.instagram.com/me/media?fields=id,caption,permalink,media_url,media_type,username&access_token=IGQVJVLTJSRmRhemp3MTBqekJZAeFZAfYzFZANjJreEhCc1lVY05FaWd4T0tfN1NLVWp2WG52MG5ETTByR3NSVFo3M01PWk4tdFpzYzN2Ql9XMVRmelRmVEhwbFFwSDgzdzVOdDU5TkJB`)
      .then(res => {
        filterCarousel(res.data.data)
        // setInstaData(res.data.data)
      })
    }, [])
    return(
        <Layout>
            <Helmet>
                <meta name="robots" content="noindex" />
            </Helmet>
            <div className="main-wrapper">
            <div className="spacer-4rem"></div>
            <h2 className="title">Instagram Feed @ {instaData[0] && instaData[0].username}</h2>
                <Row className="insta-row" >
                    {instaData[0] && 
                        instaData.map(data =>{
                            const instaLink = data.permalink.replace('/', '')
                            return (
                                <Col md={4} xl={3}>
                                    <Card style={{ width: '100%' }} >
                                        <div className="square-insta">
                                            { data.media_type === 'VIDEO' ? 
                                            <video className="insta-video" controls>
                                            <source src={data.media_url}
                                            type="video/mp4"/>
                                            </video>
                                            : (
                                                data.media_type === 'IMAGE' ? 
                                                <Card.Img variant="top" src={data.media_url} />
                                                :
                                                // <div>
                                                //     {console.log(data.imgArr)}
                                                //     test
                                                // </div>
                                                <React.Fragment>
                                                { data.imgArr[0] ?
                                                    <Carousel  >
                                                    {data.imgArr.map(img =>{
                                                            return(
                                                            <Carousel.Item key={img.id}>
                                                            <img 
                                                            className="d-block w-100"
                                                            alt="images"
                                                            src={img.media_url} />
                                                            </Carousel.Item> 
                                                            )
                                                            
                                                        })
                                                    }
                                                    </Carousel>
                                                    : <div>test</div>
                                                }
                                                </React.Fragment>
                                               
                                            )
                                            }
                                        
                                        </div>
                                        
                                        <Card.Body>
                                            {/* <Card.Title>Card Title</Card.Title> */}
                                            <Card.Text>
                                            {data.caption}
                                            </Card.Text>
                                            <a target="_blank" href={instaLink}>
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