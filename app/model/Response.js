const mongoose = require('mongoose')
//create a schema
const Schema = mongoose.Schema
const responseSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    user: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    createdAt:{
        type: Date
    }
})
const Response = mongoose.model('Response',responseSchema)
module.exports = {
    responseSchema,
    Response
}