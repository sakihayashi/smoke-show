import React from 'react'
import { useState, useEffect } from 'react'
import uploadIcon from '../../assets/global/upload.svg'
import { Alert } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'

  const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  };
  
  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
  };
  
  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };
  
  const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
  };


const ImageUpload = (props ) => {
    
    const [files, setFiles] = useState([])
    const [msg, setMsg] = useState('')
    const [uploaded, setUploaded] = useState(false)

    const getFileData = (obj) => {
        // Create a root reference
        console.log('file obj', obj)
        // const newValue = files[0]
        props.fileObj(obj)
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
            accept: 'image/*',
            onDrop: acceptedFiles => {
              
              if(acceptedFiles.length > 1){
                  setMsg('You can upload only one image.')
              }else if(acceptedFiles[0].size / (1024 * 1024) > 3){
                  setMsg('The file size is too big. Please choose different file.')
              }else{
                    getFileData(acceptedFiles[0])
                    setUploaded(true)
                    if(props.imgChange){
                      props.imgChange(true)
                    }
                    
                    setFiles(acceptedFiles.map( file => Object.assign(file, {
                              preview: URL.createObjectURL(file)
                          
                        })
                        ))
              }
            }
          })

    const thumbs = files.map(file => (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <img
            src={file.preview}
            style={img}
          />
        </div>
      </div>
    ));
  
    useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    return ( 
        <React.Fragment>
            {/* {msg ? <p>{msg}</p> : ''} */}
                <div {...getRootProps({className: 'dropzone'})} className="dropzone dropzone-wrapper" >
                    <input {...getInputProps()} required/>
                    {
                            isDragActive ?
                            <p>Drop the files here ...</p> :
                            <div className="drag-dropzone">
                                <div className="bio-modal-container">
                                    <img src={uploadIcon} alt="upload files here" />
                                    <p style={{padding: '5px'}}>
                                      { uploaded ? 'Change Image' : 'Drop an image file here or click to upload an image'}
                                    </p>
                                    {msg ? <Alert variant="danger">{msg}</Alert> : ''}
                                    <p>*3MB max image file size<br/>
                                    *accepted file formats: jpg, png, gif</p>
                                    <aside style={thumbsContainer}>
                                        {uploaded ? thumbs : ''}
                                    </aside>
                                </div>
                                
                            </div>
                        }
                    
                </div>
                
         
        </React.Fragment>

     );
}
 
export default ImageUpload;