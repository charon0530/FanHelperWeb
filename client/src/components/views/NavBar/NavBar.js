import React from 'react'
import { useSelector } from "react-redux";
import {withRouter} from 'react-router-dom'
import 'antd/dist/antd.css';


import LoggedInForm from './conditions/LoggedIn'
import LoggedOutForm from './conditions/LoggedOut'


function NavBar(props) {
    const user = useSelector(state => state.user)
    //console.log(user)
    //console.log('nav called')
    

    if(user.userData && !user.userData.isAuth){ //로그인이 안되어있으면
        return <LoggedOutForm />
    }

    else if(user.userData && user.userData.isAuth){ //로그인이 되어있으면
        return <LoggedInForm userName={user.userData.name}/>
    }
    
    return (<LoggedOutForm  />)
}

export default withRouter(NavBar) 