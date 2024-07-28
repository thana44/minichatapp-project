import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Loading from './Loading'

function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)
    const [getres, setGetres] = useState('')

    const navigate = useNavigate()

    const registerFun = async(e) => {
        e.preventDefault();
        setLoading(true)
        setTimeout(async()=>{
            try{
                await axios.post(`${import.meta.env.VITE_BACKEND_HOST}/auth/api/register`, {username, email, password})
                .then((response) => {
                    if(response.data.err){
                        return setGetres(response.data.err)
                    }
                    console.log(response.data)
                    return navigate('/login')
                }).catch(err => console.log(err))
            }catch(err) {
                console.log(err)
            }finally {
                setLoading(false)
            }
        },1500)
    }

  return (
    <div className='login-con'>
    <form style={{position:"relative"}} className='form-con' onSubmit={registerFun}>
        {
            loading && <Loading/>
        }
        <h2>Register</h2>
        <div>
            <label>Username</label>
            <input onChange={(e)=> setUsername(e.target.value)} placeholder='Enter your username.'/>
        </div>
        <div>
            <label>Email</label>
            <input onChange={(e)=> setEmail(e.target.value)} placeholder='Enter your email.'/>
        </div>
        <div>
            <label>Password</label>
            <input onChange={(e)=> setPassword(e.target.value)} type='password' placeholder='Enter your password.'/>
        </div>
            {
                getres? <div style={{color:'red'}}>{getres}</div> : <div style={{color:'transparent'}}>status</div>
            }
        <button>Sign Up</button>
        <Link to='/login'>
            Already have an account.
        </Link>
    </form>
</div>
  )
}

export default Register