import React from 'react'
import {Button} from 'antd'
import {withRouter} from 'react-router-dom'


function EditPhotoButton(props) {
    const onEdit = (e)=>{
        e.preventDefault()
        props.history.push(`/photo/edit/${props.photoId}`)
    }
    return (
        <div>
            <Button type="primary" onClick={onEdit}>
                Edit
            </Button>
            
        </div>
    )
}

export default withRouter(EditPhotoButton)
