const _ = require('lodash')
const User = require('../models/user')

module.exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User Not found"
            })
        }
        req.profile = user
        next()
    })
    
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await User.find().select("name email updated created")
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