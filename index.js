const express = require('express')
const app = express()
const port = 5000
const config = require('./config/key')
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://dbUser:abcd1234@boilerplate.ja0oo.mongodb.net/test2?retryWrites=true&w=majority',{
    useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log('MongoDB Connetected...'))
  .catch(err => console.log(err))
const {User} = require("./models/User");

const bodyParser = require("body-parser");
  
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('Hello World!11111111')
})

app.post("/register",(req,res)=>{
  //회원가입 할 때 필요한 정보들을 클라이언트로 부터 가져오면
  //그것들을 데이터베이스에 넣어준다
  const user = new User(req.body)
  
  user.save((err,userInfo)=>{
    if(err)  return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

