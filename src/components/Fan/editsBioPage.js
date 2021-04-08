import { Button, Form } from 'react-bootstrap'


export  const EditAbout = (props)=>{
    const {profileUser, handleChangeProfile, handleDataUpdate} = props
    return(
        <Form>
            <Form.Group >
                <Form.Label>Edit</Form.Label>
                <Form.Control as="textarea" rows={3} name="profileDesc" value={profileUser.profileDesc && profileUser.profileDesc } onChange={handleChangeProfile} />
            </Form.Group>
            <div className="bio-edit-btn-wrapper">
                <Button variant="primary" type="submit" onClick={handleDataUpdate} className="bio-edit-btn">
                    Submit
                </Button>
            </div>
            
        </Form>
    )
}

export const EditSong = (props)=>{
    const { profileUser, handleChangeProfile, handleDataUpdate} = props

    return(
        <Form>
            <Form.Group >
                <Form.Label>Edit</Form.Label>
                <Form.Control as="textarea" rows={3} name="favSong" value={profileUser.favSong && profileUser.favSong } onChange={handleChangeProfile} />
            </Form.Group>
            <div className="bio-edit-btn-wrapper">
                <Button variant="primary" type="submit" onClick={handleDataUpdate} className="bio-edit-btn">
                    Submit
                </Button>
            </div>
            
        </Form>
    )
}

export const EditArtist = (props)=>{
    const { profileUser, handleChangeProfile, handleDataUpdate} = props
    return(
        <Form>
            <Form.Group >
                <Form.Label>Edit</Form.Label>
                <Form.Control as="textarea" rows={3} name="favArtist" value={profileUser.favArtist && profileUser.favArtist } onChange={handleChangeProfile} />
            </Form.Group>
            <div className="bio-edit-btn-wrapper">
                <Button variant="primary" type="submit" onClick={handleDataUpdate} className="bio-edit-btn">
                    Submit
                </Button>
            </div>
            
        </Form>
    )
}