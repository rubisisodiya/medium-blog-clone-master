const mongoose = require('mongoose')
const{ responseSchema } = require('./Response')
const { User }= require('./User')
//create a schema
const Schema = mongoose.Schema

const storySchema = new Schema({
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        isPublished:{
            type: Boolean,
            required: true
        },
        publishedDate:{
            type: Date
        },
        user: {
            type:Schema.Types.ObjectId, ref: 'User'
        },
        previewImageUrl:{
            type:String
        },
        createdAt:{
            type: Date,
            default: Date.now
        },
        topic:{
            type:Schema.Types.ObjectId,
            ref:'Topic'
        },
        tags:[{type:Schema.Types.ObjectId, ref: 'Tags'}],
        response:[responseSchema],
        claps:[
            {
                user:{
                    type:Schema.Types.ObjectId,
                    ref:'User'
                },
                count:{
                    type:Number,
                    max:5
                }
            }
        ]
})
responseSchema.pre('save',function(next){
    const response = this
    response.createdAt = Date.now()
    next()
})
storySchema.pre('save',function(next){
    const story = this
    story.createdAt = Date.now()
    if(story.isPublished){
        story.publishedDate =Date.now()
    }
    next()
})

//create a model based on schema

const Story = mongoose.model('Story',storySchema)
module.exports = {
    Story
}