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
        const { email, password } = req.body
        try {
            const user = await User.findOne({ email })
            if (!user) return res.status(401).json({error: "That email doesnt exist in our database. Please try again or sign up."})
            const checkPw = await comparePasswords(password, user.password)
            if (!checkPw) return res.status(401).json({error: "That password doesn't exist"})

            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
            res.cookie("t", token, {expire: new Date() + 9999})

            const { _id, name } = user

            return res.json({token, user: {_id, email, name}})
            
        } catch (error) {
            res.status(401).json({error})
            next(error)
        }
    },

    signout: (req, res) => {
        res.clearCookie("t")
        return res.json({message: "Signout success"})
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