const express = require('express')
const {mongoose} = require('./config/database')
const { storyRouter } = require('./app/controller/StoryController')
const { usersRouter } = require('./app/controller/UsersController')
const { tagsRouter } = require('./app/controller/TagsController')
const { responseRouter } = require('./app/controller/ResponseController')
const { topicRouter } = require('./app/controller/TopicController')
const port = process.env.PORT || 3025
const multer = require('multer')
const path = require('path')
// const fileUpload = require('express-fileupload')
const app = express()
app.use(express.json())

app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers','Content-Type,x-auth')
    next()
})

app.use('/story',storyRouter)
app.use('/topic',topicRouter)
app.use('/response',responseRouter)
app.use('/tags',tagsRouter)
app.use('/users',usersRouter)

app.use('/public/uploads',express.static('public/uploads'))
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })
app.post('/upload', upload.single('myimage'),function (req, res,next){
  console.log(req.file)
  if(req.file==undefined){
    res.status(401).send({msg:"Attach an Image to Upload."})
  }else{
    res.send({
      msg:"Image Uploaded Successfully!!",
      path:`${req.file.destination}/${req.file.filename}`
    })
  }
})

app.listen(port,function(){
    console.log('listening to port', port)
})