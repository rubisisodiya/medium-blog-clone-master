const express = require('express')
const router = express.Router()
const { Tag } = require('../model/Tags')

router.post('/',function(req,res){
    const body = req.body
    const tag = new Tag(body)
    tag.save()
        .then (function(tag){
            res.send(tag)
        })
        .catch (function(err){
            res.send(err)
        })
})
router.get('/:id',(req,res)=>{
    const id=req.params.id
    Tag.findById(id)
        .then(data=>{
            res.send(data)
        })
        .catch(err=>{
            res.send(err)
        })
})
router.get('/:tagId/:storyId',function(req,res){
    const { tagId, storyId} =req.params
    console.log(req.params)
    Tag.findById(tagId)
        .then(tag=>{
            tag.stories.push(storyId)
            tag.save()
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
router.get ('/',function(req,res){
    Tag.find()
        .then(tag=>{
            res.send(tag)
        })
        .catch(erer=>{
            res.send(err)
        })
})
module.exports = {
    tagsRouter: router
}