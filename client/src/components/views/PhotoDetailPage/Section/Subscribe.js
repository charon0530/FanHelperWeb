import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import {message} from 'antd'
import Axios from 'axios'

function Subscribe(props) {
    const user = useSelector(state => state.user)
    const [Subscribed, setSubscribed] = useState(false)
    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    useEffect(()=>{
        let variable = { userTo : props.userTo}
        Axios.post('/api/subscribe/subscribeNumber',variable)
            .then(response=>{
                if(response.data.success){
                    setSubscribeNumber(response.data.subscribeNumber)
                }
                else{
                    alert('구독자 수 정보를 받아오지 못하였습니다.')
                }
            })


        let subscribedVariable =  {userTo:props.userTo, userFrom:user.userData._id}
        //console.log("=============================")
        //console.log(user.userData._id)
        Axios.post('/api/subscribe/subscribed',subscribedVariable)
            .then(response=>{
                if(response.data.success){
                    setSubscribed(response.data.subscribed)
                    //console.log(subscribedVariable)
                }
                else{
                    alert('정보를 받아오지 못하였습니다.')
                }
            })
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const onLogInPlz = ()=>{
        message.info('로그인이 필요합니다.')
    }

    const onSubscribe = () =>{
        let subscribedVariable =  {userTo:props.userTo, userFrom:user.userData._id}
        //구독한 상태라면
        if(Subscribed){
            Axios.post('/api/subscribe/unSubscribe',subscribedVariable)
                .then(response=>{
                    if(response.data.success){
                        setSubscribeNumber(SubscribeNumber-1)
                        setSubscribed(!Subscribed)
                    }
                    else{
                        alert('구독 취소에 실패하였습니다.')
                    }
                })
        }
        //구독하지 않은 상태라면
        else{
            Axios.post('/api/subscribe/Subscribe',subscribedVariable)
            .then(response=>{
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber+1)
                    setSubscribed(!Subscribed)
                }
                else{
                    alert('구독에 실패하였습니다.')
                }
            })

        }
    }

    if(!user.userData._id){
        return (
            <div>
                <button style={{
                    backgroundColor: `${Subscribed ? '#AAAAAA':'#CC0000'}`,
                    borderRadius: '4px', color: 'white',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                    onClick={onLogInPlz}
                >
                   {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe!'}
                </button>
            </div>
        )
    }
    else{
        return (
            <div>
                <button style={{
                    backgroundColor: `${Subscribed ? '#AAAAAA':'#CC0000'}`,
                    borderRadius: '4px', color: 'white',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                    onClick={onSubscribe}
                >
                   {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe!'}
                </button>
            </div>
        )
    }
    
}

export default Subscribe
