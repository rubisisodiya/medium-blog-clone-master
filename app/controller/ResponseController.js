const express = require('express')
const router = express.Router()
const { authenticateUser } = require('../middlewares/authentication')
const { Response } = require('../model/Response')
const { Story } = require('../model/Story')
router.get('/:id',function(req,res){
    const id = req.params.id
    console.log(id)
    Story.findById(id)
        .then(function(story){
            res.send(story.response)
        })
        .catch(function(err){
            res.send(err)
        })
})
router.post('/:id', authenticateUser, function(req,res){
    const id=req.params.id
    const { user } =req
    const body=req.body
    const response = new Response(body)
    response.user = user._id
    Story.findById(id)
        .then(function(story){
            story.response.push(response)
            story.save()
                .then(function(story){
                    res.send(story)
                })
                .catch(function(err){
                    res.send(err)
                })
        })
        .catch(function(err){
            console.log('inside error')
            res.send(err)
        })    
})
module.exports = {
    responseRouter: router
}