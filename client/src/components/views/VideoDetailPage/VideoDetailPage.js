import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {Row, Col, List} from 'antd'
import Axios from 'axios'
import { withRouter } from 'react-router-dom'
import SideVideo from './Section/SideVideo'
import Subscribe from './Section/Subscribe'
import DelVideoButton from './Section/DelVideoButton'
import EditVideoButton from './Section/EditVideoButton'
import LikeDislike from './Section/LikeDislike'
import Comment from './Section/Comment'
const {IP} = require('../../../config/Backend_IP')
const {PORT} = require('../../../config/Backend_Port')



function VideoDetailPage(props) {
    const videoId = props.match.params.videoId
    const variable = { videoId : videoId}
    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComments] = useState([])
    const user = useSelector(state => state.user)
    useEffect(() => {
        Axios.post('/api/video/getVideoDetail',variable)
            .then(response =>{
                if(response.data.success){
                    setVideoDetail(response.data.videoDetail)
                }
                else{
                    alert('비디오 정보를 가져오지 못하였습니다.')
                }
            })
        
        Axios.post('/api/video/comment/getComments', variable)
        .then(response=>{
            if(response.data.success){
                setComments(response.data.comments)
            }
            else{
                alert('댓글 가져오기에 실패하였습니다. ')
            }
        })

        Axios.post('/api/video/incView', variable)
            .then(response=>{
                if(response.data.success){
                    //console.log('view테스트')
                    //console.log(response.data.result)
                }
                else{
                    alert('view 증가에 실패하였습니다.')
                }
            })
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const refreshFunction = (newComment) =>{
        setComments(Comments.concat(newComment))
    }

    if(VideoDetail.writer){
        const editButton = VideoDetail.writer._id===user.userData._id &&<EditVideoButton videoId={VideoDetail._id} />
        const delButton = VideoDetail.writer._id===user.userData._id &&<DelVideoButton videoId={VideoDetail._id} />
        return (
            <Row>
                <Col lg={18} xs={24}>
                    <div style={{width: "100%", padding:'3rem 4rem'}}>
                        <video style={{width:"100%"}} src={`http://${IP}:${PORT}/${VideoDetail.filePath}`} controls />
    
                        <List.Item
                            actions={[<LikeDislike video videoId={videoId} userId={user.userData._id}/>,<Subscribe userTo={VideoDetail.writer._id} />,editButton, delButton]}
                        >
                            <List.Item.Meta
                                title={VideoDetail.title}//{VideoDetail.writer.name}
                                description={VideoDetail.description} />
                        </List.Item>

                        <Comment postId={videoId} commentList={Comments} refreshFunction={refreshFunction} />
                    </div>
    
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        )
    }
    else{
        return (<div>
            loading...
        </div>)
    }
}

export default withRouter(VideoDetailPage)
