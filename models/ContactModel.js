const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    firstname:{
        type : String,
        required : true
    },
    lastname:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true
    },
    subject:{
        type : String,
        required : true
    },
    message:{
        type : String,
        required : true
    },
    createAt:{
        type : Date,
        default : Date.now
    },
});

const ContactModel = new mongoose.model("contect", ContactSchema);
module.exports = ContactModel;