const {v4: uuidv4} = require('uuid');
const roomRepository = {};
const rooms = [];
const memberRoomMap = {};
const defaultRoomMax = 5;

roomRepository.create = (roomName, member)=>{
    
    var room = {
        id: uuidv4(),
        owner: member,
        name: roomName,
        members: [],
        roomMax: defaultRoomMax
    }

    rooms.push(room);
    
    return room;
};

roomRepository.get = (filterCriteria)=>_.find(rooms,filterCriteria);

roomRepository.getById = (id)=>_.find(rooms,{id:id});

roomRepository.getAll = ()=> rooms;

roomRepository.updateName = (id,newName)=>{

    if(rooms[id]){
        rooms[id].name=newName;
        return true;
    }

    return false;
};

roomRepository.addMemberToRoom = (roomId,member)=>{

    if(rooms[roomId] && rooms[roomId].members.length<rooms[roomId].roomMax){

        rooms[roomId].members.push(member);
        memberRoomMap[member.id]=rooms[roomId];
        return memberRoomMap[member];
    }

    return false
};

roomRepository.getMemberRoom = (memberId)=>{
    return memberRoomMap[memberId]
};

roomRepository.removeMemberFromRoom = (memberId)=>{
    if(memberRoomMap[memberId]){
        memberRoomMap[memberId].members = memberRoomMap[memberId].members.filter(member=> member.id !=memberId);
        memberRoomMap[memberId] = null;
        return true;
    }

    return false
};

module.exports = roomRepository