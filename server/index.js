const express = require('express')
const app = express()
const port = 5000
const multer = require('multer')
const path = require('path')
const {auth} = require('./middleware/auth')
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://dbUser:abcd1234@boilerplate.ja0oo.mongodb.net/test2?retryWrites=true&w=majority',{
    useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log('MongoDB Connetected...'))
  .catch(err => console.log(err))
const {User} = require("./models/User")

const bodyParser = require("body-parser")
  
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())

//==============================
//      유저관련
//==============================

app.post("/api/users/register",(req,res)=>{
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

app.post('/api/users/login',(req,res)=>{
  //요청된 이메일을 db 존재 유무 확인
  User.findOne({email:req.body.email},(err,user)=>{
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "이메일에 일치하는 유저 정보가 없습니다."
      })
    }
    //존재한다면 비밀번호 확인
    user.comparePassword(req.body.password, (err,isMatch)=>{
      if(!isMatch)
        return res.json({loginSuccess:false,message:"비밀번호가 틀렸습니다."})
      
        //비밀번호 일치 시 토큰생성
        user.generateToken((err,user)=>{
          if(err) return res.status(400).send(err)
          res.cookie('x_auth',user.token)
            .status(200)
            .json({loginSuccess: true, userId: user._id})
        })
    })
  })
})
app.get('/api/users/auth',auth,(req,res)=>{
  //이후는 auth미들웨어를 통과하였기 때문에 토큰일치한다는 것
  //정보전달
  res.status(200).json({
    _id: req.user._id,
    //role -> 0 일반유저 0아니면 관리자
    isAdmin: req.user.role === 0 ? false: true,
    isAuth:true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout',auth,(req,res)=>{
  User.findOneAndUpdate({_id:req.user._id},{token:""},(err,user)=>{
    if(err) return res.json({success:false,err })
    return res.status(200).json({
      success: true
    })
  })
})

//==============================
//      파일관련
//==============================
//const {Video} = require("./models/Video")


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`)
  }
})
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname)
  if (ext !== '.png') {
      return cb(new Error('Only images are allowed'));
  }
  cb(null, true)
}
const upload = multer({storage: storage,fileFilter: fileFilter}).single('file')


app.post('/api/video/uploadfiles',(req,res)=>{
  // 파일저장
  
  upload(req, res, err => {
    if (err) {
        return res.json({ success: false, err })
    }
    return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
  })
})

if(process.env.NODE_ENV ==="production"){
  app.use(express.static("client/build"))
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../client","build","index.html"))
  })  
}




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

