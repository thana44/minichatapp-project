import React from 'react'
import 'ldrs/tailChase';
import loader from '../loading/gifLoader.gif'

function Loading() {
  return (
    <div className='loading'>
        <img style={{width:'130px'}} src={loader}></img>
    </div>
  )
}

export default Loading