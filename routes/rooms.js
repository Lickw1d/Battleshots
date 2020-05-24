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

router.get('/addToRoom/:memberId/:roomId', async(req,res,next)=>{
    
    var memberId = req.params.memberId || req.cookies.memberId;
    if(!memberId || memberId === 'undefined')
    {
        res.status(403).send('Member must be provided');
        return 
    }
    var member = (await axios.get(`http://localhost:4000/members/?memberId=${memberId}`)).data;

    if(!member.id){
        res.status('404').send('member not found');
        return;
    }


        var currentRoom = _.find(rooms,{'id':member.currentRoom});
        var targetRoom = _.find(rooms, {'id':req.params.roomId});

        if(!targetRoom)
        {
            res.status('404').send('Target Room Not Found');
            return;
        }

        if(targetRoom != defaultRoom && targetRoom.members.length >= roomMax)
        {
           res.status('403').send(`Room full. Capacity: ${roomMax}`);
           return;
        }

        if(currentRoom){
            _.remove(currentRoom.members, memberId=>{memberId === member.id});
            member.currentRoom = null;
            console.log(`removed member ${member.id} from room ${room}`);
        }

        targetRoom.members.push(member.id);
        member.currentRoom = targetRoom.id;
        await axios.post('http://localhost:4000/members/update', member)
        res.status(200).send(targetRoom);
});


function createRoom(name, owner){
    return {
        id: uuidv4(),
        owner: owner,
        name: name,
        members: []
    }
}

module.exports = router;
