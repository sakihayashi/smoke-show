import React, { useState, Fragment } from 'react'
import { Row, Col, Modal, Button, Form } from 'react-bootstrap'
import * as Realm from "realm-web"
// import ImageUpload from './ImageUpload'
import jwt from 'jsonwebtoken'
import short from 'short-uuid'
import { createMyCar } from '../../store/actions/bioActions'
import { connect } from 'react-redux'
import loadable from '@loadable/component'

const ImageUpload = loadable(() => import('../Global/ImageUpload'))

const CreateNewCar = (props) =>{
    const bucketName = process.env.REACT_APP_AWS_BUCKET_NAME;
    const [imgFile, setImgFile] = useState('')
    const [imgData64, setImgData64] = useState('')
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        timeout: 10000, // timeout in number of milliseconds
        };
    const app = new Realm.App(appConfig)
    const maxAgeTest = 1 * 60 * 60

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
    const closeModal = () =>{
        setNewCarObj({name: '', category: '', color: '', wheels: '', upgrades: ''})
        props.handleClose()
    }

    
    const carColors = ['White', 'Black', 'Grey', 'Blue', 'Silver', 'Red', 'Orange', 'Bronze', 'Yellow', 'Green', 'Navy']
    const carCategories = ['Dream Car', 'Daily Driver', 'Vehicle #2']
    const [newCarObj, setNewCarObj] = useState({name: '', category: 'Dream Car', color: 'White', wheels: '', upgrade: ''})

    const handleChange = (e) =>{
        setNewCarObj({
            ...newCarObj,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        let baseImgUrl = `https://s3.amazonaws.com/${process.env.REACT_APP_AWS_BUCKET_NAME}/`
        let imgId = short.generate()
        let filekey = props.profileUser.userId + '/my-cars/' + imgId
        let imgUrlWithKey;
        if(imgData64){
            filekey = props.profileUser.userId + '/my-cars/' + imgId
            imgUrlWithKey = baseImgUrl + filekey
        }else{
            imgUrlWithKey = ""
        }
        const newCarData = {
            name: newCarObj.name,
            upgrades: newCarObj.upgrades,
            wheels: newCarObj.wheels,
            imgUrl: imgUrlWithKey,
            category: newCarObj.category,
            color: newCarObj.color,
            userId: props.profileUser.userId,
            performance: newCarObj.performance
        }
        if(app.currentUser.id === props.profileUser.userId){
            const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
            const collectionUsers = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("users")
            const collectionMyCars = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("my-cars")
            if(imgData64){
                const result = await app.currentUser.functions.putImageObjToS3(imgData64, bucketName, filekey, imgFile.type)
                console.log('res', result)
            }
                    
                    try{
                        await collectionMyCars.insertOne(newCarData).then(async res =>{
                            console.log('res', res)
                            console.log('inserted', res.insertedId)
                            await collectionUsers.updateOne(
                                { "userId": app.currentUser.id },
                                {$push: { myCars:  res.insertedId}},
                                { upsert: true }
                                ).then(res =>{
                                    console.log('res', res)
                                    props.getMyCars(mongo)
                         
                                    closeModal()
                                })
                        })
         
                    }catch(err){
                        console.log(err)
                    }
 
        }else{
            console.log('warning current user and the login user do not match')
            // const token = sessionStorage.getItem('session_token')
            const tokenUser = sessionStorage.getItem('session_user')
        
            const credentials = jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET)
            
            try{
                await app.logIn(credentials.cre).then(async user =>{
                    const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
                    const collectionUsers = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("users")
                    const collectionMyCars = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("my-cars")
                    if(user.id === app.currentUser.id){
                        console.log('user updated')
                    }else{
                        console.log('user not updated')
                    }
                    if(imgData64){
                        const result = await user.functions.putImageObjToS3(imgData64, bucketName, filekey, imgFile.type)
                        console.log('res', result)
                    }
               
                        try{
                            await collectionMyCars.insertOne(newCarData).then(async res =>{
                                console.log('res', res)
                                await collectionUsers.updateOne(
                                    { "userId": app.currentUser.id },
                                    {$push: { myCars:  res.insertedId}},
                                    { upsert: true }
                                    ).then(res =>{
                                        console.log('res', res)
                                        props.getMyCars(mongo)
                                        // const oldArr = props.profileUser.myCars
                                        // const cars = {myCars: oldArr.push(newCarData)}
                                        // props.updateProfileData(cars, 'myCars')
                                        closeModal()
                                    })
                            })
                        }catch(err){
                            console.log(err)
                        }
                //     })
                    
                })
            }catch(err){
                console.log(err)
            }
    }
        
}

    return(
    <Fragment>
        <Modal show={props.show} onHide={props.handleClose} className="modal-wrapper-bio">
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <Row className="bio-modal-inner-wrapper">
                    <Col sm={6} className="">
                    <ImageUpload fileObj={setImgData} />

                    {/* <div {...getRootProps()} className="dropzone-wrapper">
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
                    </div> */}
                    
                    </Col>
                    <Col sm={6}>
                    <Form>
                        <Form.Group >
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select"  onChange={handleChange} name="category">
                            {carCategories.map((category, index) =>{
                                return(
                                    <option key={category + index}>{category}</option>
                                )
                            })}

                            </Form.Control>
                        </Form.Group>
                        <br/>
                        <Form.Group >
                            <Form.Label>Car name</Form.Label>
                            <Form.Control type="text" placeholder="Enter car name e.g. maker, model, year" onChange={handleChange} name="name" required/>
                        </Form.Group>
                        <br/>
                        <Form.Group >
                            <Form.Label>Color</Form.Label>
                            {/* <Form.Control type="text" placeholder="Select your color" onChange={handleChange} name="color" /> */}
                            <Form.Control as="select" onChange={handleChange} name="color">
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
                            <Form.Control type="text" placeholder="Enter your wheel" onChange={handleChange} name="wheels" required/>
                        </Form.Group>
                        <br/>
                        <Form.Group >
                            <Form.Label>Performance</Form.Label>
                            <Form.Control type="text" placeholder="Enter your performance" onChange={handleChange} name="performance" required/>
                        </Form.Group>
                        <br/>
                        <Form.Group >
                            <Form.Label>Upgrades</Form.Label>
                            <Form.Control type="text" placeholder="Enter your update" onChange={handleChange} name="upgrades" required />
                        </Form.Group>
                        <br/><br/>
                        <Row>
                            <Col sm={6}>
                                <Button variant="secondary" onClick={closeModal} className="cancel-btn" > 
                                    Cancel
                                </Button>
                            </Col>
                            <Col sm={6}>
                                <Button variant="primary" type="submit" onClick={handleSubmit} className="save-changes-btn">
                                Add my new car
                                </Button>
                                {/* <Button onClick={testSubmit}>
                                    test Submit
                                </Button> */}
                                {/* <br></br><br/>
                                <button onClick={testImgUpload}>test upload</button> */}
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
    )
}

const mapDispatchToProps = (dispatch) =>{
    return{
        createMyCar: (car) => dispatch(createMyCar(car))
    }
}

export default connect(null, mapDispatchToProps)(CreateNewCar)