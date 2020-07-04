const express = require('express');
const { getPosts, createPost } = require('../controllers/post');
const { createPostValidator } = require('../validator')
const { requireSignIn } = require('../controllers/auth')
const { userById } = require('../controllers/user')

const router = express.Router();

router.get('/', getPosts);
router.post('/post/new/:userId', requireSignIn, createPostValidator, createPost);

// Any route containing a user id will be processed by this middleware
router.param("userId", userById)


module.exports = router

