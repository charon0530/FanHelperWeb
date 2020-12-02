import React from 'react'
import {Button} from 'antd'
import {withRouter} from 'react-router-dom'


function EditVideoButton(props) {
    const onEdit = (e)=>{
        e.preventDefault()
        props.history.push(`/video/edit/${props.videoId}`)
    }
    return (
        <div>
            <Button type="primary" onClick={onEdit}>
                Edit
            </Button>
            
        </div>
    )
}

export default withRouter(EditVideoButton)
