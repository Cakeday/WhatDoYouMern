const Post = require('../models/post')
const fs = require('fs')


module.exports = {

    getPosts: (req, res) => {
        Post.find().populate("postedBy", "_id name")
            .then(posts => res.json(posts))
            .catch(err => console.log(err))
    },

    createPost: (req, res, next) => {
        const post = new Post(req.body)
        if (req.file) {
            post.photo.data = req.file.path
            post.photo.contentType = req.file.mimetype
        }
        post.postedBy = req.profile
        Post.create(post)
            .then(data => res.json(data))
            .catch(error =>res.json(error))
    },

    postsByUser: (req, res) => {
        Post.find({postedBy: req.profile._id})
            .populate("postedBy", "_id name")
            .sort("created")
            .then(data => res.json(data))
            .catch(err => res.status(400).json(err))
    },
        
    postById: (req, res, next, id) => {
        Post.findById(id)
            .populate("postedBy", "_id, name")
            .then(post => {
                req.post = post
                next()
            })
            .catch(err => res.status(400).json(err))
    },

    isPoster: (req, res, next) => {
        let isPoster = req.auth && req.post && req.post.postedBy._id === req.auth._id
        if (!isPoster) {
            return res.status(403).json({
                error: "User is not authorized"
            })
        }
        next()
    },


    deletePost: (req, res) => {
        let post = req.post
        Post.deleteOne({_id: post._id})
        .then(data => res.json({message: "Post deleted successfully"}))
        .catch(err => res.status(400).json(err))
    }






}