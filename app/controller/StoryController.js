const express = require('express')
const router = express.Router()
const { authenticateUser } = require('../middlewares/authentication')
const { Story } = require('../model/Story')
const { Tag } = require('../model/Tags')
router.post('/', authenticateUser, function(req,res){
    const body = req.body
    const story = new Story(body)
    story.user = req.user._id
    story.save()
        .then(function(story){
            res.send(story)
        })
        .catch(function(err){
            res.send(err)
        })
})
router.get('/topic/:id',function(req,res){
    const id  = req.params.id
    Story.find({topic:id})
        .then(function(story){
            if(story){
                res.send(story)
            }else{
                res.status(404).send({msg:"No Stories found"})
            }
        })
        .catch(function(err){
            res.send(err)
        })
})
router.get('/:id',function(req,res){
    const id  = req.params.id
    Story.findOne({_id:id})
            .populate({
                path: 'tags',
                model:Tag
              })
            .populate('user')
            .exec()
        .then(function(story){
            if(story){
                res.send(story)
            }else{
                res.send([])
            }
        })
        .catch(function(err){
            res.send(err)
        })
})
router.get('/:storyId/:tagId',function(req,res){
    const { tagId, storyId} =req.params
    console.log(req.params)
    Story.findById(storyId)
        .then(story=>{
            story.tags.push(tagId)
            story.save()
                .then(newData=>{
                    res.send(newData)
                })
                .catch(err=>{
                    res.send(err)
                })
        })
        .catch(err=>{
            res.send(err)
        })
})
router.get('/', function(req,res){
    Story.find()
        .then (function(story){
            res.send(story)
        })
        .catch(function(err){
            res.send(err)
        })
})
module.exports = {
    storyRouter: router
}