const express = require('express')
// const bcryptjs = require('bcryptjs')
const router = express.Router()
const { User } = require('../model/User')
const {authenticateUser} = require('../middlewares/authentication')
router.get('/all',function(req,res){
    User.find()
        .then (function(users){
            res.send(users)
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3000/users/register
router.post('/register',function(req,res){
    const body = req.body
    const user = new User(body)
    console.log("before save",user.isNew)
    user.save()
        .then (function(user){
            res.send(user)
            console.log("after save",user.isNew)
        })
        .catch (function(err){
            res.send(err)
        })
})
//localhost:3000/users/login
router.post('/login',function(req,res){
    const body = req.body

    User.findByCredentials(body.email, body.password)
        .then(function(user){
            return user.generateToken()
        })
        .then (function(token){
            res.send(token)
        })
        .catch(function(err){
            res.status(404).send(err)
        })
})
//localhost:3000/users/account
router.get('/account',authenticateUser ,function(req,res){
    const { user } = req
    res.send(user)
})
router.get('/follow/:id', authenticateUser ,function(req,res){
    const {user} =req
    const id=req.params.id
    user.following.push(id)
    console.log("user follow",user.following)
    user.save()
        .then((user)=>{
            res.send(user.following)
        })
        .catch((err)=>{
            res.send(err)
        })
    User.findByIdAndUpdate(id,{$push:{followers:user._id}})
        .then(function(storyUser){
                console.log("after save")
                res.send(storyUser.followers)
            })
            .catch((err)=>{
                res.send(err)
            })
})
router.get('/clapped/:id',authenticateUser, function(req,res){
    const { user } = req
    const id=req.params.id
    user.clappedStories.push(id)
    user.save()
        .then((user)=>{
            res.send(user.clappedStories)
        })
        .catch((err)=>{
            res.send(err)
        })
})
router.delete('/unfollow/:id', authenticateUser ,function(req,res){
    const { user } =req
    const id=req.params.id
    User.findByIdAndUpdate(user._id,{$pull:{following:id}})
        .then((user)=>{
            console.log("following delete")
            res.send(user.following)
        })
        .catch((err)=>{
            res.send(err)
        })
    User.findByIdAndUpdate(id,{$pull:{followers:user._id}})
            .then((user)=>{
                console.log("follower delete")
                res.send(user.followers)
            })
            .catch((err)=>{
                res.send(err)
            })
})
router.get('/bookmark/:id',authenticateUser, function(req,res){
    const storyId = req.params.id
    const { user } = req
    const bookmarks = user.bookmarks
        user.bookmarks.push(storyId)
    user.save()
        .then((user)=>{
            console.log(user.bookmarks)
            res.send(user.bookmarks)
        })
        .catch((err)=>{
            res.send(err)
        })
})
//localhost:3000/users/account/reset
router.put('/account/reset',authenticateUser,function(req,res){
    const {user} =req
    const body= req.body
    console.log(user._id,body.oldPassword,body.newPassword)
    User.findByCredentialsAndCompare (user._id,body.oldPassword,body.newPassword)
        .then(function(user){
            if(user){
                res.send(user)
            }
            // res.send({notice: 'successfully reset your Pasword'})
        })
        .catch(function(err){
            res.send(err)
        })
})
//localhost:3000/users/logout
router.delete('/logout', authenticateUser,function(req,res){
    const {user,token} =req
    User.findByIdAndUpdate(user._id,{$pull:{tokens:{token:token}}})
        .then(function(){
            res.send({notice: 'successfully logged out'})
        })
        .catch(function(err){
            res.send(err)
        })
})
module.exports = {
    usersRouter: router
}