const express = require('express')
const path = require('path')
const router = express.Router()
const authController = require('../controllers/auth')
const jwt = require('jsonwebtoken')

const app = express()

router.get('/student', (req, res) => {
    
    res.render("login")
    
})

router.get('/student/forgot_password', (req, res) => {
    
    res.render("forgot_password")
})

router.get('/student/forgot_password2/:jwt', (req, res) => {
    let mail_token = req.params.jwt
    exports.mail_token = mail_token
    
    res.render("forgot_password2")
})

router.get('/student/examform', authController.isLoggedIn, (req, res) => {
    
    if( req.user ) {
        res.render('examform', {
            user: req.user
        })
    }
    else{
        res.redirect('/student')
    }
})

router.get('/student/signup', (req, res) => {
    res.render("signup")
})

router.get('/student/confirm', (req, res) => {
    res.render("confirm")
})

module.exports = router


