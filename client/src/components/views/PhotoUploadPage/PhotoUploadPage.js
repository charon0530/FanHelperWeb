import React, {useEffect, useState } from 'react'
import {Typography,Button,Form,message, Input} from 'antd'
import { PlusOutlined} from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea'
import Dropzone from 'react-dropzone'
import Axios from 'axios';
import {useSelector} from 'react-redux'
import {withRouter} from 'react-router-dom'
const {IP} = require('../../../config/Backend_IP')
const {PORT} = require('../../../config/Backend_Port')

const {Title} = Typography

/*
const PrivacyOptions=[
    {value:0, label: "Private"},
    {value:1, label: "Public"}
]

const CategoryOptions=[
    {value:0, label: "Video"},
    {value:1, label: "Photo"}
]
*/

function PhotoUploadPage(props) {
    const user = useSelector(state => state.user)
    const [PhotoTitle, setPhotoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Privacy, setPrivacy] = useState(0) //eslint-disable-line no-unused-vars
    const [Category, setCategory] = useState("Video") //eslint-disable-line no-unused-vars
    const [FilePath, setFilePath] = useState("")
    const [GroupList, setGroupList] = useState([])
    const [Group, setGroup] = useState("NONE")
    const [MemberList, setMemberList] = useState([])
    const [Name, setName] = useState("NONE")


    useEffect(() => {
        Axios.get('/api/getGroupList') 
            .then(response => {
                if (response.data.success) {
                    setGroupList(response.data.g_list)
                    setGroup(response.data.g_list[0])
                }

                else {
                    alert('그룹 목록을 불러오는데 실패하였습니다.')
                }
            })
            Axios.post('/api/memberList', { group: "bigbang" })
            .then(response => {
                if (response.data.success) {
                    setMemberList(response.data.m_list)
                    setName(response.data.m_list[0])
                }
                else {
                    alert("맴버를 불러오는데 실패하였습니다.")
                }
            })
    }, [])


    let GroupOptions = []

    GroupList.forEach((value,index)=>{
        GroupOptions.push({value:value,label:value})
    })

    let MemberOptions = []

    MemberList.forEach((value,index)=>{
        MemberOptions.push({value:value,label:value})
    })

    const onTitleChange = (e)=>{
        setPhotoTitle(e.currentTarget.value)
    }

    const onDiscriptionChange = (e)=>{
        setDescription(e.currentTarget.value)
    }
    /*
    const onPrivacyChange = (e)=>{
        setPrivacy(e.currentTarget.value)
    }

    const onCategoryChange = (e)=>{
        setCategory(e.currentTarget.value)
    }
    */

    const onGroupChange = (e) => {
        setGroup(e.currentTarget.value)
        //console.log(e.currentTarget.value)
        Axios.post('/api/memberList', { group: e.currentTarget.value })
            .then(response => {
                if (response.data.success) {
                    setMemberList(response.data.m_list)
                }
                else {
                    alert("맴버를 불러오는데 실패하였습니다.")
                }
            })
    }

    const onNameChange = (e) => {
        setName(e.currentTarget.value)
    }

    const onDrop = (files) =>{
        let formData = new FormData()
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file",files[0])

        Axios.post('/api/photo/uploadfiles',formData,config)
        .then(response=>{
            if(response.data.success){

                //console.log(response.data)
                setFilePath(response.data.filePath)

               
            }else{
                alert('업 로드 실패')
                //console.log(response.data)
            }
        })

    }

    const onSubmit=(e)=>{
        e.preventDefault()
        const variables={
            writer:user.userData._id,
            title:PhotoTitle,
            description:Description,
            privacy:Privacy,
            filePath:FilePath,
            category:Category,
            group:Group,
            name:Name
        }
        Axios.post('/api/photo/uploadPhoto',variables)
        .then(response=>{
            if(response.data.success){
                //console.log(response.data)
                message.success('업로드 되었습니다.')
                
                setTimeout(()=>{

                },1500)

                props.history.push('/')
            }
            else{
                alert('업로드에 실패하였습니다.')
            }
        })
    }







    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2} > Upload Photo</Title>
            </div>
            
            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/*이미지 업로드 할 공간*/}
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
                    {FilePath &&   //ThumbnailPath가 null이 아닐 경우 동작
                        <div>
                            <img src={`http://${IP}:${PORT}/${FilePath}`} alt="thumbnail"></img>
                        </div>
                    }

                    
                </div>
                <br />
                <br />
                <label>Title</label>
                <Input 
                    onChange={onTitleChange}
                    value={PhotoTitle} />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDiscriptionChange}
                    value={Description} />
                <br />
                <br />

                <select onChange = {onGroupChange}>
                    {GroupOptions.map((item,index)=>(
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />

                <select onChange = {onNameChange}>
                {MemberOptions.map((item,index)=>(
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />

                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default withRouter(PhotoUploadPage)
