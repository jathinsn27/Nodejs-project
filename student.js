const express = require('express')
const path = require('path')
const router = express.Router()

let { student } = require('../data')

router.get('/student', (req, res) => {
    res.sendFile(path.resolve('./public/login.html'))
})

router.get('/student/forgot_password', (req, res) => {
    res.sendFile(path.resolve('./public/forgot_password.html'))
})

router.get('/student/examform', (req, res) => {
    res.sendFile(path.resolve('./public/examform.html'))
})

router.get('/student/signup', (req, res) => {
    res.sendFile(path.resolve('./public/signup.html'))
})

router.get('/student/confirm', (req, res) => {
    res.sendFile(path.resolve('/public/confirm.html'))
})

module.exports = router
