const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema
//for custom validation 
const userSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    username: {
        type: String,
        required:true,
        unique: true,
        minlength:5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        //how to check the format of the email
        validate: {
            validator: function(value){
                return validator.isEmail(value)
            },
            message: function(){
                return 'invalid email format'
            }
        }

    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128
    },
    stories:[{ type:Schema.Types.ObjectId, ref:'Story' }],
    bookmarks:[{ type:Schema.Types.ObjectId, ref: 'Story'}],
    followers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    following: [{type:Schema.Types.ObjectId, ref: 'User'}],
    clappedStories: [{type:Schema.Types.ObjectId, ref: 'Story'}],
    tokens: [
        {
            token: {
                type:String
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
})
//mongoose middleware
//pre hooks are used before model genration
userSchema.pre('validate',function(next){
    const user = this//refers to user object of save method
    if(user.isNew){
        bcryptjs.genSalt(10)
            .then(function(salt){
                bcryptjs.hash(user.password,salt)
                    .then(function(encryptedPassword){
                        user.password = encryptedPassword
                        console.log("encryption done",user)
                        next()
                    })
            })
    }else{
        next()
    }
})
//own instance method
userSchema.methods.generateToken = function(){
    const user = this
    const tokenData = {
        _id: user._id,
        username: user.username,
        createdAt: Number(new Date())
    }
    const token = jwt.sign(tokenData,'jwt@123')
    user.tokens.push({
        token 
    })
    return user.save()
        .then(function(user){
            return Promise.resolve(token)
        })
        .catch(function(err){
            return Promise.reject(err)
        })
}
//own static method
userSchema.statics.findByCredentials = function(email,password){
    const User = this
    return User.findOne({email})
                .then(function(user){
                    if(!user){
                        return Promise.reject({notice:"Invalid Email / Password"})
                    }
                    return bcryptjs.compare(password, user.password)
                        .then(function(result){
                            if(result){
                                return Promise.resolve(user)
                            }else{
                                return Promise.reject({notice:"Invalid Email / Password"})
                            }
                        })
                })
                .catch(function(err){
                    return Promise.reject(err)
                })
}
userSchema.statics.findByCredentialsAndCompare = function(id,oldPassword,newPassword){
    const User = this
    return User.findById(id)
                .then(function(user){
                    console.log(oldPassword,user.password)
                    return bcryptjs.compare(oldPassword, user.password)
                        .then(function(result){
                            if(result){
                                user.isNew=true
                                User.findByIdAndUpdate(user._id,{$set:{password:newPassword}},{new: true, runValidators:true})
                                    .then(function(user){
                                        console.log(user)
                                        res.send(user)
                                    })
                                    .catch(function(err){
                                        res.send({err:"password update err"}) 
                                    })
                                    return Promise.resolve(user)
                            }
                            else{
                                return Promise.reject({err:"password doesnot match"})
                            }
                        })
                        .catch(function(err){
                            return Promise.resolve(err)
                        })
                    })
                .catch(function(err){
                    return Promise.reject({err:"user not found"})
                })
}
userSchema.statics.findByToken = function(token){
    console.log(token)
    const User = this
    let tokenData
    try{
        tokenData = jwt.verify(token,'jwt@123')
    }catch(err){
        return Promise.reject(err)
    }

    return User.findOne({
        _id: tokenData._id,
        'tokens.token':token
    }).populate({
        path: 'following',
        model:User
      })
      .populate({
        path: 'followers',
        model:User
      })
    .exec()
}
const User = mongoose.model('User',userSchema)
module.exports ={
    User
}