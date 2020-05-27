const express = require('express');
const router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', async (req, res, next)=>{
  var member;

  axios.get(`http://localhost:4000/members/?memberId=${req.cookies.memberId}`)
  .then(res=>{
    member = res.data;
  })
  .catch(err=>console.log('error'))
  .finally(()=>{
    res.render('index', { 
      title: 'Express', member:member});
  })
});

module.exports = router;
