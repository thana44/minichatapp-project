import axios from 'axios';
import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import Loading from './Loading';

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const [getres, setGetres] = useState('')

    const navigate = useNavigate()

    const LoginFun = async(e) => {
        e.preventDefault();
        setLoading(true)
        setTimeout(async()=>{
            try{
                await axios.post(`${import.meta.env.VITE_BACKEND_HOST}/auth/api/login`, {email, password})
                .then((response) => {
                    if(response.data.err){
                        return setGetres(response.data.err)
                    }
                    if(response.data.token) {
                        localStorage.setItem('token', response.data.token)
                        return navigate('/')
                    }
                }).catch((err) => console.log(err))
            }catch(err) {
                console.log(err)
            }finally{
                setLoading(false)
            }
        },1500)
    }
    
  return (
    <div className='login-con'>
        <form style={{position:'relative'}} className='form-con' onSubmit={LoginFun}>
            {
                loading && <Loading/>
            }
            <h2>Login</h2>
            <div>
                <label>Email</label>
                <input onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email.'/>
            </div>
            <div>
                <label>Password</label>
                <input onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Enter your password.'/>
            </div>
            {
                getres? <div style={{color:'red'}}>{getres}</div> : <div style={{color:'transparent'}}>status</div>
            }
            <button>Sign In</button>
            <Link to='/register'>
                Don't have an account.
            </Link>
        </form>
    </div>
  )
}

export default Login