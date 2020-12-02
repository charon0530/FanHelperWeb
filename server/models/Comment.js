const mongoose=require('mongoose')
const Schema = mongoose.Schema
const CommentSchema = mongoose.Schema({
    writer:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    postId:{
        type: Schema.Types.ObjectId,
        ref:'Video'
    },
    photo_postId:{
        type: Schema.Types.ObjectId,
        ref:'Photo'
    },
    responseTo:{
        type: Schema.Types.ObjectId,
        ref:'Comment'
    },
    content:{
        type:String
    }
    
}, { timestamps: true })


const Comment = mongoose.model('Comment',CommentSchema)
module.exports={Comment}