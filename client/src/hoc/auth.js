import React, { useEffect } from 'react'
import {useDispatch} from 'react-redux'
import {auth} from '../_actions/user_action'

export default function(SpecificComponent, option, adminRoute = null){
    //option
    //null => everyone
    //true => login O
    //false => login X
    
    function AuthenticationCheck(props){
        const dispatch = useDispatch()

        useEffect(()=>{
            dispatch(auth())
                .then(response=>{
                    console.log(response)
                    
                    //여기서 분기

                    //로그인 안한 상태
                    if(!response.payload.isAuth){
                        if(option){ // 로그인이 필요한 곳 접속 시
                            props.history.push('/login')
                        }
                    }
                    //로그인 한 상태
                    else{
                        if(adminRoute && !response.payload.isAdmin){ //어드민 아닌데 어드민 페이지 로그인
                            props.history.push('/')
                        }
                        else{
                            if(option===false){//로그인 없어야 하는 곳 접속 시
                                props.history.push('/')
                            }
                        }
                    }
                })
        },[])
        
        return(<SpecificComponent />
        )
    }
    return AuthenticationCheck
}