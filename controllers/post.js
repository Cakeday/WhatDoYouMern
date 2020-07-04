const Post = require('../models/post')


module.exports = {

    getPosts: (req, res) => {
        const posts = Post.find()
        .select("_id title body")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => console.log(err))
    },

    createPost: (req, res) => {
        const post = new Post(req.body)
        console.log('CREATING POST: ', req.body)
        post.save().then(result => {
            res.json({post: result})
        })
    }
}