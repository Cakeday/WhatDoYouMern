const Post = require('../models/post')
const fs = require('fs')
const _ = require('lodash')


module.exports = {

    getPosts: (req, res) => {
        Post.find()
        .populate({ path: "postedBy", select: "_id name" })
        .populate({ 
            path: "comments", 
            select: "text createdBy", 
            populate: {
                path: "postedBy", select: "_id name"
            } 
        })
        .select("_id title body created photo likes")
        .sort({created: -1})
            .then(posts => res.json(posts))
            .catch(err => console.log(err))
    },

    createPost: (req, res, next) => {
        const post = new Post(req.body)
        if (req.file) {
            post.photo.data = req.file.filename
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
            .select("_id title body created photo likes")
            .sort("created")
            .then(data => res.json(data))
            .catch(err => res.status(400).json(err))
    },
        
    postById: (req, res, next, id) => {
        Post.findById(id)
            .populate("postedBy", "_id name")
            .populate("comments", "text createdBy")
            .populate({ 
                path: "comments", 
                select: "text createdBy", 
                populate: {
                    path: "postedBy", select: "_id name"
                } 
            })
            .select("_id title body created photo likes comments")
            .then(post => {
                req.post = post
                console.log(post)
                next()
            })
            .catch(err => res.status(400).json(err))
    },

    isPoster: (req, res, next) => {
        let isPoster = req.auth && req.post && req.post.postedBy._id == req.auth._id
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
        .then(data => {
            if (post.photo) {
                fs.unlink(post.photo.data, err => {
                    if (err) {
                        return res.json(err)
                    }
                    res.json({message: "Post deleted successfully"})
                })
            }
        })
        .catch(err => res.status(400).json(err))
    },


    updatePost: (req, res, next) => {
        let post = req.post
        if (req.file) {
            post.photo.data = req.file.filename
            post.photo.contentType = req.file.mimetype
        }
        post = _.extend(post, req.body)
        post.updated = Date.now()
        post.save(err => {
            if (err) {
                return res.json(400).json({error: err})
            }
            res.json(post)
        })
    },

    singlePost: (req, res) => {
        Post.findById(req.post._id)
        .populate("postedBy", "_id name")
        .populate({ 
            path: "comments", 
            select: "text createdBy", 
            populate: {
                path: "postedBy", select: "_id name"
            } 
        })
        .select("_id title body created photo likes comments")
        .then(post => {
            return res.json(post)
        })
        .catch(err => res.status(400).json(err))
        // return res.json(req.post)
    },


    like: (req, res) => {
        Post.findByIdAndUpdate(req.body.postId, {$push: {likes: req.body.userId}}, {new: true})
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({error: err})
            } else {
                return res.json(data)
            }
        })
    },

    unlike: (req, res) => {
        Post.findByIdAndUpdate(req.body.postId, {$pull: {likes: req.body.userId}}, {new: true})
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({error: err})
            } else {
                return res.json(data)
            }
        })
    },


    comment: (req, res) => {
        let comment = req.body.comment
        comment.postedBy = req.body.userId
        Post.findByIdAndUpdate(req.body.postId, {$push: {comments: comment}}, {new: true})
        // .populate('comments.postedBy', '_id, name')
        .populate({ 
            path: "comments", 
            select: "text createdBy", 
            populate: {
                path: "postedBy", select: "_id name"
            } 
        })
        // .populate('postedBy', '_id name')
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({error: err})
            } else {
                return res.json(data)
            }
        })
    },


    uncomment: (req, res) => {
        let { _id } = req.body.comment
        Post.findByIdAndUpdate(req.body.postId, {$pull: {comments: {_id}}}, {new: true})
        // .populate('comments.postedBy', '_id, name')
        // .populate('postedBy', '_id name')
        .populate({ 
            path: "comments", 
            select: "text createdBy", 
            populate: {
                path: "postedBy", select: "_id name"
            } 
        })
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({error: err})
            } else {
                return res.json(data)
            }
        })
    },
}