import React, { useState, Fragment } from 'react'
import { Row, Col, Modal, Button, Form } from 'react-bootstrap'
import * as Realm from "realm-web"
import ImageUpload from './ImageUpload'
import jwt from 'jsonwebtoken'
import short from 'short-uuid'

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
    const carCategories = ['Dream Car', 'Daily Driver', 'Vehicle #2']
    const [newCarObj, setNewCarObj] = useState({name: '', category: 'Dream Car', color: 'White', wheels: '', upgrade: ''})

    const handleChange = (e) =>{
        setNewCarObj({
            ...newCarObj,
            [e.target.name]: e.target.value
        })
    }
    const createToken = (userData) =>{
        return jwt.sign({ userData: userData }, process.env.REACT_APP_JWT_SECRET, {expiresIn: maxAgeTest});
    }

 

    const handleSubmit = async (e) =>{
        e.preventDefault()
        const baseImgUrl = 'https://s3.amazonaws.com/images.test.smokeshow/'
        const imgId = short.generate()
        const filekey = props.profileUser.userId + '/my-cars/' + imgId
        const imgUrlWithKey = baseImgUrl + filekey
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
        const collectionInfluencer = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("influencers")
        const collectionMyCars = mongo.db(process.env.REACT_APP_REALM_DB_NAME).collection("my-cars")

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
            
            try{
                await app.currentUser.functions.putImageObjToS3(imgData64, bucketName, filekey, imgFile.type).then( async res =>{
                    console.log(res)
                    try{
                        await collectionMyCars.insertOne(newCarData).then(async res =>{
                            console.log('res', res)
                            console.log('inserted', res.insertedId)
                            await collectionInfluencer.updateOne(
                                { "userId": app.currentUser.id },
                                { $push: { myCars:  res.insertedId }},
                                { upsert: true }
                                ).then(res =>{
                                    console.log('res', res)
                                    const oldArr = []
                                    if(props.profileUser.myCars){
                                        oldArr = props.profileUser.myCars
                                    }else{
                                        oldArr = []
                                    }
                                    
                                    const cars = {myCars: oldArr.push(newCarData)}
                                    props.updateProfileData(cars, 'myCars')
                                    props.updateCarData(newCarData)
                                    closeModal()
                                })
                        })
                    //     await mongoCollection.updateOne(
                    //         { "userId": app.currentUser.id},
                    //         {
                    //          $push: { myCars: newCarData }
                    //         }
                    //         ).then(res =>{
                    //             console.log('res', res)
                    //             const oldArr = props.profileUser.myCars
                    //             const cars = {myCars: oldArr.push(newCarData)}
                    //             props.updateProfileData(cars, 'myCars')
                    //             closeModal()
                    //         })
                    }catch(err){
                        console.log(err)
                    }
                })
            }catch(err){
                console.log(err)
            }
        }else{
            console.log('warning current user and the login user do not match')
            const token = sessionStorage.getItem('session_token')
            const decoded = jwt.verify(token, process.env.REACT_APP_JWT_SECRET)
            const credentials = Realm.Credentials.emailPassword(decoded.userData.login.email, decoded.userData.login.password)
            
            try{
                await app.logIn(credentials).then(user =>{
                    user.functions.putImageObjToS3(imgData64, bucketName, filekey, imgFile.type).then( async res =>{
             
                        try{
                            await collectionMyCars.insertOne(newCarData).then(async res =>{
                                console.log('res', res)
                                await collectionInfluencer.updateOne(
                                    { "userId": app.currentUser.id },
                                    {$push: { myCars:  res.insertedId}},
                                    { upsert: true }
                                    ).then(res =>{
                                        console.log('res', res)
                                        const oldArr = props.profileUser.myCars
                                        const cars = {myCars: oldArr.push(newCarData)}
                                        props.updateProfileData(cars, 'myCars')
                                        closeModal()
                                    })
                            })
                        }catch(err){
                            console.log(err)
                        }
                    })
                    
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
                            <Form.Label>Upgrades</Form.Label>
                            <Form.Control type="text" placeholder="Enter your update" onChange={handleChange} name="upgrades" />
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

export default CreateNewCar