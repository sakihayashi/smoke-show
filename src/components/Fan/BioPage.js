import React, { useState } from 'react'
import Layout from '../Layout/Layout'
import bioImgXs from '../../assets/temp-photos/bio/sample_a1n16a_c_scale,w_375.jpg'
import bioImgS from '../../assets/temp-photos/bio/sample_a1n16a_c_scale,w_752.jpg'
import bioImgM from '../../assets/temp-photos/bio/sample_a1n16a_c_scale,w_1040.jpg'
import bioImgL from '../../assets/temp-photos/bio/sample_a1n16a_c_scale,w_1280.jpg'
import bioImgXL from '../../assets/temp-photos/bio/sample_a1n16a_c_scale,w_1500.jpg'
import bioPic from '../../assets/temp-photos/bio/avator-male.jpg'
import dayDriver from '../../assets/temp-photos/bio/placeholder-car-repair2.jpg'
import editIcon from '../../assets/global/edit-icon.svg'
import settingsIcon from '../../assets/global/Settings-icon-white.svg'
import SettingModal from './SettingModal'
import { Button, Row, Col, Form } from 'react-bootstrap'

import './biopage.scss'
import VehicleCard from './vehicleCard'
import CreateNewCar from './CreateNewCar'


const BioPage = () =>{
    const [userData, setUserData] = useState({about: "a photographer based in Cheshire, UK. With a background in design, I strive to create engaging imagery that stands out"})

    const [editMode, setEditMode] = useState(false)
    const [showSetting, setShowSetting] = useState(false);
    const carOptions = ['Daily Driver', 'Vehicle #2', 'Dream Car']
    const [showAddCar, setShowAddCar] = useState(false)
    
    const handleCloseAddCarModal = () => setShowAddCar(false)
    const handleShowAddCarModal = () => setShowAddCar(true)

    const handleChange = (e) =>{
        console.log(e.target.value)
        setUserData({
            ...userData,
            [e.target.name]: e.target.value 
        })
    }
    const handleShowSetting = () =>{
        setShowSetting(true)
    }
    const handleCloseSetting = () =>{
        setShowSetting(false)
    }
    const handleDataUpdate = () =>{
        setEditMode(false)
    }
    const editAbout = ()=>{
        return(
            <Form>
                <Form.Group >
                    <Form.Label>Edit</Form.Label>
                    <Form.Control as="textarea" rows={3} name="about" value={userData.about} onChange={handleChange} />
                </Form.Group>
                <div className="bio-edit-btn-wrapper">
                    <Button variant="primary" type="submit" onClick={handleDataUpdate} className="bio-edit-btn">
                        Submit
                    </Button>
                </div>
                
            </Form>
        )
    }
    return(
        <Layout>
        {showAddCar && <CreateNewCar show={showAddCar} handleClose={handleCloseAddCarModal}  />}
            {showSetting && <SettingModal show={showSetting} handleShowSetting={handleShowSetting} handleCloseSetting={handleCloseSetting} />}
            <div className="main-wrapper">
                <div className="spacer-4rem"></div>
                <h2 className="title">User Profile</h2>
                <div className="bio-fleet-img">
                    <img
                    sizes="(max-width: 1500px) 100vw, 1500px"
                    srcset={`
                    ${bioImgXs} 375w,
                    ${bioImgS} 752w,
                    ${bioImgM} 1040w,
                    ${bioImgL} 1280w,
                    ${bioImgXL} 1500w
                    `}
                    src={bioImgXL}
                    alt="user selected fleet"

                     />
                </div>
                <div className="bio-content-wrapper">
                    <div className="bio-main-wrapper">
                        <div className="bio-pic">
                            <img src={bioPic} alt="user avator" />
                        </div>
                        
                        <div className="bio-title-text">
                            <h3 className="bio-name-title">Username here</h3>
                            <p>user info here</p>
                        </div>
                        <Button className="bio-setting-btn" onClick={handleShowSetting}>
                            <img src={settingsIcon} alt="setting" className="setting-icon"/>
                            Settings
                        </Button>
                    </div>
           
                    <Row className="bio-height-adj">
                        <Col sm={4}>
                            <div className="bio-container box-shadow-white">
                                <p className="bio-about no-m-b"><strong>About: {' '}John Doe</strong></p>
                                <div className="">
                                    <p className="bio-content bio-border">
                                        {editMode ? editAbout() : userData.about}
                                    { !editMode && <br/> }
                                    <div className="edit-icon-wrapper" onClick={()=>{setEditMode(true)}}>
                                        {editMode ? '' : <img className="edit-icon" src={editIcon} alt="Edit about you"/>}
                                    </div>
                                    </p>
                                </div>
                                
                                <Row className="bio-border pt-pb-15 bio-row-adj">
                                    <Col sm={4}>
                                        <p className="no-m-b">Joined:</p>
                                    </Col>
                                    <Col sm={8}>
                                        <p>December 31st, 2020</p>
                                    </Col>
                                </Row>
                                <Row className="bio-border pt-pb-15 bio-row-adj">
                                    <Col sm={4}>
                                        <p className="no-m-b">Total Comments:</p>
                                    </Col>
                                    <Col sm={8}>
                                        <p className="no-m-b">32 comments</p>
                                    </Col>
                                </Row>
                                <Row className="bio-border pt-pb-15 bio-row-adj">
                                    <Col sm={4}>
                                        <p className="no-m-b">Fans of:</p>
                                    </Col>
                                    <Col sm={8}>
                                        <p className="no-m-b">EddieX, EddieY</p>
                                    </Col>
                                </Row>
                                <Row className="pt-pb-15 bio-row-adj"> 
                                    <Col sm={4}>
                                        <p className="no-m-b">Favorite Driving Song:</p>
                                    </Col>
                                    <Col sm={8}>
                                        <p className="no-m-b">Sting</p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col sm={8} className="pl-0">
                            <VehicleCard car={dayDriver} title={carOptions[0]} />
                            <div className="spacer-2rem"></div>
                            <VehicleCard car={dayDriver} />
                            <div className="spacer-2rem"></div>
                            <VehicleCard car={dayDriver} />
                            <div className="spacer-2rem"></div>
                            <div style={{padding: '0 6px'}}>
                                <Button className="btn-add-car" onClick={handleShowAddCarModal}>Add a car</Button>
                            </div>
                            
                            <div className="spacer-2rem"></div>
                        </Col>
                        
                    </Row>
                    
                </div>
                
            </div>
        </Layout>
    )
}

export default BioPage