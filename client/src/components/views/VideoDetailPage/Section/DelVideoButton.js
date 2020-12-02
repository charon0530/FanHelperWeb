import Axios from 'axios'
import React from 'react'
import {message , Button} from 'antd'
import {withRouter} from 'react-router-dom'
import {useSelector} from 'react-redux'

function DelVideoButton(props) {
    const user = useSelector(state => state.user)
    const delVariables = {
        videoId:props.videoId,
        currentID: user.userData._id
    }
    const onDelete = ()=>{
        Axios.post('/api/video/delVideo',delVariables)
            .then((response)=>{
                if(response.data.success){
                    message.success('삭제되었습니다.')
                    props.history.push('/')
                }
                else{
                    alert('삭제에 실패하였습니다.')
                }
            })
    }
    return (
        <div>
            <Button type="primary" onClick={onDelete}>
                Delete
            </Button>
            
        </div>
    )
}

export default withRouter(DelVideoButton)
