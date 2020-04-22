const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
   email:{
       type:String,
       required:true,
       unique:true,
       
   },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    tweets:{
        type:Array,
        required:false
    }
    
})

const User = mongoose.model('User',userSchema,"User")
module.exports = User;