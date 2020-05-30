const express = require('express');
const router = express.Router();
const _ = require('lodash');
const memberRepository = require('./../repositories/memberRepository');
const roomRepository = require('./../repositories/roomRepository');

var defaultRoom = roomRepository.create('default',null);

/* GET home page. */
router.get('/create', async (req, res, next)=>{

    if (!req.cookies.memberId || req.cookies.memberId == 'undefined'){
        res.redirect(301, 'back');
        return;
    } 
        roomRepository.create(req.query.name, memberRepository.getById(req.cookies.memberId))

        res.status(201);
        res.redirect('back');
});
router.get('/', async (req,res,next)=>{
  var rooms = roomRepository.getAll();
  res.status(200).send(rooms);
});

router.get('/:roomId', async (req,res,next)=>{

    if(!roomId){
        res.status(200).send(roomRepository.getAll());
        return;
    }

    res.send(roomRepository.getById(roomId))
    
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


module.exports = router;
