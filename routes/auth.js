const express = require('express');
const { signup, signin, signout, getAllUsers } = require('../controllers/auth');
const { hashPassword } = require('../passwordHash')
const { userSignupValidator } = require('../validator')


const router = express.Router();

router.post('/signup', userSignupValidator, hashPassword, signup);
router.post('/signin', signin);
router.get('/signout', signout);
router.get('/getAllUsers', getAllUsers)

module.exports = router

