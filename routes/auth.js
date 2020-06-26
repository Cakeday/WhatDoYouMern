const express = require('express');
const { signup, getAllUsers } = require('../controllers/auth');
const { hashPassword } = require('../passwordHash')
const { userSignupValidator } = require('../validator')


const router = express.Router();

router.post('/signup', userSignupValidator, hashPassword, signup);
router.get('/getAllUsers', getAllUsers)

module.exports = router

