const mongoose = require('mongoose')
//create a schema
const Schema = mongoose.Schema
const tagSchema = new Schema({
        label: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        stories: [{
            type:Schema.Types.ObjectId,
            ref:'Story'
        }]
})
//create a model based on schema
const Tag = mongoose.model('Tag',tagSchema)
module.exports = {
    Tag
}