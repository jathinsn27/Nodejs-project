const express = require('express')
const path = require('path')
const router = express.Router()

let { admin } = require('../data')

router.get('/admin', (req, res) => {
    res.sendFile(path.resolve('./public/admin_login.html'))
})

router.get('/admin1', (req, res) => {
    res.sendFile(path.resolve('./public/admin1.html'))
})

router.get('/admin3', (req, res) => {
    res.sendFile(path.resolve('./public/admin3.html'))
})

router.get('/sem1', (req, res) => {
    res.sendFile(path.resolve('./public/sem1.html'))
})

router.get('/sem3', (req, res) => {
    res.sendFile(path.resolve('./public/sem3.html'))
})

router.get('/sem5', (req, res) => {
    res.sendFile(path.resolve('./public/sem5.html'))
})

router.get('/sem7', (req, res) => {
    res.sendFile(path.resolve('./public/sem7.html'))
})


module.exports = router