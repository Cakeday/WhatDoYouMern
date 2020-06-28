const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/user')
const { comparePasswords } = require('../passwordHash/')

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

    signin: async (req, res, next) => {
        const { _id, name, email, password } = req.body
        try {
            const user = await User.findOne({ email })
            if (!user) next(new Error("That email doesn't exist in our database. Please try again or sign up."))
            const checkPw = await comparePasswords(password, user.hashedPassword)
            if (!checkPw) next(new Error("That password doesn't exist"))

            
        } catch (error) {
            res.status(401).json({error})
            next(error)
        }
        

    },

    getAllUsers: async (req, res, next) => {
        try {
            const allUsers = await User.find()
            res.json(allUsers)
        } catch (error) {
            res.status('401').json({error: "User does not exist"})
            next(error)
        }
    }
}