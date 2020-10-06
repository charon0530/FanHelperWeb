const {User}=require('../models/User')

let auth = (req,res,next)=>{

    //클라이언트로 쿠키로부터 토큰 가져옴
    let token = req.cookies.x_auth

    //토큰 복호화 후 유저 찾기
    User.findByToekn(token,(err,user)=>{
        if(err) throw err
        if(!user) return res.json({isAuth:false, error:true})
        
        //유저가 있다면
        req.token = token
        req.user = user
        next()
    })
}

module.exports={auth}