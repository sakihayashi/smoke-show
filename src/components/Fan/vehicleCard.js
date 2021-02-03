import React, { useState, Fragment, useCallback } from 'react'
import { Row, Col, Modal, Button, Form } from 'react-bootstrap'
import {useDropzone} from 'react-dropzone'
import noImg from '../../assets/global/no_image.jpg'
import * as Realm from "realm-web"

import editIcon from '../../assets/global/edit-icon.svg'
import uploadIcon from '../../assets/global/upload.svg'

const VehicleCard = (props) =>{
    console.log('props.car', props.car.imgUrl)
    
    const carColors = ['White', 'Black', 'Grey', 'Blue', 'Silver', 'Red', 'Orange', 'Bronze', 'Yellow', 'Green', 'Navy']
    const [carObj, setCarObj] = useState({name: '', color: '', wheels:'', performance: '', upgrade: ''})
    const [show, setShow] = useState(false)
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        timeout: 10000, // timeout in number of milliseconds
        };
    const app = new Realm.App(appConfig)
    
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
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
    const handleSubmit = async (e) =>{
        console.log('checking')
        e.preventDefault()
        if(app.currentUser.id === props.profileUser.userId){
            const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
            const mongoCollection = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("users")
            try{
                await mongoCollection.updateOne(
                    { userId: app.currentUser.id},
                    { $set: { "myCars" : {carId: 'ff0cbcdc-a4b7-4c5c-91fd-fc342f2af0a9',
                    name: 'working'}} },
                    { arrayFilters: [ { "elem.carId": { $eq: "ff0cbcdc-a4b7-4c5c-91fd-fc342f2af0a9" } } ]}
                )
                
            }catch(err){
                console.log(err)
            }
        }else{
            console.log('figure out what is going on')
        }
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
                                <Button variant="primary" onClick={handleSubmit} className="save-changes-btn">
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
                <strong>{props.car.category ? props.car.category : 'Dream Car'}</strong>
                    <div className="edit-icon-wrapper-card" onClick={handleShow}>
                    {props.allowEdit && 
                        <img className="edit-icon" src={editIcon} alt="Edit about you"/>
                    }
                        
                    </div>
            </div>
            <Row>
                <Col sm={5} >
                    <img src={props.car.imgUrl !== undefined ? props.car.imgUrl : noImg} className="bio-my-car" alt="my daily driver" />
                </Col>
                <Col sm={7} className="bio-car-contents">
                    <p>Name: {props.car.name}</p>
                    <p>Upgrades: {props.car.upgrades}</p>
                    <p>Color: {props.car.color}</p>
                    <p>Wheels: {props.car.wheels}</p>
                    <p>Performance: {props.car.performance}</p>
                </Col>
            </Row>
        </div>
    )
}
export default VehicleCard