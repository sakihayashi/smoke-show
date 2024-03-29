import React, { useState, Fragment } from 'react'
import { Row, Col, Modal, Button, Form } from 'react-bootstrap'
import noImg from '../../assets/global/no_image.jpg'
import * as Realm from "realm-web"
import ImageUpload from './ImageUpload'
import { openLoginModal, attachMsg } from '../../store/actions/authActions'
import { connect } from 'react-redux'

import editIcon from '../../assets/global/edit-icon.svg'
import trashIcon from '../../assets/global/delete-icon.svg'
import short from 'short-uuid'
import jwt from 'jsonwebtoken'
// https://s3.amazonaws.com/smokeshow.users/6025ba6cf198fcd93ef955a0/my-cars/86FyEqdgdKnjxjQaLQvpda

const VehicleCard = (props) =>{
    let carImgUrl = noImg
    if(props.car.imgUrl){
        if(props.car.imgUrl.includes('s3.amazonaws.com/smokeshow.users')){
            carImgUrl = props.car.imgUrl.replace('s3.amazonaws.com/smokeshow.users', 'dwdlqiq3zg6k6.cloudfront.net')
        }else{
            carImgUrl = props.car.imgUrl
        }
    }
    const [imgFile, setImgFile] = useState('')
    const [imgData64, setImgData64] = useState('')
    const [newImg, setNewImg] = useState(false)
    const carColors = ['White', 'Black', 'Grey', 'Blue', 'Silver', 'Red', 'Orange', 'Bronze', 'Yellow', 'Green', 'Navy']
    const [carObj, setCarObj] = useState({name: props.car.name, color: props.car.color, wheels: props.car.wheels, performance: props.car.performance, upgrades: props.car.upgrades, imgUrl: props.car.imgUrl})
    const [show, setShow] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const bucketName = process.env.REACT_APP_AWS_BUCKET_NAME;
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        timeout: 10000, // timeout in number of milliseconds
        };
    const app = new Realm.App(appConfig)

    const imgChange = (state) => {
        setNewImg(state)
    }
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const handleCloseAlert = () => setShowAlert(false)
    const handleShowAlert = () => setShowAlert(true)
    // const onDrop = useCallback(acceptedFiles => {
    //     // Do something with the files
    //   }, [])
    // const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    const handleChange = (e) =>{
        setCarObj({
            ...carObj,
            [e.target.name]: e.target.value
        })
    }
    const updateData = async (carData, mongo) =>{
        const collectionMyCars = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("my-cars")
        try{
            await collectionMyCars.updateOne(
                {_id: props.car._id},
                { $set: carData }
            ).then(res =>{
                console.log('res', res)
                props.getMyCars(mongo)
                handleClose()
            })
            
        }catch(err){
            console.log(err)
        }
    }
    const deleteImgObj = async (key) =>{

        if(app.currentUser.id === props.profileUser.userId){
            try{
                await app.currentUser.functions.deleteImageObjToS3(bucketName, key).then(res =>{
                    console.log('res', res)
                })
            }catch(err){console.log(err)}
        }
    }
    const handleDeleteCar = async () =>{
        const tokenUser = sessionStorage.getItem('session_user')
        if(tokenUser){
            jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, async (err, decoded)=>{
                if(err){
                    props.openLoginModal(true)
                    props.attachMsg('Sorry! Your session has expired. This is for your protection and keeping the site secure.Please sign back in to enjoy The Smoke Show')
                }else{
                    try{
                        await app.logIn(decoded.cre).then(async user =>{
                            const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                            const collectionMyCars = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("my-cars")
                            const oid = props.car._id.toString()
                            const currentUrl = props.car.imgUrl
                            const splitted = currentUrl.split('/');
                            const key = splitted.splice(4, 7).join("/")
                            const filterCar = {_id: {"$oid": oid}}
                            try{
                                await collectionMyCars.deleteOne(filterCar).then(async res =>{
                                    console.log('data deleted', res)
                                    try {
                                        await user.functions.deleteImageObjToS3(bucketName, key).then(res =>{
                                            console.log('img deleted', res)
                                            props.getMyCars(mongo)
                                            handleCloseAlert()
                                        })
                                    } catch (error) {
                                        console.log(error)
                                    }

                                })
                            }catch(err){
                                console.log(err)
                            }
                        })
                    }catch(err){
                        console.log(err)
                    }
                }
            })
        }else{
            console.log('debug pls!')
        }
    }
    const handleSubmit = async (e) =>{
        const baseImgUrl = `https://s3.amazonaws.com/${process.env.REACT_APP_AWS_BUCKET_NAME}/`
        
        const imgId = short.generate()
        const filekey = props.profileUser.userId + '/my-cars/' + imgId
        const imgUrlWithKey = baseImgUrl + filekey
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
        
        const carData ={
            name: carObj.name,
            upgrades: carObj.upgrades,
            wheels: carObj.wheels,
            color: carObj.color,
            userId: props.profileUser.userId,
            performance: carObj.performance
        }
        e.preventDefault()
        if(app.currentUser.id === props.profileUser.userId){
            
            if(newImg){
                carData.imgUrl = imgUrlWithKey
                await app.currentUser.functions.putImageObjToS3(imgData64, bucketName, filekey, imgFile.type).then(res =>{
                    const currentUrl = props.car.imgUrl
                    const splitted = currentUrl.split('/');
                    const key = splitted.splice(4, 7).join("/")
                    deleteImgObj(key)
                    updateData(carData, mongo)
                })
            }else{
                updateData(carData, mongo)
            }
            
        }else{
            console.log('figure out what is going on')
        }
    }
    const setImgData = (obj) =>{
    setImgFile(obj)
    var file = obj
    const reader = new FileReader();
    reader.onload = (event) => {
    const base64 = event.target.result.split(",").pop()
        setImgData64(base64)
    //   console.log(base64);
    };
    reader.readAsDataURL(file);
    }
    const deleteAlert =
    <Fragment>
        <Modal show={showAlert} onHide={handleCloseAlert}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body className="text-center">
                <p>Delete this car including the image?</p>
                <p>It will be permanently deleted.</p>
                <Button className="mini-btn" onClick={handleDeleteCar}>Confirm Delete</Button>
                or
                <Button className="mini-btn" onClick={handleCloseAlert}>Cancel</Button>
            </Modal.Body>
            <Modal.Footer>
  
            </Modal.Footer>
        </Modal>
    </Fragment>

    const editModal = 
    <Fragment>
        <Modal show={show} onHide={handleClose} className="modal-wrapper-bio">
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <Row className="bio-modal-inner-wrapper">
                    <Col sm={6} className="">
                    <ImageUpload fileObj={setImgData} imgChange={imgChange} />
                    </Col>
                    <Col sm={6}>
                    <h3>Category: {props.car.category}</h3>
                    <hr />
                    <Form>
                        <Form.Group >
                            <Form.Label>Car name</Form.Label>
                            <Form.Control type="text" placeholder={carObj.name} onChange={handleChange} name="name"/>
                        </Form.Group>
                        <br/>
                        <Form.Group >
                            <Form.Label>Color</Form.Label>
                      
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
                            <Form.Control type="text" placeholder={carObj.wheels} onChange={handleChange} name="wheels"/>
                        </Form.Group>
                        <br/>
                        <Form.Group >
                            <Form.Label>Performance</Form.Label>
                            <Form.Control type="text" placeholder={carObj.performance} onChange={handleChange} name="performance" />
                        </Form.Group>
                        <br/>
                        <Form.Group >
                            <Form.Label>Upgrade</Form.Label>
                            <Form.Control type="text" placeholder="Enter your update" onChange={handleChange} name={carObj.upgrades} />
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
        { deleteAlert }
            <div className="car-names">
                <strong>{props.car.category ? props.car.category : 'Dream Car'}</strong>
                    <div className="edit-icon-wrapper-card" >
                    {props.allowEdit && 
                    <Fragment>
                        <div onClick={handleShow} style={{display: 'inline'}}>
                            <img className="edit-icon" src={editIcon} alt="Edit your car"/>
                        </div>
                        <div onClick={handleShowAlert} style={{display: 'inline', marginLeft: '1rem'}}>
                            <img className="edit-icon" src={trashIcon} alt="Delete this car data"/>
                        </div>
                    </Fragment>
                    }
                        
                    </div>
            </div>
            <Row>
                <Col sm={5} >
                    <img src={carImgUrl} className="bio-my-car" alt="my daily driver" />
                </Col>
                <Col sm={7} >
                    <div className="bio-car-contents">
                        <p>Name: {props.car.name}</p>
                        <p>Color: {props.car.color}</p>
                        <p>Wheels: {props.car.wheels}</p>
                        <p>Performance: {props.car.performance}</p>
                        <p>Upgrades: {props.car.upgrades}</p>
                    </div>
                    
                </Col>
            </Row>
        </div>
    )
}
const mapDispatchToProps = (dispatch)=>{
    return{
        openLoginModal: (state) => dispatch(openLoginModal(state)),
        attachMsg: (msg) => dispatch(attachMsg(msg))
    }
}
export default connect(null, mapDispatchToProps)(VehicleCard)