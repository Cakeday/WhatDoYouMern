const jwt = require('jsonwebtoken');
const _ = require('lodash');
require('dotenv').config();
const User = require('../models/user');
const { comparePasswords } = require('../passwordHash/');
const { expressjwt: expressJwt } = require('express-jwt');
const { sendEmail } = require('../helpers');

module.exports = {
    signup: async (req, res, next) => {
        try {
            const emailAlreadyExists = await User.findOne({
                email: req.body.email
            });
            if (emailAlreadyExists)
                return res.status(403).json({
                    error: 'Email is taken'
                });
            const user = await new User(req.body);
            await user.save();
            res.status(200).json({
                message: 'Signup success! Please log in :)'
            });
        } catch (error) {
            next(error);
        }
    },

    signin: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user)
                return res.status(401).json({
                    error: 'That email doesnt exist in our database. Please try again or sign up.'
                });
            const checkPw = await comparePasswords(password, user.password);
            if (!checkPw)
                return res.status(401).json({ error: 'Incorrect password' });

            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            res.cookie('t', token, { expire: new Date() + 9999 });

            const { _id, name } = user;

            return res.json({ token, user: { _id, email, name } });
        } catch (error) {
            res.status(401).json({ error });
            next(error);
        }
    },

    signout: (req, res) => {
        res.clearCookie('t');
        return res.json({ message: 'Signout success' });
    },

    forgotPassword: (req, res) => {
        if (!req.body)
            return res.status(400).json({ message: 'No request body' });
        if (!req.body.email)
            return res
                .status(400)
                .json({ message: 'No Email in request body' });

        const { email } = req.body;

        User.findOne({ email }, (err, user) => {
            if (err || !user) {
                return res
                    .status(400)
                    .json({ error: 'A user with that email does not exist.' });
            }

            const token = jwt.sign(
                { _id: user._id, iss: 'NODEAPI' },
                process.env.JWT_SECRET
            );

            const emailData = {
                from: 'noreply@node-react.com',
                to: email,
                subject: 'Password Reset Instructions',
                text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
                html: `<p>Please use the following link to reset your password:</p> <p>${process.env.CLIENT_URL}/reset-password/${token}</p>`
            };

            return user.updateOne({ resetPasswordLink: token }, err => {
                if (err) {
                    return res.json({ message: err });
                } else {
                    sendEmail(emailData);
                    return res.status(200).json({
                        message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
                    });
                }
            });
        });
    },

    resetPassword: (req, res) => {
        const { resetPasswordLink, password } = req.body;

        User.findOne({ resetPasswordLink }, (err, user) => {
            if (err || !user) {
                return res.status('401').json({
                    error: 'Invalid Link!'
                });
            }

            const updatedFields = {
                password: password,
                resetPasswordLink: ''
            };

            user = _.extend(user, updatedFields);
            user.updated = Date.now();

            user.save((err, result) => {
                if (err) {
                    return res.status(400).json({ error: err });
                }
                res.json({
                    message: `Great! Now you can login with your new password.`
                });
            });
        });
    },

    socialLogin: (req, res) => {
        // try signup by finding user with req.email
        User.findOne({ email: req.body.email }, (err, user) => {
            if (err || !user) {
                // create a new user and login
                user = new User(req.body);
                req.profile = user;
                user.save();
                // generate a token with user id and secret
                const token = jwt.sign(
                    { _id: user._id, iss: 'NODEAPI' },
                    process.env.JWT_SECRET
                );
                res.cookie('t', token, { expire: new Date() + 9999 });
                // return response with user and token to frontend client
                const { _id, name, email } = user;
                return res.json({ token, user: { _id, name, email } });
            } else {
                // update existing user with new social info and login
                req.profile = user;
                user = _.extend(user, req.body);
                user.updated = Date.now();
                user.save();
                // generate a token with user id and secret
                const token = jwt.sign(
                    { _id: user._id, iss: 'NODEAPI' },
                    process.env.JWT_SECRET
                );
                res.cookie('t', token, { expire: new Date() + 9999 });
                // return response with user and token to frontend client
                const { _id, name, email } = user;
                return res.json({ token, user: { _id, name, email } });
            }
        });
    }
};

module.exports.requireSignIn = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth',
    algorithms: ['HS256']
});
