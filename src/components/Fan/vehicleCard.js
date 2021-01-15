import React, { useState, Fragment, useCallback } from 'react'
import { Row, Col, Modal, Button, Form } from 'react-bootstrap'
import {useDropzone} from 'react-dropzone'

import editIcon from '../../assets/global/edit-icon.svg'
import uploadIcon from '../../assets/global/upload.svg'

const VehicleCard = (props) =>{
    const carColors = ['White', 'Black', 'Grey', 'Blue', 'Silver', 'Red', 'Orange', 'Bronze', 'Yellow', 'Green', 'Navy']
    const [carObj, setCarObj] = useState({name: '', color: '', wheels:'', performance: '', upgrade: ''})
    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
      }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    const handleChange = (e) =>{
        setCarObj({
            ...carObj,
            [e.target.name]: e.target.value
        })
    }

    const editModal = 
    <Fragment>
        <Modal show={show} onHide={handleClose} className="modal-wrapper-bio">
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <Row className="bio-modal-inner-wrapper">
                    <Col sm={6} className="">
                    <div {...getRootProps()} className="dropzone-wrapper">
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                            <p>Drop the files here ...</p> :
                            <div className="drag-dropzone">
                                <div className="bio-modal-container">
                                    <img src={uploadIcon} alt="upload files here" />
                                    <p>Drag and drop or click to upload an image</p>
                                    <p>*3MB max image file size<br/>
                                    *accepted file formats: jpg, png, gif</p>
                                </div>

                            </div>
                        }
                    </div>
                    </Col>
                    <Col sm={6}>
                    <Form>
                        <Form.Group >
                            <Form.Label>Car name</Form.Label>
                            <Form.Control type="text" placeholder="Enter car name" onChange={handleChange} name="name"/>
                        </Form.Group>
                        <br/>
                        <Form.Group >
                            <Form.Label>Color</Form.Label>
                            {/* <Form.Control type="text" placeholder="Select your color" onChange={handleChange} name="color" /> */}
                            <Form.Control as="select" onChange={handleChange}>
                            {carColors.map((color, index) =>{
                                return(
                                    <option key={color + index}>{color}</option>
                                )
                            })}
                                
                            </Form.Control>
                        </Form.Group>
                        <br/>
                        <Form.Group >
                            <Form.Label>Wheels</Form.Label>
                            <Form.Control type="text" placeholder="Enter your update" onChange={handleChange} name="wheels"/>
                        </Form.Group>
                        <br/>
                        <Form.Group >
                            <Form.Label>Performance</Form.Label>
                            <Form.Control type="text" placeholder="Enter your performance" onChange={handleChange} name="performance" />
                        </Form.Group>
                        <br/>
                        <Form.Group >
                            <Form.Label>Upgrade</Form.Label>
                            <Form.Control type="text" placeholder="Enter your update" onChange={handleChange} name="upgrade" />
                        </Form.Group>
                        <br/><br/>
                        <Row>
                            <Col sm={6}>
                                <Button variant="secondary" onClick={handleClose} className="cancel-btn" > 
                                    Cancel
                                </Button>
                            </Col>
                            <Col sm={6}>
                                <Button variant="primary" onClick={handleClose} className="save-changes-btn">
                                Save Changes
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
  
            </Modal.Footer>
        </Modal>
    </Fragment>
    

    return(
        <div className="bio-container box-shadow-white">
        { editModal}
            <div className="car-names">
                <strong>Daily Driver</strong>
                    <div className="edit-icon-wrapper-card" onClick={handleShow}>
                        <img className="edit-icon" src={editIcon} alt="Edit about you"/>
                    </div>
            </div>
            <Row>
                <Col sm={5} >
                    <img src={props.car} className="bio-my-car" alt="my daily driver" />
                </Col>
                <Col sm={7} className="bio-car-contents">
                    <p>Name: 2012 Lamborghini Aventador</p>
                    <p>Upgrades: </p>
                    <p>Color: </p>
                    <p>Wheels: </p>
                    <p>Performance: </p>
                </Col>
            </Row>
        </div>
    )
}
export default VehicleCard