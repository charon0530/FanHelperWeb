//사용자 모델을 만드는 곳
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
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

    

})

const User = mongoose.model("User",userSchema)
module.exports = {User}