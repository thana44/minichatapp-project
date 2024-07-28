import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaPowerOff } from "react-icons/fa6";

import axiosIns from './protectRoutes/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import socket from './socket/socketConnect';
import Loading from './Loading';

function UserList() {
    const [uList, setUList] = useState([])
    const [currentUser, setCurrentUser] = useState([])
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [loadLogout, setLoadLogout] = useState(false)

    const [online, setOnline] = useState([])
    const [notification, setNotification] = useState([])

    useEffect(()=> {
        setLoading(true)
        const getUsers = async() =>{
            setTimeout(async()=>{
                try{
                    await axiosIns.get('/user/api/users')
                    .then((response) => {
                        setCurrentUser(response.data.currentUser)
                        setUList(response.data)
    
                        socket.emit('register', response.data.currentUser._id)
                        
                    }).catch((err) => console.log(err))
    
                    await axiosIns.get('/user/api/getNoti')
                    .then(ans=>{
                        setNotification(ans.data)
                    })
                }catch(err){
                    console.log(err)
                }finally{
                    setLoading(false)
                }
            },1100)
        }
        getUsers();
    },[])

    useEffect(()=>{
        socket.on('notification', (noti)=>{
            setNotification((n)=> [...n, noti])
        })
        return ()=>{
            socket.off('notification');
        }
    },[])

    useEffect(()=>{
        socket.on('getstatus', (status)=>{
            setOnline(status)
        })
        return ()=>{
            socket.off('getstatus');
        }
    },[])

    const {username:name } = currentUser

    const logoutFun = async()=>{
        setLoadLogout(true)
        setTimeout(()=>{
            try{
                localStorage.removeItem('token')
                socket.emit('logout')
                return navigate('/login')
            }catch(err) {
                console.log(err)
            }finally{
                setLoadLogout(false)
            }
        },1200)
    }

  return (
    <div className='user-list-con'>
        {loadLogout && <div style={{zIndex:'2', position:'fixed',width:'100%',height:'100%'}}><Loading /></div>}
        {loading && <Loading/>}
        <div className='nav-bar'>
            <h3>Chat</h3>
            <div>
                <span>{name}</span>
                <button onClick={logoutFun}>
                    <FaPowerOff />
                </button>
            </div>
        </div>

        <div className='content'>
            {
                uList.users ? uList.users.map((usersData) => {
                    return (
                        <Link to={`/chat/${currentUser._id}/${usersData._id}`} style={{textDecoration:'none'}} key={usersData._id}>
                            <div className='con-card'>
                                <div className='name-status'>
                                    <span>{usersData.username}</span>
                                    <p className={online.includes(usersData._id)? 'online' : 'offline'}>• {
                                            online.includes(usersData._id)? 'online' : 'offline'
                                    }</p>
                                </div>
                                {
                                    notification.includes(usersData._id)?
                                        <p className='notificatons'>
                                            {
                                                notification.filter(x => x === usersData._id).length
                                            } | new messages
                                        </p>
                                    :null
                                }
                            </div>
                        </Link>
                    )
                }) : null
            }
        </div>

    </div>
  )
}

export default UserList