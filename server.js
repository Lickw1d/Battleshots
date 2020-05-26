const events = require ('events')
const app = require('./app')
const http= require('http').createServer(app)
const io = require('socket.io')(http)

http.listen(4000);

const rooms = [];

io.on('connection', (socket)=>{

   socket.emit('news', {hello: 'world'});
   socket.on('my other event', (data)=>{
       console.log(data);
   })
})