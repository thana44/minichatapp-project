import React from 'react'
import { useNavigate } from 'react-router-dom'

function Notfoundpage() {
    const navigate = useNavigate()

    const backFun = ()=>{
        try{
            return navigate('/',{replace:true})
        }catch(err){
            console.log(err)
        }
    }
    
  return (
    <div style={{height:'100dvh', display:'flex',justifyContent:'center', alignItems:'center'}}>
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center',gap:'14px'}}>
            <h2 style={{color:'white'}}>404 | NotFound</h2>
            <button onClick={backFun} style={{padding:'10px',backgroundColor:'yellowgreen',border:'none',borderRadius:'8px',boxShadow:'rgba(137, 184, 9, 0.5) 0px 4px 12px'}}>Back to home</button>
        </div>
    </div>
  )
}

export default Notfoundpage