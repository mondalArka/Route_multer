const mongoose = require("mongoose")
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate-v2');

const blogSchema = new Schema({
    title:{
        type : String,
        required : true
    },
    subtitle:{
        type : String,
        required : true
    },
    content:{
        type : String,
        required : true
    },
    PostImage:{
        type:String,
        required:true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    status:{
        type : Boolean,
        default : true
    },
    createAt:{
        type : Date,
        default :Date.now
    }
})

blogSchema.plugin(mongoosePaginate);

const SchemaData = new mongoose.model('blog' , blogSchema)

module.exports = SchemaData