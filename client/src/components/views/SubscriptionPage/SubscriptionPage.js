import React,{useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {Typography, Row, Card, Col} from 'antd'
import moment from 'moment'
import Axios from 'axios'
const {Title} = Typography
const {Meta} = Card
const {IP} = require('../../../config/Backend_IP')
const {PORT} = require('../../../config/Backend_Port')
function SubscriptionPage() {
    const user = useSelector(state => state.user)
    const [Video, setVideo] = useState([])
    const [Photo, setPhoto] = useState([])
    useEffect(()=>{

        const subscriptionVariables = {
            userFrom:user.userData._id
        }
        Axios.post('/api/subscribe/getSubscriptionVideos',subscriptionVariables)
        .then(response=>{
            if(response.data.success){
                console.log(response.data)
                setVideo(response.data.videos)
            }
            else{
                alert('비디오 가져오기를 실패했습니다.')
            }
        })

        Axios.post('/api/subscribe/getSubscriptionPhotos',subscriptionVariables)
        .then(response=>{
            if(response.data.success){
                console.log(response.data)
                setPhoto(response.data.photos)
            }
            else{
                alert('비디오 가져오기를 실패했습니다.')
            }
        })
     // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const renderCards= Video.map((video,index)=>{
        var minutes = Math.floor(video.duration/60)
        var seconds = Math.floor(video.duration - minutes * 60)
        
        return(
            <Col lg={6} md={8} xs={24} key={index}>
                <a href={`/video/${video._id}`}>
                    <div style={{position: 'relative'}}>
                        <img style={{width: '100%'}} src={`http://${IP}:${PORT}/${video.thumbnail}`} alt="thumbnail"/>
                        <div className="duration">
                            <span>{minutes} : {seconds} </span>
                        </div>
                    </div>

                </a>
                
               <br />
                <Meta 
                    title={video.title}
                    description="" />
                
                <span>{video.writer.name}</span><br/>
                <span style={{margineLeft:'3rem'}}>{video.views} views</span>
                - <span> {moment(video.createdAt).format("MMM Do YY")} </span>
                    
            </Col>)
    })


    const renderCards2= Photo.map((photo,index)=>{
        var minutes = Math.floor(photo.duration/60)
        var seconds = Math.floor(photo.duration - minutes * 60) //eslint-disable-line no-unused-vars
        
        return(
            <Col lg={6} md={8} xs={24} key={index}>
                <a href={`/photo/${photo._id}`}>
                    <div style={{position: 'relative'}}>
                        <img style={{width: "auto", height: "auto", maxWidth: "100%",maxHeight: "100%"}} src={`http://${IP}:${PORT}/${photo.filePath}`} alt='test' />
                    </div>

                </a>
                
               <br />
                <Meta 
                    title={photo.title}
                    description="" />
                
                <span>{photo.writer.name}</span><br/>
                <span style={{margineLeft:'3rem'}}>{photo.views} views</span>
                - <span> {moment(photo.createdAt).format("MMM Do YY")} </span>
                    
            </Col>)

    })

    return (
        <div style={{width:'85%', margin:'3rem auto'}}>
            <Title level={2}>Subscription Page</Title>
            <hr />
            <Row gutter={[32,16]}>

            {renderCards}
            </Row>
            <hr />
            <Row gutter={[32,16]}>
            {renderCards2}
            </Row>
        </div>
    )
}

export default SubscriptionPage
