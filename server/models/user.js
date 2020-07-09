const mongoose = require('mongoose')
const uuidv1 = require('uuidv1')
const bcrypt = require('bcrypt')

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

    password: {
        type: String,
        required: true
    },

    created: {
        type: Date,
        default: Date.now()
    },

    updated: Date,
    
})



module.exports = mongoose.model("User", userSchema)