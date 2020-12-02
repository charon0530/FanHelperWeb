import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {
    
    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)
    useEffect(()=>{
        let commentNumber = 0
            props.commentList.map((comment)=>{
                if(comment.responseTo === props.parentCommentId){
                    commentNumber ++
                }
                return null
            })

            setChildCommentNumber(commentNumber)
             // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.commentList])

    const renderReplyComment = (parentCommentId) => (
        props.commentList.map((comment,index)=>(
            <React.Fragment key={index}>
                {
                    comment.responseTo === parentCommentId &&
                    <div style={{width:'80%',marginLeft:'40px'}}>
                        <SingleComment postId={props.postId} comment = {comment} refreshFunction={props.refreshFunction} />{/*본체*/}
                        <ReplyComment commentList={props.commentList} parentCommentId={comment._id} postId={props.postId} refreshFunction={props.refreshFunction} />{/*재귀를 위한부분(변수 전달)*/}
                        <hr />
                    </div>
                }
            </React.Fragment>
        ))
    )

    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }
    return (
        <div>
                { 
                    ChildCommentNumber > 0 &&
                    <React.Fragment>
                    <p style={{fontStyle: '14px', margin: 0, color : 'gray'}} onClick={onHandleChange}>
                         View {ChildCommentNumber} more comment(s)
                    </p>
                    </React.Fragment>
                }
                
                {
                    OpenReplyComments &&
                    renderReplyComment(props.parentCommentId)
                }
            
        </div>
    )
}

export default ReplyComment
