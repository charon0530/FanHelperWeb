import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { Tooltip, message } from 'antd';
import {LikeOutlined,DislikeOutlined, LikeFilled, DislikeFilled} from '@ant-design/icons'
import Axios from 'axios';
function LikeDislike(props) {
    const [Likes, setLikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DisLikes, setDisLikes] = useState(0)
    const [DisLikeAction, setDisLikeAction] = useState(null)
    const user = useSelector(state => state.user)

    let variable={}
    if(props.video){
        variable = { videoId:props.videoId, userId:props.userId }
    }
    else if(props.photo){
        variable = { photoId:props.photoId, userId:props.userId }
    }
    else{
        variable={commentId:props.commentId, userId:props.userId}
    }
    useEffect(()=>{
        Axios.post('/api/like/getLikes', variable)
            .then(response=>{
                if(response.data.success){
                    //좋아요 수 가져오기
                    setLikes(response.data.likes.length)
                    //좋아요를 눌렀는지 확인
                    response.data.likes.map(like=>{
                        if(like.userId===props.userId){
                            setLikeAction('liked')
                        }
                        return null
                    })
                }
                else{
                    alert('좋아요 정보를 가져오는데 실패하였습니다')
                }
            })
        
        Axios.post('/api/like/getDisLikes', variable)
            .then(response=>{
                if(response.data.success){
                    //싫어요 수 가져오기
                    setDisLikes(response.data.dislikes.length)
                    //싫어요를 눌렀는지 확인
                    response.data.dislikes.map(dislike=>{
                        if(dislike.userId===props.userId){
                            setDisLikeAction('disliked')
                        }
                        return null
                    })
                }
                else{
                    alert('싫어요 정보를 가져오는데 실패하였습니다')
                }
            })
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const onLike = ()=>{
        if(user.userData._id){
            if(LikeAction === null){
                Axios.post('/api/like/uplike',variable)
                    .then(response=>{
                        if(response.data.success){
                            setLikes(Likes+1)
                            setLikeAction('liked')
    
                            if(DisLikeAction !== null){
                                setDisLikeAction(null)
                                setDisLikes(DisLikes-1)
                            }
                        }else{
                            alert('좋아요 올리기에 실패하였습니다.')
                        }
                    })
            }
            else{
                Axios.post('/api/like/unlike',variable)
                    .then(response=>{
                        if(response.data.success){
                            setLikes(Likes-1)
                            setLikeAction(null)
                        }else{
                            alert('좋아요 해제에 실패하였습니다.')
                        }
                    })
            }
        }
        else{
            message.info('로그인이 필요합니다.')
        } 
    }

    const onDislike = ()=>{
        if(user.userData._id){
            if(DisLikeAction!==null){
                Axios.post('/api/like/unDislike',variable)
                    .then(response=>{
                        if(response.data.success){
                            setDisLikes(DisLikes-1)
                            setDisLikeAction(null)
                        }
                        else{
                            alert('싫어요 해제에 실패하였습니다')
                        }
                    })
            }
            else{
                Axios.post('/api/like/upDislike',variable)
                    .then(response=>{
                        if(response.data.success){
                            setDisLikes(DisLikes+1)
                            setDisLikeAction('disliked')
    
                            if(LikeAction !== null){
                                setLikeAction(null)
                                setLikes(Likes - 1)
                            }
                        }
                        else{
                            alert('싫어요 해제에 실패하였습니다')
                        }
                    })
            }
        }
        else{
            message.info('로그인이 필요합니다.')
        }
    }

    const likeButton = LikeAction==='liked' ? <LikeFilled onClick={onLike} /> : <LikeOutlined onClick={onLike} />
    const dislikeButton = DisLikeAction==='disliked' ? <DislikeFilled onClick={onDislike} /> : <DislikeOutlined onClick={onDislike} />

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    {likeButton}
                </Tooltip>
            <span style={{paddingLeft:'8px',cursor:'auto'}}>{Likes}  </span>
            </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    {dislikeButton}
                </Tooltip>
    <span style={{paddingLeft:'8px',cursor:'auto'}}>{DisLikes}</span>
            </span>
        </div>
    )
}

export default LikeDislike
