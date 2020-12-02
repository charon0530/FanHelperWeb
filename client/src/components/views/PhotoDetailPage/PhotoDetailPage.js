import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {Row, Col, List} from 'antd'
import Axios from 'axios'
import { withRouter } from 'react-router-dom'
import SidePhoto from './Section/SidePhoto'
import Subscribe from './Section/Subscribe'
import DelPhotoButton from './Section/DelPhotoButton'
import EditPhotoButton from './Section/EditPhotoButton'
import LikeDislike from './Section/LikeDislike'
import Comment from './Section/Comment'
const {IP} = require('../../../config/Backend_IP')
const {PORT} = require('../../../config/Backend_Port')



function PhotoDetailPage(props) {
    const photoId = props.match.params.photoId
    const variable = { photoId : photoId}
    const [PhotoDetail, setPhotoDetail] = useState([])
    const [Comments, setComments] = useState([])
    const user = useSelector(state => state.user)
    useEffect(() => {
        Axios.post('/api/photo/getPhotoDetail',variable)
            .then(response =>{
                if(response.data.success){
                    setPhotoDetail(response.data.photoDetail)
                    //console.log('done')
                }
                else{
                    alert('비디오 정보를 가져오지 못하였습니다.')
                }
            })

            Axios.post('/api/photo/comment/getComments', variable)
            .then(response=>{
                if(response.data.success){
                    setComments(response.data.comments)
                    //console.log(response.data.comments)
                }
                else{
                    alert('댓글 가져오기에 실패하였습니다.')
                }
            })

            Axios.post('/api/photo/incView', variable)
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

    if(PhotoDetail.writer){
        const editButton = PhotoDetail.writer._id===user.userData._id &&<EditPhotoButton photoId={PhotoDetail._id} />
        const delButton = PhotoDetail.writer._id===user.userData._id &&<DelPhotoButton photoId={PhotoDetail._id} />
        return (
            <Row>
                <Col lg={18} xs={24}>
                    <div style={{width: "100%", padding:'3rem 4rem'}}>
                        <img style={{width:"100%"}} src={`http://${IP}:${PORT}/${PhotoDetail.filePath}`} alt="" />
    
                        <List.Item
                            actions={[<LikeDislike photo photoId={photoId} userId={user.userData._id}/>,<Subscribe userTo={PhotoDetail.writer._id} />,editButton,delButton]}
                        >
                            <List.Item.Meta
                                title={PhotoDetail.title}//{PhotoDetail.writer.name}
                                description={PhotoDetail.description} />
                        </List.Item>

                        <Comment postId={photoId} commentList={Comments} refreshFunction={refreshFunction} />
                    </div>
    
                </Col>
                <Col lg={6} xs={24}>
                    <SidePhoto />
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

export default withRouter(PhotoDetailPage)
