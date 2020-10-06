import React, { useState } from 'react'
import { Menu } from 'antd';
import axios from 'axios'
import { HomeOutlined, LoginOutlined, SettingOutlined } from '@ant-design/icons';
import {withRouter} from 'react-router-dom'
function LoggedOut(props) {
    const [current, setcurrent] = useState("mail")
    const handleClick = e => {
        console.log('click ', e);
        setcurrent({ current: e.key });
      };

    const homeClickHandler=(event)=>{
        props.history.push('/')
    }

    const loginClickHandler=(event)=>{
        props.history.push('/login')
    }

    const videoUploadClickHandler=(event)=>{
        props.history.push('/video/upload')
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

    console.log(props.user)
    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
            <Menu.Item key="mail" icon={<HomeOutlined />} onClick={homeClickHandler}>
                HOME
             </Menu.Item>

             

             <Menu.Item key="sign_up" icon={<SettingOutlined />} onClick={logoutClickHandler} style={{float: 'right'}}>
                LogOut
            </Menu.Item>
            
            <Menu.Item key="upload" icon={<SettingOutlined />} onClick={videoUploadClickHandler} style={{float: 'right'}}>
                Video
            </Menu.Item>

            <Menu.Item key="sign_in"  onClick={loginClickHandler} style={{float: 'right'}}>
               {props.userName}
            </Menu.Item>

            
        </Menu>
    )
}

export default withRouter(LoggedOut)
