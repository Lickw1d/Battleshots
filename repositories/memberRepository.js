const {v4: uuidv4} = require('uuid');
const _ = require('lodash');
const memberRepository = {};
const members = [];

memberRepository.get = (findCriteria) => _.find(members, findCriteria);

memberRepository.getById = (id)=>_.find(members, {id:id});

memberRepository.getAll = ()=>members;

memberRepository.create = (name)=>{
    var member ={
     id: uuidv4(),
     name: name,
     }
     members.push(member);

    return member;
 }

 memberRepository.update = (member)=>
 {
    if(member.id){

        var memberIndex = _.findIndex(members, member.id);
        if(memberIndex === -1)
            return false;
        
        members[memberIndex] = member;
        return true        
    }

 return false
 }
module.exports = memberRepository