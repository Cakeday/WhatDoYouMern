const express = require('express');
const { requireSignIn } = require('../controllers/auth')
const { userById, getAllUsers, getUser, updateUser, deleteUser, userPhoto } = require('../controllers/user');
const { hashPassword } = require('../passwordHash')
const { userSignupValidator, userUpdateValidator } = require('../validator')


const router = express.Router();

router.get('/users', getAllUsers)
router.get('/user/:userId', requireSignIn, getUser)
router.put('/user/:userId', requireSignIn, userUpdateValidator, hashPassword, updateUser)
router.delete('/user/:userId', requireSignIn, deleteUser)

router.get('/user/photo/:userId', userPhoto)


// Any route containing :userId will be processed by this middleware and execute userById()
router.param("userId", userById)

module.exports = router