const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {v4: uuidv4} = require('uuid');
const axios = require('axios');

const memberRepository = require('./../repositories/memberRepository')


router.get('/', (req,res,next)=>{
    console.log(`member id searched for:${req.query.memberId}`)
    if(req.query.memberId){
        var member = memberRepository.get(req.query.memberId)
        if(member){
            res.send(member)
        }
        else{
            res.send({});
        }
    }
    else{
        res.send(memberRepository.getAll());
    }
});

router.get('/create', async (req, res, next)=>{

    var name = req.query.name;
    if(!name || name.length === 0){
        res.status(400);
        res.send('No name provided');
    }

    if(memberRepository.get({name:name}))
    {
        res.status(409);
        res.send('Name already taken')
    }
    else{
        var member = await memberRepository.create(name);
        res.cookie('memberId',member.id);
        res.redirect(301,'back');
    }
});

router.get('/getCurrentMember', (req,res,next)=>{
    console.log(req.cookies);
    if(req.cookies.memberId){
        res.status(200).send(memberRepository.getById({id : req.cookies.memberId}));
        return;
    }

    res.status(200).send(null);
})

router.get('/logout', async (req,res,next)=>{
    res.cookie('memberId')
    res.redirect(301,'/');
  })

router.post('/update', async (req,res,next)=>{
    if(memberRepository.update(request.body)){
        return res.status(200).send();
    }
    res.status(400).send();
    
})

module.exports = router;