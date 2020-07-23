const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const adminSchema = new mongoose.Schema({
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
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.includes('password')){
                throw new Error('Your password must not include "password"');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
timestamps: true
});

adminSchema.methods.toJSON = function(){
    const admin = this
    const adminObject = admin.toObject()

    delete adminObject.password
    delete adminObject.tokens

    return adminObject;
};

adminSchema.pre('save', async function (next){
    const admin = this;
    if (admin.isModified('password')){
        admin.password = await bcrypt.hash(admin.password, 8)
    }
    next();
});

adminSchema.methods.generateAuthToken = async function(){
    const admin = this;
    const token = jwt.sign({ _id: admin._id.toString()}, process.env.JWT_SECRET);

    admin.tokens = admin.tokens.concat({ token });
    await admin.save();
    return token;
};

adminSchema.statics.findByCredentials = async (email, password) =>{
    const admin = await Admin.findOne({email})
    if(!admin) throw new Error('Wrong Email Or Password');

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) throw new Error('Wrong Email Or Password');

    return admin;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;