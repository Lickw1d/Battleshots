const express = require('express');
const router = express.Router();
const axios = require('axios');
const memberRepository = require('./../repositories/memberRepository');
/* GET home page. */
router.get('/', async (req, res, next)=>{

  let member = req.cookies.memberId?
      memberRepository.getById(req.cookies.memberId)
      :
      null;


  res.render('index', {
    title: 'Express', member:member});
});

module.exports = router;
