import React,{useEffect, useState} from 'react'
import {Typography, Row, Card, Col} from 'antd'
import {LikeFilled} from '@ant-design/icons'
import moment from 'moment'
import Axios from 'axios'
const {Title} = Typography
const {Meta} = Card
const {IP} = require('../../../config/Backend_IP')
const {PORT} = require('../../../config/Backend_Port')


function LandingPage(props) {
    const [Video, setVideo] = useState([])
    useEffect(()=>{
        Axios.get('/api/video/getVideos')
        .then(response=>{
            if(response.data.success){
                //console.log(response.data)
                setVideo(response.data.videos)
            }
            else{
                alert('비디오 가져오기를 실패했습니다.')
            }
        })
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
                <span style={{margineLeft:'3rem'}}>{video.views} views </span>
                - <span> {moment(video.createdAt).format("MMM Do YY")} </span>
                <br />
                <span style={{margineLeft:'3rem'}}><LikeFilled /> {video.likes} </span>
                    
            </Col>)

    })

    return (
        <div style={{width:'85%', margin:'3rem auto'}}>
            <Title level={2}>Video Page</Title>
            <hr />
            <Row gutter={[32,16]}>

            {renderCards}


            </Row>
        </div>
    )
}

export default LandingPage
