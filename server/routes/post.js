const express = require('express');
const { getPosts, createPost, postsByUser, postById, isPoster, deletePost, updatePost, singlePost, like, unlike } = require('../controllers/post');
const { createPostValidator } = require('../validator')
const { requireSignIn } = require('../controllers/auth')
const { userById } = require('../controllers/user');

const router = express.Router();

router.get('/posts', getPosts);
router.put('/post/like', requireSignIn, like)
router.put('/post/unlike', requireSignIn, unlike)
router.post('/post/new/:userId', requireSignIn, createPostValidator, createPost);
router.get('/posts/by/:userId', requireSignIn, postsByUser);
router.get('/post/:postId', singlePost)
router.delete('/post/:postId', requireSignIn, isPoster, deletePost);
router.put('/post/:postId', requireSignIn, isPoster, updatePost);

// Any route containing a user id will be processed by this middleware
router.param("userId", userById)
router.param("postId", postById)


module.exports = router

