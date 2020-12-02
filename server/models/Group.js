const mongoose=require('mongoose')
const Schema = mongoose.Schema
const GroupSchema = mongoose.Schema({
    groupName:{
        type: String
    },
    member:{
        type: Array
    }
}, { timestamps: true })


const Group = mongoose.model('Group',GroupSchema)
module.exports={Group}