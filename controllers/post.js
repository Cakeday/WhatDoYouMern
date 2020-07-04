const Post = require('../models/post')
const fs = require('fs')


module.exports = {

    getPosts: (req, res) => {
        Post.find()
            .then(posts => res.json(posts))
            .catch(err => console.log(err))
    },

    createPost: (req, res, next) => {
        const post = new Post(req.body)
        if (req.file) {
            post.photo.data = req.file.path
            post.photo.contentType = req.file.mimetype
        }
        Post.create(post)
            .then(data => res.json(data))
            .catch(error =>res.json(error))
    }
}