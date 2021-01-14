import React, { useState, Fragment} from 'react'
import { Row, Col, Modal, Button, Form } from 'react-bootstrap'
import bioPic from '../../assets/temp-photos/bio/avator-male.jpg'
import bioImgXs from '../../assets/temp-photos/bio/sample_a1n16a_c_scale,w_375.jpg'


const SettingModal = (props) =>{
    // const [show, setShow] = useState(false);

    const handleClose = props.handleCloseSetting
    const handleShow = props.handleShowSetting
    return(
    <Fragment>
        <Modal className="modal-wrapper-bio" show={props.show} onHide={handleClose}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <Row className="bio-modal-inner-wrapper">
                    <Col sm={6} className="">
                    <Row>
                        <Col sm={6}>
                            <div className="change-bio-pic-wrapper">
                                <img src={bioPic} alt="user avator" className="change-pic" />
                            </div>
                            
                        </Col>
                        <Col sm={6} className="setting-file-btn" >
                            <Form>
                                <Form.Group>
                                    <Form.File id="exampleFormControlFile1" />
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                    <div className="spacer-4rem"></div>
                    <p className="heading-modal">Edit account information</p>
                    <Form>
                        <Row>
                            <Col sm={6}>
                                <Form.Group >
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter car name" />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group >
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter car name" />
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <br/>
                        <Form.Group >
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="default" />
                        </Form.Group>
                        <br/>
                        <Form.Group >
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter your update" />
                        </Form.Group>
                        <br/>
                    
                        <Button variant="primary" onClick={handleClose} className="save-changes-btn">
                                Save Changes
                        </Button>
                    </Form>
                    </Col>
                    <Col sm={6}>
                        <Row>
                            <Col sm={6}>
                                <div className="change-bio-pic-wrapper">
                                    <img src={bioImgXs} alt="user avator" className="change-pic" />
                                </div>
                                
                            </Col>
                            <Col sm={6} className="setting-file-btn" >
                                <Form>
                                    <Form.Group>
                                        <Form.File id="exampleFormControlFile2" className="upload-file-btn"/>
                                    </Form.Group>
                                </Form>
                                <div className="file-upload-desc"></div>
                            </Col>
                        </Row>
                        <div className="spacer-4rem"></div>
                        <p className="heading-modal">Change password</p>
                        <Form>
                            <Form.Group >
                                <Form.Label>Current password</Form.Label>
                                <Form.Control type="password" placeholder="Enter car name" />
                            </Form.Group>
                            <br/>
                            <Form.Group >
                                <Form.Label>New password</Form.Label>
                                <Form.Control type="password" placeholder="Enter your update" />
                            </Form.Group>
                            <br/>
                            <Form.Group >
                                <Form.Label>Confirm new password</Form.Label>
                                <Form.Control type="password" placeholder="Enter your update" />
                            </Form.Group>
                            <br/>
                        
                            <Button variant="primary" onClick={handleClose} className="save-changes-btn">
                                    Save new password
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
  
            </Modal.Footer>
        </Modal>
    </Fragment>
    )
}

export default SettingModal