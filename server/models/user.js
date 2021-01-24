const mongoose = require('mongoose')
const uuidv1 = require('uuidv1')
const bcrypt = require('bcrypt')
const { ObjectId } = mongoose.Schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },

    email: {
        type: String,
        trim: true,
        required: true
    },

    photo: {
        data: String,
        contentType: String
    },

    about: {
        type: String,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    following: [{
        type: ObjectId,
        ref: "User"
    }],

    followers: [{
        type: ObjectId,
        ref: "User"
    }],

    resetPasswordLink: {
        data: String,
        default: ""
    },

    created: {
        type: Date,
        default: Date.now()
    },

    updated: Date,
    
})



module.exports = mongoose.model("User", userSchema)