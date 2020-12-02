const mongoose=require('mongoose')
const Schema = mongoose.Schema
const DisLikeSchema = mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    commentId:{
        type:Schema.Types.ObjectId,
        ref:'Comment'
    },
    videoId:{
        type:Schema.Types.ObjectId,
        ref:'Video'
    },
    photoId:{
        type:Schema.Types.ObjectId,
        ref:'Photo'
    }
}, { timestamps: true })


const DisLike = mongoose.model('DisLike',DisLikeSchema)
module.exports={DisLike}