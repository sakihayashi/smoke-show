import React, { useState, Fragment } from 'react'
import { Row, Col, Modal, Button, Form } from 'react-bootstrap'
import * as Realm from "realm-web"
import ImageUpload from './ImageUpload'
import jwt from 'jsonwebtoken'


const CreateNewCar = (props) =>{
    const bucketName = process.env.REACT_APP_AWS_BUCKET_NAME;
    // const bucketRegion = process.env.REACT_APP_BUCKET_REGION;
    // const IdentityPoolId = process.env.REACT_APP_POOL_ID;
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
          console.log(base64);
        };
        reader.readAsDataURL(file);
      }
    const closeModal = () =>{
        setNewCarObj({name: '', category: '', color: '', wheels: '', upgrade: ''})
        props.handleClose()
    }


    // const onDrop = useCallback(acceptedFiles => {
        
        // var file = acceptedFiles[0]
        // const reader = new FileReader();
        // reader.onload = (event) => {
        // setImgFile(acceptedFiles[0])
        // const base64 = event.target.result.split(",").pop()
        //   setImgData64(base64)
        // //   console.log(event.target.result);
        // };
        // reader.readAsDataURL(file);
    //     // Do something with the files
    //   }, [])
    // const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    
    const carColors = ['White', 'Black', 'Grey', 'Blue', 'Silver', 'Red', 'Orange', 'Bronze', 'Yellow', 'Green', 'Navy']
    const carCategories = ['Daily Driver', 'Vehicle #2', 'Dream Car']
    const [newCarObj, setNewCarObj] = useState({name: '', category: '', color: '', wheels: '', upgrade: ''})

    const handleChange = (e) =>{
        setNewCarObj({
            ...newCarObj,
            [e.target.name]: e.target.value
        })
    }
    const createToken = (userData) =>{
        return jwt.sign({ userData: userData }, process.env.REACT_APP_JWT_SECRET, {expiresIn: maxAgeTest});
    }
    const handleSubmit = (e) =>{
        e.preventDefault()
        const token = localStorage.getItem('session_token')
        var decoded = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
        console.log('test', decoded) 
    }
    // const testUpload = async (e) =>{
    //     e.preventDefault()
    //     const credentials = Realm.Credentials.emailPassword('saki@thehoongroup.com', 'aaaaaa')
    //     const filekey = 'test/' + imgFile.name
    //     //username profile_car_
    //     try{
    //         await app.logIn(credentials).then(async user =>{
    //             // base64EncodedImage, bucket, fileName, fileType
    //             const result = await user.functions.putImageObjToS3(imgData64, bucketName, filekey, imgFile.type);
    //             console.log('res', result)
    //         })
    //     }catch(err){
    //         console.log(err)
    //     }
    // }

    return(
    <Fragment>
        <Modal show={props.show} onHide={props.handleClose} className="modal-wrapper-bio">
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <Row className="bio-modal-inner-wrapper">
                    <Col sm={6} className="">
                    <ImageUpload fileObj={setImgData}/>

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
                            <Form.Control type="text" placeholder="Enter car name e.g. maker, model, year" onChange={handleChange} name="name"/>
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
                            <Form.Control type="text" placeholder="Enter your wheel" onChange={handleChange} name="wheels"/>
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
                                <Button variant="secondary" onClick={closeModal} className="cancel-btn" > 
                                    Cancel
                                </Button>
                            </Col>
                            <Col sm={6}>
                                <Button variant="primary" onClick={props.handleClose} className="save-changes-btn">
                                Add my new car
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
    )
}

export default CreateNewCar