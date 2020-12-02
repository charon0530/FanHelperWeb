import Axios from 'axios'
import React,{useState} from 'react'
import {useSelector} from 'react-redux'
import SingleComment  from './SingleComment'
import ReplyComment from './ReplyComment'

function Comment(props) {
    const videoId = props.postId

    const user = useSelector(state => state.user)
    const [commentValue, setcommentValue] = useState("")

    const handleClick = (event)=>{
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event)=>{
        event.preventDefault();

        const variables={
            content:commentValue,
            writer:user.userData._id,
            postId:videoId
        }
        Axios.post('/api/video/comment/saveComment',variables)
            .then(response=>{
                if(response.data.success){
                    console.log(response.data.result)
                    setcommentValue("")
                    props.refreshFunction(response.data.result)
                }
                else{
                    alert('댓글 저장에 실패하였습니다.')
                }
            })
    }

    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />

            {/*Comment List*/}
            {props.commentList && props.commentList.map((comment, index)=>(
                (!comment.responseTo &&
                    <React.Fragment key = {index}>
                        <SingleComment postId={videoId} comment = {comment} refreshFunction={props.refreshFunction}  />
                        <ReplyComment commentList={props.commentList} parentCommentId={comment._id} postId={videoId} refreshFunction={props.refreshFunction} />
                        <hr />
                    </React.Fragment>
                )       
            ))}
            


            {/*Root Comment Form*/}
            {user.userData._id && 
            <form style={{display:'flex'}} onSubmit={onSubmit}>
                <textarea
                    style={{width:'100%',borderRadius:'5px'}}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder='댓글을 입력해 주세요' 
                />
                <br />
                <button style={{width:'20%',height:'52px'}} onClick={onSubmit}>Submit</button>
            </form>
            }
            

        </div>
    )
}

export default Comment
