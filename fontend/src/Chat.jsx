import React, { useEffect, useRef, useState } from 'react'
import { RiArrowGoBackFill } from "react-icons/ri";
import { useNavigate, useParams } from 'react-router-dom';
import axiosIns from './protectRoutes/axiosInstance';
import { LuSend } from "react-icons/lu";

import socket from './socket/socketConnect';
import Notfoundpage from './Notfoundpage';
import Loading from './Loading';

function Chat() {

    const navigate = useNavigate()
    const [chatroom, setChatroom] = useState([])
    const [users, setUsers] = useState([])
    const [text, setText] = useState()

    const {myid, userid} = useParams()
    const [online, setOnline] = useState([])
    const [loading, setLoading] = useState(false)

    const messageEn = useRef(null)

    const [statuserr, setStatuserr] = useState()

    useEffect(()=>{
        messageEn.current?.scrollIntoView({behavior: 'smooth'})
    },[chatroom])

    useEffect(()=>{
        axiosIns.put('/user/api/readNoti',{userid})
        .then(()=>{
           // console.log('working.')
        })
    },[chatroom])

    useEffect(()=>{

        socket.emit('register', myid)
        
        const chatFun = async()=>{
            setLoading(true)
            setTimeout(async()=>{
                try{
                    await axiosIns.post('/chat/api/findroom', {myid, userid})
                    .then((response) => {
                        setUsers(response.data.roomusers)
                        return setChatroom(response.data.allchat)
                    }).catch((err) =>{
                        //console.log(err.response.status,'this is respone')
                        setStatuserr(err.response.status)
                    })
        
                    await axiosIns.put('/user/api/readNoti',{userid})
                    .then((response)=>{
                        //console.log('deleted.')
                    })
                }catch(err){
                    console.log(err)
                }finally{
                    setLoading(false)
                }
            },1200)
        }
        chatFun();
    },[])

    useEffect(()=>{
        socket.on('getstatus', (status)=>{
            setOnline(status)
        })
        return ()=>{
            socket.off('getstatus');
        }
    },[userid])
   // console.log(online,'this is status from chat room')

    const sendmessageFun = async(e)=>{
        e.preventDefault();
        try{
            if(!text) {
                return //console.log('No messsage.')
            }

            socket.emit('sendMsg', {
                usersend: myid,
                userget: userid,
                text
            })

            const newMsgDisplay = [...chatroom]
            newMsgDisplay.push({
                userSend: myid,
                userGet: userid,
                text
            })
            setChatroom(newMsgDisplay)
            setText("")

            await axiosIns.put('/user/api/addNoti',{userid})
            .then((response)=>{
               // console.log(response.data,'when open someone chat')
            })
            
            await axiosIns.post('/chat/api/sendmessage', {usersend: myid, userget: userid, text})
            .then((response) => {
                //console.log('send message success')
            })
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        socket.on('message', (getmsg)=>{
            //console.log(getmsg,'this is msg server')
    
            if(myid === getmsg.userget && userid === getmsg.usersend){
    
                setChatroom((chat)=> [...chat, 
                    {
                        userSend: getmsg.usersend,
                        userGet: getmsg.userget,
                        text: getmsg.text
                    }
                ])
            }
        })
        return ()=>{
            socket.off('message');
        }
    },[])

    if(statuserr === 404) {
        return <Notfoundpage/>
    }
    
  return (
    <div className='chat-con'>
        {loading && <Loading/>}
        <div className='head-chat'>
            <button onClick={()=> navigate(-1)}>
                <RiArrowGoBackFill />
            </button>
            {
                users? users.map((name, index)=>{

                    return (
                        name._id !== myid? <h3 key={index}>{name.username}</h3> : null
                    )
                }): null
            }
            <p className={online.includes(userid)? 'online' : 'offline'}>• {
                online.includes(userid)? 'online' : 'offline'
            }</p>
        </div>

        <div className='chat-content'>
            {
                chatroom? chatroom.map((message, index)=>{
                    return (
                        <div ref={messageEn} key={index} className={message.userSend === myid? 'chat-box isend': 'chat-box'}>
                        <div className='text-box'>
                             <p>{message.text}</p>
                        </div>
                     </div>
                    )
                }): null
            }

        </div>

        <div className='send-box'>
            <form onSubmit={sendmessageFun} className='div'>
            <input value={text} onChange={(e)=> setText(e.target.value)} type='text' placeholder='messages'/>
            {
                loading? <button disabled><LuSend /></button> : <button><LuSend /></button>
            }
            </form>
        </div>

    </div>
  )
}

export default Chat