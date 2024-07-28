const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const connectDB = require('./db/conectDB');
const dotenv = require('dotenv')
dotenv.config()

//socket
const http = require('http')
const socketIo = require('socket.io')


//routes
const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const chatRoutes = require('./routes/chat.route');

const app = express()
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173',process.env.FRONTEND_DOMAIN]
}))
app.use(morgan('dev'))
app.use(bodyParser.json({limit: '10mb'}))

//socket
const server = http.createServer(app)
const io = socketIo(server,{
    cors: {
        credential: true,
        origin: ['http://localhost:5173', process.env.FRONTEND_DOMAIN]
    }
})

const socketUser = new Map()
let status = []
io.on('connection', (socket)=>{
    //console.log('user connected with id =', socket.id)

    socket.on('register', (user_id)=>{
        if(user_id !== null) {
            socketUser.set(user_id, socket.id)
           // console.log('register =', socketUser)
            if(!status.includes(user_id)){
                status.push(user_id)
            }
            io.emit('getstatus', status)
        }
    })

    socket.on('sendMsg', (msg)=>{
        //console.log(msg)
        const receiverId = socketUser.get(msg.userget)
        io.to(receiverId).emit('message', msg)
        io.to(receiverId).emit('notification', msg.usersend)
    })

    socket.on('logout', ()=>{
        //console.log('A user logout')
        for (let [userid, socketid] of socketUser.entries()){
            if (socketid === socket.id){
                status = status.filter(x => x !== userid)
                socketUser.delete(userid)
                io.emit('getstatus', status)
                break;
            }
        }
       // console.log(socketUser)
    })
    socket.on('disconnect', ()=>{
        //console.log('A user disconnectd')
        for (let [userid, socketid] of socketUser.entries()){
            if (socketid === socket.id){
                status = status.filter(x => x !== userid)
                socketUser.delete(userid)
                io.emit('getstatus', status)
                break;
            }
        }
       // console.log(socketUser)
    })
    
})

//api
app.use('/user/api/', userRoutes)
app.use('/auth/api/', authRoutes)
app.use('/chat/api/', chatRoutes)

//robot
app.get('/robot', (req, res)=>{
    try{
        console.log('robot.')
        return res.json('robot.')
    }catch(err){
        console.log(err)
    }
})

server.listen(3000, ()=>{
    connectDB();
    console.log('server is running on port 3000')
})