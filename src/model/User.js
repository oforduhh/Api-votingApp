const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email:{
        type:String,
        unique: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
        }
    },
    voteId:{
        type:Number,
    },
    token: {
            type: String,
    },
    phoneNumber: Number
}, {
timestamps: true
});

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.token

    return userObject;
};

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET);

    user.token = token;
    await user.save();
    return token;
};

userSchema.statics.findByCredentials = async (voteId) =>{
    const user = await User.findOne({voteId})
    if(!user) throw new Error('Wrong Vote ID');
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
