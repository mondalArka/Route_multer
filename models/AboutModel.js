const mongoose = require("mongoose")
const Schema = mongoose.Schema

const aboutSchema = new Schema({
    AboutImage:{
        type:String,
        required:false
    },
    contents:{
        type : String,
        required : true
    },
    status:{
        type : Boolean,
        default : true
    },
    createAt:{
        type : Date,
        default : Date.now
    },
})

const SchemaData = new mongoose.model('about' , aboutSchema)

module.exports = SchemaData