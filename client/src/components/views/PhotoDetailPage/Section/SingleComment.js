import React,{useState} from 'react'
import {useSelector} from 'react-redux'
import {Comment} from 'antd'
import Axios from 'axios'
import LikeDislike from './LikeDislike'

function SingleComment(props) {

    const user = useSelector(state => state.user)
    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")
    
    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }
    const onClickDelButton = () => {
        const del_var = {
            commentId:props.comment._id,
            postId:props.postId
        }
        Axios.post('/api/photo/comment/deleteComment',del_var)
            .then(response=>{
                if(response.data.success){
                    alert('삭제 되었습니다.')
                    window.location.reload();
                }
                else{
                    alert('댓글 삭제에 실패하였습니다.')
                }
            })
    }

    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value)
    }
    const onSubmit = (event)=> {
        event.preventDefault()

        const variables={
            content:CommentValue,
            writer:user.userData._id,
            photo_postId:props.postId,
            responseTo:props.comment._id
        }
        Axios.post('/api/photo/comment/saveComment',variables)
            .then(response=>{
                if(response.data.success){
                    console.log(response.data.result)
                    setCommentValue("")
                    props.refreshFunction(response.data.result)
                }
                else{
                    alert('댓글 저장에 실패하였습니다.')
                }
            })
    }

    const delbutton = user.userData._id === props.comment.writer._id && <span onClick={onClickDelButton} key="comment-basic-delete">Delete</span>
    const replybutton = user.userData._id && <span onClick={onClickReplyOpen} key="comment-basic-reply-to">&nbsp;&nbsp;Reply</span>
    const actions=[
        <LikeDislike userId={user.userData._id} commentId={props.comment._id}/>,
        replybutton,
        delbutton
    ]
    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                content={<p>{props.comment.content}</p>}
            />

            {OpenReply && user.userData._id &&

            <form style={{display:'flex'}} onSubmit={onSubmit}>
                <textarea
                    style={{width:'100%',borderRadius:'5px'}}
                    onChange={onHandleChange}
                    value={CommentValue}
                    placeholder='댓글을 입력해 주세요' 
                />
                <br />
                <button style={{width:'20%',height:'52px'}} onClick={onSubmit}>Submit</button>
            </form>

            }
        </div>
    )
}

export default SingleComment
