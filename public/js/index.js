const socket = io.connect('http://localhost:5858');
const roomMessages = [];


$(function(){
    refreshRoomsTable($('#roomTable'));
})

var memberData=null;
var roomConnection=null;

addBindings();
getCurrentMemberData()
.then(_=>switchSocketListener(roomConnection))

function refreshRoomsTable(roomTable){

    axios.get('/rooms/').then(res=>{
        res.data.forEach((value,index)=>{
          value["action"] = "<button data-roomid='"+value.id+"' onclick='joinRoom(this)'>Join Room</button>";
        });

        //if table isn't bound, bind. if table is bound, load. 
        if(!Array.isArray(roomTable.bootstrapTable('getData'))){
          roomTable.bootstrapTable({
          data: res.data
          });
        }
        else{
          roomTable.bootstrapTable('load', res.data);
        }
     
    });
}

function addBindings(){

    bindr.addBinding('chatRoomName', val=>{document.getElementById('chatRoomName').innerHTML=val}); 
    bindr.addBinding('roomMessages',bind_newMessages);
}

function getCurrentMemberData()
{
  return axios.get('members/getCurrentMember').then(res=>{
      memberData = res.data;
  });
}

function joinRoom(sender){
  axios.get(`rooms/addToRoom/${sender.dataset.roomid}`)
  .then(res=>{

    roomId = res.data.id;
    bindr.chatRoomName.bind(res.data.name);

    refreshRoomsTable($('#roomTable'));

    getCurrentMemberData()
    .then(_=>switchSocketListener(memberData.currentRoom))
    })
  .catch(e=>{console.log(e)});
}

function sendMessage(){
  var message = document.getElementById('messageEntryBox').value;
  socket.emit('newMessage', {member:memberData, message:message});
  document.getElementById('messageEntryBox').value = '';
}

function switchSocketListener(newRoomId){
  socket.off(roomConnection);
  roomConnection = newRoomId;

  socket.on(roomConnection, (data)=>{
    roomMessages.push(data);
    bindr.roomMessages.bind(roomMessages);
  })
  
}

function bind_newMessages(val){
    document.getElementById('messages').innerHTML = 
    document.getElementById('messages').innerHTML + '<p>'+val[val.length-1]+'</p>'
}