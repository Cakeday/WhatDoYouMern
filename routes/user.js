const express = require('express');
const { requireSignIn } = require('../controllers/auth')
const { userById, getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/user');


const router = express.Router();

router.get('/users', getAllUsers)
router.get('/user/:userId', requireSignIn, getUser)
router.put('/user/:userId', requireSignIn, updateUser)
router.delete('/user/:userId', requireSignIn, deleteUser)


// Any route containing :userId will be processed by this middleware and execute userById()
router.param("userId", userById)

module.exports = router