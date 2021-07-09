const express = require('express')
const path = require('path')
const router = express.Router()
const authController = require('../controllers/auth')

const app = express()

//let { student } = require('../data')

router.get('/student', (req, res) => {
    //res.sendFile(path.resolve('./views/login'))
    res.render("login")
})

router.get('/student/forgot_password', (req, res) => {
    //res.sendFile(path.resolve('./public/forgot_password.html'))
    res.render("forgot_password")
})

router.get('/student/forgot_password2', (req, res) => {
    //res.sendFile(path.resolve('./public/forgot_password.html'))
    res.render("forgot_password2")
})

router.get('/student/examform', authController.isLoggedIn, (req, res) => {
    //console.log(req.user)
    if( req.user ) {
        res.render('examform', {
            user: req.user
        })
    }
    else{
        res.redirect('/student')
    }
    //res.sendFile(path.resolve('./public/examform.html'))
})

router.get('/student/signup', (req, res) => {
    //res.sendFile(path.resolve('./public/signup.html'))
    res.render("signup")
})

router.get('/student/confirm', (req, res) => {
    //res.sendFile(path.resolve('/public/confirm.html'))
    res.render("confirm")
})

module.exports = router


