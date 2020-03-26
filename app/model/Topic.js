const mongoose = require('mongoose')
//create a schema
const Schema = mongoose.Schema
const topicSchema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true
        }
})
// topicSchema.pre('save',function(next){
//     const topic = this//refers to user object of save method
//     console.log(topic)
//     topic.find(topic.name)
//         .then(res=>console.log(res.data))
//         .catch(err=>console.log(err))
// })
//create a model based on schema
const Topic = mongoose.model('Topic',topicSchema)
module.exports = {
    Topic
}