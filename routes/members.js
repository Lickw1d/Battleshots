const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {v4: uuidv4} = require('uuid');
const axios = require('axios');
const members = [];


router.get('/', (req,res,next)=>{
    console.log(`member id searched for:${req.query.memberId}`)
    if(req.query.memberId){
        var member = _.find(members,{id:req.query.memberId})
        if(member){
            res.send(member)
        }
        else{
            res.send({});
        }
    }
    else{
        res.send(members);
    }
});

router.get('/create', async (req, res, next)=>{

    var name = req.query.name;
    if(!name || name.length === 0){
        res.status(400);
        res.send('No name provided');
    }

    if(_.find(members,{name:name}))
    {
        res.status(409);
        res.send('Name already taken')
    }
    else{
        var member = await createMember(name);
        res.cookie('memberId',member.id);
        res.redirect(301,'back');
    }
});

router.get('/logout', async (req,res,next)=>{
    res.cookie('memberId')
    console.log(res.cookie.memberId)
    res.redirect(301,'/');
  })

router.post('/update', async (req,res,next)=>{
    if(req.body.id){
        var memberIndex = _.findIndex(members, {id:req.body.id});

        if(memberIndex === -1){
            console.log('member not found');
            res.status(404,'Member Not Found');
            return;
        }
        
        console.log('member found');
        members[memberIndex] = req.body;
        return res.status(200).send();
    }
    
})


//functions
const createMember = async (name)=>{
   var defaultRoom; 
   var newMember  =
   {
    id: uuidv4(),
    name: name,
    currentRoom: null
    }

    members.push(newMember);

   var defaultRoom = (await axios.get('http://localhost:4000/rooms/defaultRoom')).data;

   await axios.get(`http://localhost:4000/rooms/addToRoom/${defaultRoom.id}/${newMember.id}`);
   return newMember
}
module.exports = router;