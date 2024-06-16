const   mongoose = require('mongoose');
const validator = require('validator');
const userRoles = require('../utils/userRoles');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true,
        validate: [validator.isEmail, 'field must be a valid email']
    },
    password: {
        type: String,
        require: true
    },
    token: {
        type:String
    },
    role:{
        type: String,
        enum: [userRoles.MANGER, userRoles.ADMIN, userRoles.USER],
        default: userRoles.USER
    },
    avatar:{
        type: String,
        default: "/uploads/avatar.jpg"
    }
})

module.exports = mongoose.model('User', userSchema);