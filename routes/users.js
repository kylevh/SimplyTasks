const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const userController = require('../controllers/users')
const passport = require('passport')
const { isLoggedIn, isAuthor, validateNote } = require('../middleware')




router.get('/register', userController.renderRegister);

router.post('/register', catchAsync(userController.register))

router.get('/login', userController.renderLogin);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.login);

router.get('/logout', userController.logout);

router.get('/profile', isLoggedIn, userController.viewProfile);


module.exports = router;