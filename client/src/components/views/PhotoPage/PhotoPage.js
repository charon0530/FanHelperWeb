import React,{useEffect, useState} from 'react'
import {Typography, Row, Card, Col} from 'antd'
import {LikeFilled} from '@ant-design/icons'
import moment from 'moment'
import Axios from 'axios'
const {Title} = Typography
const {Meta} = Card
const {IP} = require('../../../config/Backend_IP')
const {PORT} = require('../../../config/Backend_Port')


function PhotoPage(props) {
    const [Photo, setPhoto] = useState([])
    useEffect(()=>{
        Axios.get('/api/photo/getPhotos')
        .then(response=>{
            if(response.data.success){
                //console.log(response.data)
                setPhoto(response.data.photos)
            }
            else{
                alert('비디오 가져오기를 실패했습니다.')
            }
        })
    },[])

    const renderCards= Photo.map((photo,index)=>{    
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
                <span style={{margineLeft:'3rem'}}>{photo.views} views </span>
                 - <span> {moment(photo.createdAt).format("MMM Do YY")} </span>
                <br />
                <span style={{margineLeft:'3rem'}}><LikeFilled /> {photo.likes} </span>
                    
            </Col>)

    })

    return (
        <div style={{width:'85%', margin:'3rem auto'}}>
            <Title level={2}>Photo Page</Title>
            <hr />
            <Row gutter={[32,16]}>

            {renderCards}


            </Row>
        </div>
    )
}

export default PhotoPage
