const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/user')

module.exports = {
    signup: async (req, res, next) => {
        try {
            const emailAlreadyExists = await User.findOne({email: req.body.email})
            if (emailAlreadyExists) return res.status(403).json({
                error: "Email is taken"
            })
            const user = await new User(req.body)
            await user.save()
            res.status(200).json({message: "Signup success! Please log in :)"})
        } catch (error) {
            next(error)
        }
    },

    signin: async (req, res) => {
        try {
            
        } catch (error) {
            
        }
    }

    getAllUsers: async (req, res, next) => {
        try {
            const allUsers = await User.find()
            res.json(allUsers)
        } catch (error) {
            next(error)
        }
    }
}