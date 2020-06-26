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

    hashedPassword: {
        type: String,
        required: true
    },

    created: {
        type: Date,
        default: Date.now()
    },

    updated: Date,
    
})

userSchema.pre('save', async function(next) {
    let user = this;
    if (!user.isModified('hashedPassword')) return next()
    
    try {
        user.password = await bcrypt.hash(user.password, 10)
        next()
    } catch (error) {
        next(error)
    }

})

userSchema.methods = {
    comparePasswords: async function validatePassword(data) {
        return bcrypt.compare(data, this.password);
    }
}


module.exports = mongoose.Model("User", userSchema)