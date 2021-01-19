import React, { useState, Fragment, useCallback, useEffect } from 'react'
import { Row, Col, Modal, Button, Form } from 'react-bootstrap'
import {useDropzone} from 'react-dropzone'
import AWS from 'aws-sdk';
import Amplify, { Auth, Storage } from 'aws-amplify';
// import awsExports from '../aws-exports'


import editIcon from '../../assets/global/edit-icon.svg'
import uploadIcon from '../../assets/global/upload.svg'

const CreateNewCar = (props) =>{
    const albumBucketName = process.env.REACT_APP_AWS_BUCKET_NAME;
    const bucketRegion = process.env.REACT_APP_BUCKET_REGION;
    const IdentityPoolId = process.env.REACT_APP_POOL_ID;
    const albumName = "test"

    Amplify.configure({
        Auth: {
            identityPoolId: process.env.REACT_APP_AWS_POOL_ID, //REQUIRED - Amazon Cognito Identity Pool ID
            region: process.env.REACT_APP_AWS_BUCKET_REGION, // REQUIRED - Amazon Cognito Region
            // userPoolId: 'XX-XXXX-X_abcd1234', 
            //OPTIONAL - Amazon Cognito User Pool ID
            // userPoolWebClientId: 'XX-XXXX-X_abcd1234', 
            //OPTIONAL - Amazon Cognito Web Client ID
        },
        Storage: {
            AWSS3: {
                bucket: process.env.REACT_APP_S3_BUCKET, //REQUIRED -  Amazon S3 bucket name
                region: process.env.REACT_APP_AWS_BUCKET_REGION, //OPTIONAL -  Amazon service region
            }
        }
    });


    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        console.log('file', acceptedFiles)
        const file = acceptedFiles[0]
        const fileName = file.name;
        const albumPhotosKey = encodeURIComponent(albumName) + "/"
        console.log('key', albumPhotosKey)
        const photoKey = albumPhotosKey + fileName;
        var upload = new AWS.S3.ManagedUpload({
            params: {
              Bucket: albumBucketName,
              Key: photoKey,
              Body: file
            }
          });
        
          var promise = upload.promise();
        
          promise.then(data => {
              alert("Successfully uploaded photo.");
            //   viewAlbum(albumName);
            },
            function(err) {
              return alert("There was an error uploading your photo: ", err.message);
            }
          );
      }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    
    const carColors = ['White', 'Black', 'Grey', 'Blue', 'Silver', 'Red', 'Orange', 'Bronze', 'Yellow', 'Green', 'Navy']
    const carCategories = ['Daily Driver', 'Vehicle #2', 'Dream Car']
    const [newCarObj, setNewCarObj] = useState({})
    const handleChange = (e) =>{
        setNewCarObj({
            ...newCarObj,
            [e.target.name]: e.target.value
        })
    }
    const testUpload = (e) =>{
        e.preventDefault()
        // Storage.put('test.txt', 'Hello')
        // .then (result => console.log(result))
        // .catch(err => console.log(err));
    }
    useEffect(() => {
        const script = document.createElement("script");

    script.src = "https://sdk.amazonaws.com/js/aws-sdk-2.828.0.min.js";
    script.async = true;

    document.body.appendChild(script);
    }, [])
    return(
    <Fragment>
        <Modal show={props.show} onHide={props.handleClose} className="modal-wrapper-bio">
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
                            <Form.Label>Caterogy</Form.Label>
                            <Form.Control type="text" placeholder="Select a category" onChange={handleChange} name="name"/>
                            <Form.Control>

                            </Form.Control>
                        </Form.Group>
                        <br/>
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
                                <Button variant="secondary" onClick={props.handleClose} className="cancel-btn" > 
                                    Cancel
                                </Button>
                            </Col>
                            <Col sm={6}>
                                <Button variant="primary" onClick={props.handleClose} className="save-changes-btn">
                                Add my new car
                                </Button>
                            </Col>
                            <button onClick={testUpload}>test upload</button>
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