const mongoose = require('mongoose')

const funcConnectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        .then(()=>{
            console.log('DB connected.')
        })
    }catch(err){
        console.log(err)
    }
}

module.exports =  funcConnectDB;