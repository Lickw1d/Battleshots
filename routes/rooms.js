const express = require('express');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const axios = require('axios');
const _ = require('lodash');
const defaultRoom = createRoom('Default',null);
const rooms = [defaultRoom];
const roomMax = 5;
/* GET home page. */
router.get('/create', async (req, res, next)=>{

    if (!req.cookies.memberId || req.cookies.memberId == 'undefined'){
        res.redirect(301, 'back');
        return;
    } 
        var room = createRoom(req.query.name, req.cookies.memberId);
        rooms.push(room);
        res.status(201);
        res.redirect('back');
});

router.get('/', async (req,res,next)=>{

    res.send(rooms);
});

router.get('/defaultRoom', async (req,res,next)=>{
    res.send(defaultRoom)
});

router.get('/addToRoom/:roomId', async(req,res,next)=>{
    var memberId = req.cookies.memberId;   
    await moveRoom(memberId,req,res);
})
router.get('/addToRoom/:roomId/:memberId', async(req,res,next)=>{
    var memberId = req.params.memberId;   
    await moveRoom(memberId,req,res);
});

async function moveRoom(memberId, req,res){
    if(!memberId || memberId === 'undefined')
    {
        res.status(403).send('Member must be provided');
        return; 
    }
    var member = (await axios.get(`http://localhost:4000/members/?memberId=${memberId}`)).data;

    if(!member.id){
        res.status(400);
        return;
    }


        var currentRoom = _.find(rooms,{'id':member.currentRoom});
        var targetRoom = _.find(rooms, {'id':req.params.roomId});

        if(!targetRoom)
        {
            res.status('400').send('Target Room Not Found');
            return;
        }

        if(targetRoom != defaultRoom && targetRoom.members.length >= roomMax)
        {
           res.status('400').send(`Room full. Capacity: ${roomMax}`);
           return;
        }

        if(currentRoom){
            console.log('current room before');
            console.log(currentRoom.members);

            currentRoom.members.splice(currentRoom.members.indexOf(member.id),1);
            member.currentRoom = null;
            console.log(`removed member ${member.id} from room ${currentRoom.name}`);

            console.log('current room after');
            console.log(currentRoom.members);
        }

        targetRoom.members.push(member.id);
        member.currentRoom = targetRoom.id;
        console.log(`added member ${member.id} to room ${member.currentRoom}`)
        await axios.post('http://localhost:4000/members/update', member)
        res.status(200).send(targetRoom);
}

function createRoom(name, owner){
    return {
        id: uuidv4(),
        owner: owner,
        name: name,
        members: []
    }
}

module.exports = router;
