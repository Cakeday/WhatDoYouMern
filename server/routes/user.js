const express = require('express');
const { requireSignIn } = require('../controllers/auth')
const { 
    userById, 
    getAllUsers, 
    getUser, 
    updateUser, 
    deleteUser, 
    userPhoto,
    addFollowing,
    addFollower,
    removeFollowing,
    removeFollower,
    findPeople
} = require('../controllers/user');
const { hashPassword } = require('../passwordHash')
const { userUpdateValidator } = require('../validator')


const router = express.Router();

router.get('/users', getAllUsers)
router.put('/user/follow', requireSignIn, addFollowing, addFollower)
router.put('/user/unfollow', requireSignIn, removeFollowing, removeFollower)

router.get('/user/findpeople/:userId', requireSignIn, findPeople)

router.get('/user/:userId', requireSignIn, getUser)
router.put('/user/:userId', requireSignIn, userUpdateValidator, hashPassword, updateUser)
router.delete('/user/:userId', requireSignIn, deleteUser)

router.param("userId", userById)

module.exports = router