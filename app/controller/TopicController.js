const express = require('express')
const router = express.Router()
const { Topic } = require('../model/Topic')
router.get('/',function(req,res){
    Topic.find()
    .then(function(category){
        res.send(category)
    })
    .catch(function(err){
        res.send(err)
    })
})
router.get('/:id',function(req,res){
    const id = req.params.id
    Topic.findById(id)
    .then(function(category){
        res.send(category)
    })
    .catch(function(err){
        res.send(err)
    })
})
router.post('/',function(req,res){
    const body=req.body
    const topic = new Topic(body)
    topic.save()
        .then(function(category){
            res.send(category)
        })
        .catch(function(err){
            res.send(err)
        })
})
module.exports = {
    topicRouter: router
}