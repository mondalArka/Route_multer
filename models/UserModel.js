const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: false
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userImage:{
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    createAt:{
        type : Date,
        default : Date.now
    },
})

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;