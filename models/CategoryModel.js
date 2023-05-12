const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    specialist:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    catImage:{
        type:String,
        required:true
    },
    createAt:{
        type : Date,
        default : Date.now
    },
}
);

const CategoryModel = new mongoose.model("category", CategorySchema);
module.exports = CategoryModel;