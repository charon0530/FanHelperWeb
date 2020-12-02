import React, { useState } from 'react'
import { Menu } from 'antd';
import axios from 'axios'
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import {withRouter} from 'react-router-dom'
function LoggedIn(props) {
    const [current, setcurrent] = useState("mail")
    const handleClick = e => {
        //console.log('click ', e);
        setcurrent({ current: e.key });
      };

    const homeClickHandler=(event)=>{
        props.history.push('/')
    }
    const photoClickHandler=(event)=>{
        props.history.push('/photo')
    }
    const videoClickHandler=(event)=>{
        props.history.push('/video')
    }

    const loginClickHandler=(event)=>{ //eslint-disable-line no-unused-vars
        props.history.push('/login')
    }

    const videoUploadClickHandler=(event)=>{
        props.history.push('/video/upload')
    }

    const photoUploadClickHandler=(event)=>{
        props.history.push('/photo/upload')
    }

    const subscriptionClickHandler=(event)=>{
        props.history.push('/subscription')
    }

    const logoutClickHandler=(event)=>{
        axios.get("/api/users/logout")
        .then(response => {
            if(response.data.success){
                props.history.push('/login')
            }
            else{
             alert('로그아웃에 실패하였습니다.')   
            }
        })
    }

    //console.log(props.user)
    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
            <Menu.Item key="mail" icon={<HomeOutlined />} onClick={homeClickHandler}>
                HOME
             </Menu.Item>

             <Menu.Item key="photo" icon={<HomeOutlined />} onClick={photoClickHandler}>
                Photo
             </Menu.Item>

             <Menu.Item key="video" icon={<HomeOutlined />} onClick={videoClickHandler}>
                Video
             </Menu.Item>

             <Menu.Item key="subscription" icon={<HomeOutlined />} onClick={subscriptionClickHandler}>
                subscription
             </Menu.Item>

             

             

             <Menu.Item key="sign_up" icon={<SettingOutlined />} onClick={logoutClickHandler} style={{float: 'right'}}>
                LogOut
            </Menu.Item>
            
            <Menu.Item key="v_upload" icon={<SettingOutlined />} onClick={videoUploadClickHandler} style={{float: 'right'}}>
                Video
            </Menu.Item>

            <Menu.Item key="p_upload" icon={<SettingOutlined />} onClick={photoUploadClickHandler} style={{float: 'right'}}>
                Photo
            </Menu.Item>

            

            <Menu.Item key="sign_in"  style={{float: 'right'}}>
               {props.userName}
            </Menu.Item>

            
        </Menu>
    )
}

export default withRouter(LoggedIn)
