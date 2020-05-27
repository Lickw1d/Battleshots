const events = require ('events')
const app = require('./app')
const http= require('http').createServer(app)
const io = require('socket.io')(http)

http.listen(4000);

const rooms = [];

io.on('connection', (socket)=>{

   socket.on('newMessage', data=>{
       console.log('new Message Received');
       console.log(data);
       io.emit(data.member.currentRoom, `${data.member.name}: `+data.message);
   })
})
