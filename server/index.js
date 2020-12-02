const express = require('express')
const app = express()
const https = require('https')
const fs = require('fs')
const {PORT} = process.env.PORT || require('./config/MyPort')
const {IP} = require('./config/MyIP')
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
//=====================================================================================
const multer = require('multer')
const ffmpeg =require("fluent-ffmpeg")
const {Video} = require("./models/Video")
const {Photo} = require("./models/Photo")
const {Group} = require("./models/Group")
const {Subscriber} = require("./models/Subscriber")
const {Comment} = require("./models/Comment")
const {Like} = require('./models/Like')
const {DisLike} = require('./models/Dislike')
//==================================
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())




//==============================================================
//      유저관련
//==============================================================

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

//================================================================
//      사진 비디오 관련
//================================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './uploads')
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const storage_photo = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './uploads/photos')
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname)
  if (ext !== '.mp4') {
      return cb(new Error('Only Videos are allowed'));
  }
  else{
  cb(null, true)
  }
}

const fileFilter_photo = (req, file, cb) => {
  const ext = path.extname(file.originalname)
  if (ext !== '.png' && ext !=='.PNG' && ext !=='.jpg' && ext !=='.JPG') {
      return cb(new Error('Only Photos are allowed'));
  }
  else{
  cb(null, true)
  }
}

const upload = multer({storage: storage,fileFilter: fileFilter}).single('file')
const upload_photo = multer({storage: storage_photo,fileFilter: fileFilter_photo}).single('file')

app.post('/api/video/uploadfiles',(req,res)=>{
  // 영상 파일 저장
  
  upload(req, res, err => {
    if (err) {
        return res.json({ success: false, err })
    }
    return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
  })
})

app.post('/api/video/uploadfiles/photo',(req,res)=>{
  // 이미지 파일 저장
  upload_photo(req, res, err => {
    if (err) {
        return res.json({ success: false, err })
    }
    return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
  })
})

app.post('/api/video/thumbnail',(req,res)=>{
  
  //비디오 정보 가져오기
  let filePath ="";
  let fileDuration ="";

  ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);

    fileDuration = metadata.format.duration;
  })
  
  
  
  //썸네일 생성
  ffmpeg(req.body.filePath)
    .on('filenames', function (filenames) {
      console.log('Will generate ' + filenames.join(', '))
      filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end', function () { //====================성공 시
      console.log('Screenshots taken');
      return res.json({ success: true, url: filePath, fileDuration: fileDuration })
    })
    .on('error', function(err){//===================실패 시
      console.error(err)
      return res.json({success: false, err})
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 3,
      folder: 'uploads/thumbnails',
      size: '320x240',
      // %b 확장자 뺀 순수 파일 이름
      filename: 'thumbnail-%b.png'
    });
})

app.post('/api/video/uploadVideo',(req,res)=>{
  //업로드 비디오에 관한 메타데이터 DB에 저장
  console.log("==================")
  console.log(req.body)
  const video = new Video(req.body)
  video.save((err,doc)=>{
    if(err) return res.json({success:false, err})
    res.status(200).json({success:true})
  })
})

app.post('/api/photo/uploadPhoto',(req,res)=>{
  //업로드 이미지에 관한 메타데이터 DB에 저장
  const photo = new Photo(req.body)
  photo.save((err,doc)=>{
    if(err) return res.json({success:false, err})
    res.status(200).json({success:true})
  })
})

app.post('/api/photo/editPhoto',(req,res)=>{
  Photo.updateOne({_id:req.body.editphotoId},req.body)
    .exec((err,photo)=>{
      if(err) return res.status(400).send(err)
      else{
        res.status(200).json({success:true,photo})
      }
    })
})

app.post('/api/video/editVideo',(req,res)=>{
  Video.updateOne({_id:req.body.editvideoId},req.body)
    .exec((err,video)=>{
      if(err) return res.status(400).send(err)
      else{
        res.status(200).json({success:true,video})
      }
    })
})

app.get('/api/video/getVideos',(req,res)=>{
  //비디오 DB에서 가져오기 및 전송
  Video.find()
    .populate('writer') // writer에 저장된 id를 참조해서 가져옴
    .exec((err,videos)=>{
      if(err) return res.status(400).send(err)
      else{
        res.status(200).json({success:true,videos})
      }
    })
})

app.get('/api/photo/getPhotos',(req,res)=>{
  //사진 DB에서 가져오기 및 전송
  Photo.find()
    .populate('writer') // writer에 저장된 id를 참조해서 가져옴
    .exec((err,photos)=>{
      if(err) return res.status(400).send(err)
      else{
        res.status(200).json({success:true,photos})
      }
    })
})

app.post('/api/video/getVideoDetail',(req,res)=>{
  Video.findOne({"_id":req.body.videoId})
    .populate("writer")
    .exec((err,videoDetail)=>{
      if(err) return res.status(400).send(err)
      return res.status(200).json({success: true, videoDetail})
    })
})

app.post('/api/photo/getPhotoDetail',(req,res)=>{
  Photo.findOne({"_id":req.body.photoId})
    .populate("writer")
    .exec((err,photoDetail)=>{
      if(err) return res.status(400).send(err)
      return res.status(200).json({success: true, photoDetail})
    })
})

app.get('/api/getGroupList',(req,res)=>{
  Group.find({},{_id: false,member: false},(err,groupLists)=>{
    if(err) return res.status(400).send(err)
    else{
      let g_list = []
      groupLists.forEach(group => {
        g_list.push(group.groupName)
      });

      res.status(200).json({success:true,g_list})
    }
  })
})

app.post('/api/memberList',(req,res)=>{
  Group.findOne({groupName:req.body.group},{_id: false,groupName: false},(err,memberLists)=>{
    if(err) {
      return res.status(400).send(err)
    }
    else{
      let m_list = memberLists.member
      
      res.status(200).json({success:true, m_list})
    }
  })
})

app.post('/api/photos/getPhotoURLs',(req,res)=>{
  Photo.find({group:req.body.group, name:req.body.memberName},{_id:false, filePath:true, likes:true})
    .sort({likes:"desc"})
    .limit(3)
    .exec((err,memberURLs)=>{
      if(err) {
        return res.status(400).send(err)
      }
      else{
        let m_urls = []
        memberURLs.forEach(memberURL=>{
          //console.log(memberURL.filePath)
          m_urls.push(memberURL.filePath)
        })
        console.log(m_urls)
        
        res.status(200).json({success:true, m_urls})
      }
    })  
})

app.post('/api/photo/incView',(req,res)=>{
  Photo.findOneAndUpdate({_id:req.body.photoId},{$inc : {views : 1}})
      .exec((err,result)=>{
        if(err) return res.status(400).send(err)
        return res.status(200).json({success: true, result})
      })
})

app.post('/api/video/incView',(req,res)=>{
  Video.findOneAndUpdate({_id:req.body.videoId},{$inc : {views : 1}})
      .exec((err,result)=>{
        if(err) return res.status(400).send(err)
        return res.status(200).json({success: true, result})
      })
})

//================================================================
//      구독관련
//================================================================

app.post('/api/subscribe/subscribeNumber',(req,res)=>{
  Subscriber.find({'userTo':req.body.userTo})
    .exec((err,subscribe)=>{
      if(err) return res.status(400).send(err)
      return res.status(200).json({success: true, subscribeNumber:subscribe.length})
    })
})

app.post('/api/subscribe/subscribed',(req,res)=>{
  Subscriber.find({"userTo":req.body.userTo, "userFrom":req.body.userFrom})
    .exec((err,subscribe)=>{
      if(err) return res.status(400).send(err)
      let result=false
      if(subscribe.length !==0) {
        result = true
      }
      res.status(200).json({success:true, subscribed:result})
    })
})

app.post('/api/subscribe/unSubscribe',(req,res)=>{
  Subscriber.findOneAndDelete({userTo:req.body.userTo, userFrom:req.body.userFrom})
  .exec((err,doc)=>{
    if(err) return res.status(400).json({success:false, err})
    res.status(200).json({success:true, doc})
  })
})

app.post('/api/subscribe/Subscribe',(req,res)=>{
  const subscribe = new Subscriber(req.body)
  subscribe.save((err,doc)=>{
    if(err) return res.status(400).json({success:false, err})
    res.status(200).json({success:true})
  })
})

app.post('/api/subscribe/getSubscriptionVideos',(req,res)=>{
  //자신의 아이디를 통해 구독하고 있는 사람들을 찾는다
  Subscriber.find({userFrom: req.body.userFrom})
    .exec((err,subscriberInfo)=>{
      if(err) return res.status(400).send(err)

      let subscribedUser = [];
      subscriberInfo.map((subscriber,i)=>{
        subscribedUser.push(subscriber.userTo)
      })
        //찾은 사람들의 업로드 비디오를 가지고 온다
        Video.find({writer: {$in: subscribedUser}})
          .populate('writer')
          .exec((err,videos)=>{
            if(err) return res.status(400).send(err)
            res.status(200).json({success:true, videos})
          })
    })
})

app.post('/api/subscribe/getSubscriptionPhotos',(req,res)=>{
  //자신의 아이디를 통해 구독하고 있는 사람들을 찾는다
  Subscriber.find({userFrom: req.body.userFrom})
    .exec((err,subscriberInfo)=>{
      if(err) return res.status(400).send(err)

      let subscribedUser = [];
      subscriberInfo.map((subscriber,i)=>{
        subscribedUser.push(subscriber.userTo)
      })
        //찾은 사람들의 업로드 사진를 가지고 온다

        Photo.find({writer: {$in: subscribedUser}})
          .populate('writer')
          .exec((err,photos)=>{
            if(err) return res.status(400).send(err)
            res.status(200).json({success:true, photos})
          })
    })
})

app.post('/api/photo/delPhoto',(req,res)=>{
  //console.log(req.body.currentID)
  //console.log(req.body.photoId)
  Photo.deleteOne({writer:req.body.currentID, _id:req.body.photoId})
    .exec((err,doc)=>{
      if(err) return res.status(400).send(err)
            res.status(200).json({success:true})
    })
})

app.post('/api/video/delVideo',(req,res)=>{
  Video.deleteOne({writer:req.body.currentID, _id:req.body.videoId})
  .exec((err,doc)=>{
    if(err) return res.status(400).send(err)
          res.status(200).json({success:true})
  })
})

//================================================================
//      댓글관련
//================================================================

app.post('/api/video/comment/saveComment',(req,res)=>{
  const comment = new Comment(req.body)
  comment.save((err,comment)=>{
    if(err) return res.status(400).json({success:false, err})
    Comment.find({'_id':comment._id})
      .populate('writer')
      .exec((err,result)=>{
        if(err) return res.status(400).json({success:false, err})
        res.status(200).json({success:true, result})
      })
  })
})

app.post('/api/photo/comment/saveComment',(req,res)=>{
  const comment = new Comment(req.body)
  comment.save((err,comment)=>{
    if(err) return res.status(400).json({success:false, err})
    Comment.find({'_id':comment._id})
      .populate('writer')
      .exec((err,result)=>{
        if(err) return res.status(400).json({success:false, err})
        res.status(200).json({success:true, result})
      })
  })
})

app.post('/api/video/comment/getComments',(req,res)=>{
  Comment.find({"postId":req.body.videoId})
    .populate('writer')
    .exec((err, comments)=>{
      if(err) return res.status(400).send(err)
      res.status(200).json({success: true, comments})
    })
})

app.post('/api/photo/comment/getComments',(req,res)=>{
  Comment.find({"photo_postId":req.body.photoId})
    .populate('writer')
    .exec((err, comments)=>{
      if(err) return res.status(400).send(err)
      res.status(200).json({success: true, comments})
    })
})

app.post('/api/video/comment/deleteComment',(req,res)=>{
  Comment.countDocuments({postId:req.body.postId, responseTo:req.body.commentId},(err,count)=>{
    if(err) return res.json({success:false,err})
    else{

      if(count>0){
        Comment.findOneAndUpdate({_id:req.body.commentId},{content:"삭제된 댓글입니다."},(err,user)=>{
          if(err) return res.json({success:false,err})
          return res.status(200).json({success: true})
        })
      }
      else{
        Comment.deleteOne({_id:req.body.commentId})
            .exec((err,doc)=>{
              if(err) return res.status(400).send(err)
              res.status(200).json({success:true})
            })
      }
    }
  })
})

app.post('/api/photo/comment/deleteComment',(req,res)=>{
  Comment.countDocuments({photo_postId:req.body.postId, responseTo:req.body.commentId},(err,count)=>{
    if(err) return res.json({success:false,err})
    else{

      if(count>0){
        Comment.findOneAndUpdate({_id:req.body.commentId},{content:"삭제된 댓글입니다."},(err,user)=>{
          if(err) return res.json({success:false,err})
          return res.status(200).json({success: true})
        })
      }
      else{
        Comment.deleteOne({_id:req.body.commentId})
            .exec((err,doc)=>{
              if(err) return res.status(400).send(err)
              res.status(200).json({success:true})
            })
      }
    }
  })
})



//================================================================
//      좋아요&싫어요 관련
//================================================================

app.post('/api/like/getLikes',(req,res)=>{
  let variable={}
  if(req.body.videoId){
    variable = {videoId:req.body.videoId}
  }
  else if(req.body.photoId){
    variable = {photoId:req.body.photoId}
  }
  else{
    variable = {commentId:req.body.commentId}
  }
  Like.find(variable)
      .exec((err,likes)=>{
        if(err) return res.status(400).send(err)
        res.status(200).json({success:true,likes})
      })
})

app.post('/api/like/getDisLikes',(req,res)=>{
  let variable={}
  if(req.body.videoId){
    variable = {videoId:req.body.videoId}
  }
  else if(req.body.photoId){
    variable = {photoId:req.body.photoId}
  }
  else{
    variable = {commentId:req.body.commentId}
  }
  DisLike.find(variable)
      .exec((err,dislikes)=>{
        if(err) return res.status(400).send(err)
        res.status(200).json({success:true,dislikes})
      })
})

app.post('/api/like/uplike',(req,res)=>{
  let variable={}
  if(req.body.videoId){
    variable = {videoId:req.body.videoId, userId:req.body.userId}
  }
  else if(req.body.photoId){
    variable = {photoId:req.body.photoId, userId:req.body.userId}
  }
  else{
    variable = {commentId:req.body.commentId, userId:req.body.userId}
  }
  //like collection에 클릭정보 입력
  const like = new Like(variable)
  like.save((err,likeResult)=>{
    if(err) return res.json({success:false, err})

    if(likeResult){
      if(req.body.videoId){
        Video.findOneAndUpdate({_id:req.body.videoId},{$inc : {likes : 1}}).exec()
        //console.log('비디오 +1 입니다')
      }else if(req.body.photoId){
        Photo.findOneAndUpdate({_id:req.body.photoId},{$inc : {likes : 1}}).exec()
        //console.log('포토 +1 입니다')
      }
    }
    
      //만약 dislike가 이미 클릭되어있다면 dislike를 1 줄인다.
    DisLike.findOneAndDelete(variable)
        .exec((err,disLikeResult)=>{
          if(err) return res.status(400).json({success:false,err})
          if(disLikeResult){
            if(req.body.videoId){
              Video.findOneAndUpdate({_id:req.body.videoId},{$inc : {likes : 1}}).exec()
              //console.log('비디오 +1 입니다')
  
            }else if(req.body.photoId){
              Photo.findOneAndUpdate({_id:req.body.photoId},{$inc : {likes : 1}}).exec()
              //console.log('포토 +1 입니다')
            }
          }
          
          res.status(200).json({success:true})
        })
  })
})

app.post('/api/like/unlike',(req,res)=>{
  let variable={}
  if(req.body.videoId){
    variable = {videoId:req.body.videoId, userId:req.body.userId}
  }
  else if(req.body.photoId){
    variable = {photoId:req.body.photoId, userId:req.body.userId}
  }
  else{
    variable = {commentId:req.body.commentId, userId:req.body.userId}
  }
  Like.findOneAndDelete(variable)
    .exec((err,result)=>{
      if(err) return res.status(400).json({success:false,err})

      if(result){
        if(req.body.videoId){
          Video.findOneAndUpdate({_id:req.body.videoId},{$inc : {likes : -1}}).exec()
        //console.log('비디오 -1 입니다')
  
        }else if(req.body.photoId){
          Photo.findOneAndUpdate({_id:req.body.photoId},{$inc : {likes : -1}}).exec()
        //console.log('포토 -1 입니다')
        }
      }
      res.status(200).json({success:true})
    })
})

app.post('/api/like/upDislike',(req,res)=>{
  let variable={}
  if(req.body.videoId){
    variable = {videoId:req.body.videoId, userId:req.body.userId}
  }
  else if(req.body.photoId){
    variable = {photoId:req.body.photoId, userId:req.body.userId}
  }
  else{
    variable = {commentId:req.body.commentId, userId:req.body.userId}
  }
  //dislike collection에 클릭정보 입력
  const dislike = new DisLike(variable)
  dislike.save((err,dislikeResult)=>{
    if(err) return res.json({success:false, err})
    
    if(dislikeResult){
      if(req.body.videoId){
        Video.findOneAndUpdate({_id:req.body.videoId},{$inc : {likes : -1}}).exec()
        //console.log('비디오 -1 입니다')
  
      }else if(req.body.photoId){
        Photo.findOneAndUpdate({_id:req.body.photoId},{$inc : {likes : -1}}).exec()
        //console.log('포토 -1 입니다')
      }
    }
    
    
      //만약 like가 이미 클릭되어있다면 like를 1 줄인다.
      Like.findOneAndDelete(variable)
          .exec((err,LikeResult)=>{
            if(err) return res.status(400).json({success:false,err})
            if(LikeResult){
              if(req.body.videoId){
                Video.findOneAndUpdate({_id:req.body.videoId},{$inc : {likes : -1}}).exec()
        //console.log('비디오 -1 입니다')
  
              }else if(req.body.photoId){
                Photo.findOneAndUpdate({_id:req.body.photoId},{$inc : {likes : -1}}).exec()
        //console.log('포토 -1 입니다')
              }

            }
            
            res.status(200).json({success:true})
          })
  })
})

app.post('/api/like/unDislike',(req,res)=>{
  let variable={}
  if(req.body.videoId){
    variable = {videoId:req.body.videoId, userId:req.body.userId}
  }
  else if(req.body.photoId){
    variable = {photoId:req.body.photoId, userId:req.body.userId}
  }
  else{
    variable = {commentId:req.body.commentId, userId:req.body.userId}
  }
  DisLike.findOneAndDelete(variable)
    .exec((err,result)=>{
      if(err) return res.status(400).json({success:false,err})

      if(result){
        if(req.body.videoId){
          Video.findOneAndUpdate({_id:req.body.videoId},{$inc : {likes : 1}}).exec()
        }else if(req.body.photoId){
          Photo.findOneAndUpdate({_id:req.body.photoId},{$inc : {likes : 1}}).exec()
        }
      }
      
      res.status(200).json({success:true})
    })
})










app.use('/uploads', express.static('uploads'));
//process.env.NODE_ENV ==="production"
if(true){
  app.use(express.static("client/build"))
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../client","build","index.html"))
  })  
}

/*
const httpsServerOption={
  key:fs.readFileSync(path.join(__dirname,'/config/https/private.pem')),
  cert:fs.readFileSync(path.join(__dirname,'/config/https/public.pem'))
}


https.createServer(httpsServerOption,app)
    .listen(PORT, () => {
      console.log(`Example app listening at https://${IP}:${PORT}`)
    })

*/

app.listen(PORT,() => {
  console.log(`Example app listening at http://${IP}:${PORT}`)
})

