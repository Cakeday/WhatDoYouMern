const _ = require('lodash')
const User = require('../models/user')
const fs = require('fs')
const path = require('path')

module.exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User Not found"
            })
        }
        req.profile = user
        console.log(user)
        next()
    })
    
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await User.find()
        res.json(allUsers)
    } catch (error) {
        res.status('401').json({error: "User does not exist"})
        next(error)
    }
}

module.exports.getUser = (req, res) => {
    req.profile.password = undefined
    return res.json(req.profile)
}

module.exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id
    if (!authorized) return res.status(403).json({error: "User not authorized to perform this action"})
}

module.exports.updateUser = (req, res, next) => {
    let user = req.profile
    user = _.extend(user, req.body) // extend mutates the source object
    user.updated = Date.now()
    if (req.file) {
        console.log("****************************************************************************************")
        console.log("****************************************************************************************")
        console.log("****************************************************************************************")
        console.log(req.file)
        user.photo.data = req.file.filename
        user.photo.contentType = req.file.mimetype
    }
    user.save((err) => {
        if (err) {
            return res.status(400).json({
                error: "You are not authorized to perform this action."
            })
        }
        user.password = undefined
        res.json({user})
    })
}

module.exports.userPhoto = async (req, res, next) => {
    try {
        if (req.profile.photo.data) {
            console.log("made it here....................")

            res.set("Content-Type", req.profile.photo.contentType)
            console.log()
            return res.send(req.profile.photo.data)
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports.deleteUser = (req, res, next) => {
    let user = req.profile
    user.remove((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        return res.json({ message: "User deleted successfully" })
    })
}