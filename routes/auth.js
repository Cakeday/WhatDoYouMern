const express = require('express');
const { signup, signin, signout, getAllUsers } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { hashPassword } = require('../passwordHash')
const { userSignupValidator } = require('../validator')


const router = express.Router();

router.post('/signup', userSignupValidator, hashPassword, signup);
router.post('/signin', signin);
router.get('/signout', signout);

// Any route containing a user id will be processed by this middleware
router.param("userId", userById)

module.exports = router

