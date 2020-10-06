import React, { useState } from 'react'
import { Menu } from 'antd';
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

    const registerClickHandler=(event)=>{
        props.history.push('/register')
    }

    
    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
            <Menu.Item key="mail" icon={<HomeOutlined />} onClick={homeClickHandler}>
                HOME
             </Menu.Item>

            <Menu.Item key="sign_in" icon={<LoginOutlined />} onClick={loginClickHandler} style={{float: 'right'}}>
                SIGN IN
            </Menu.Item>

            <Menu.Item key="sign_up" icon={<SettingOutlined />} onClick={registerClickHandler} style={{float: 'right'}}>
                SIGN UP
            </Menu.Item>
        </Menu>
    )
}

export default withRouter(LoggedOut)
