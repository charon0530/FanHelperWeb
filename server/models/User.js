//사용자 모델을 만드는 곳
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname:{
        type: String,
        maxlength: 50
    },
    role:{
        type:Number,
        default: 0
    },
    image:String,
    token: {
        type: String
    },
    toeknExp: {
        type: Number
    }
})
//user모델의 save 함수 이전에 행하는 행위 정의(암호화 등)
userSchema.pre('save',function(next){
    var user = this // 현재 이 함수를 진행하고있는 인스턴스

    //비밀번호가 바뀔때만 암호화하면됨
    if (user.isModified ('password')) {
        //비밀번호 암호화
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    }
    else{
        next();
    }
})

userSchema.methods.comparePassword = function(plainPassword,cb){
    //평문을 암호화해서 DB와 비교해야함
    bcrypt.compare(plainPassword,this.password, function(err,isMatch){
        if(err) return cb(err)
        else{
            cb(null,isMatch)
        }
    })
}

userSchema.methods.generateToken = function(cb){
    //jwt를 이용한 토큰생성
    var user = this
    var token = jwt.sign(user._id.toHexString(),'secretToken')
    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)
    })
}

userSchema.statics.findByToekn = function(token, cb){
    var User = this// 여기서는 static 메소드임. 즉, 여기서 this는 모델(User)을 가리킴

    //토큰 복호화
    jwt.verify(token,'secretToken',function(err,decoded){
        //decoded는 클라이언트 아이디
        //이를 이용해 유저를 찾고 해당토큰과 보관된 토큰이 일치하는지 확인
        User.findOne({"_id":decoded, "token":token},function(err, user){
            if(err) return cb(err)
            cb(null, user)
        })
    })
}

const User = mongoose.model("User",userSchema)
module.exports = {User}