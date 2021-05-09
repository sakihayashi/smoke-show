import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'


export const EditComment = (props)=>{
    const { updateComment, comment, commentId, index } = props
    const [rewrite, setRewrite] = useState(comment)
    const handleChange = e =>{
        setRewrite(e.target.value)
    }
    return(
        <Form>
            <Form.Group >
                {/* <Form.Label>Edit</Form.Label> */}
                <Form.Control as="textarea" rows={3} name="comment" value={rewrite} onChange={handleChange} />
            </Form.Group>
            <div className="bio-edit-btn-wrapper">
                <Button variant="primary" type="submit" onClick={(e) => updateComment(e,commentId.toString(), index, rewrite)} className="bio-edit-btn">
                    Submit
                </Button>
            </div>
            
        </Form>
    )
}