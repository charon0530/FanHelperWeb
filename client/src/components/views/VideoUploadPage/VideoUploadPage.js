import React, { useState } from 'react'
import {Typography,Button,Form,message, Input} from 'antd'
import { PlusOutlined, LoginOutlined, SettingOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea'
import Dropzone from 'react-dropzone'
import Axios from 'axios';

const {Title} = Typography

const PrivateOptions=[
    {value:0, label: "Private"},
    {value:1, label: "Public"}
]

const CategoryOptions=[
    {value:0, label: "Video"},
    {value:1, label: "Photo"}
]
function VideoUploadPage() {
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Video")


    const onTitleChange = (e)=>{
        setVideoTitle(e.currentTarget.value)
    }

    const onDiscriptionChange = (e)=>{
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e)=>{
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e)=>{
        setCategory(e.currentTarget.value)
    }

    const onDrop = (files) =>{
        let formData = new FormData
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file",files[0])

        Axios.post('/api/video/uploadfiles',formData,config)
        .then(response=>{
            if(response.data.success){
                console.log(response.data)
            }else{
                alert('업 로드 실패')
            }
        })

    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2} > Upload Video</Title>
            </div>
            
            <Form onSubmit>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/*비디오 업로드 할 공간*/}
                    <Dropzone 
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={100000000}
                        >
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', alignItems: 'center', justifyContent: 'center' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <PlusOutlined style={{ fontSize: '10rem' }} />

                            </div>
                        )}

                        </Dropzone>
                    {/*썸네일*/}
                    <div>
                        
                    </div>
                </div>
                <br />
                <br />
                <label>Title</label>
                <Input 
                    onChange={onTitleChange}
                    value={VideoTitle} />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDiscriptionChange}
                    value={Description} />
                <br />
                <br />

                <select onChange = {onPrivateChange}>
                    {PrivateOptions.map((item,index)=>(
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />

                <select onChange = {onCategoryChange}>
                {CategoryOptions.map((item,index)=>(
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />

                <Button type="primary" size="large" onClick>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage