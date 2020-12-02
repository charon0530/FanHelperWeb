const mongoose=require('mongoose')
const Schema = mongoose.Schema
const PhotoSchema = mongoose.Schema({
    writer:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type: String,
        maxlength: 50
    },
    description:{
        type:String
    },
    privacy:{
        type: Number
    },
    filePath : {
        type: String,
    },
    catogory: String,
    views : {
        type: Number,
        default: 0 
    },
    likes : {
        type: Number,
        default: 0 
    },
    group:{
        type: String
    },
    name:{
        type: String
    }
}, { timestamps: true })


const Photo = mongoose.model('Photo',PhotoSchema)
module.exports={Photo}