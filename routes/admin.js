const express = require('express')
const path = require('path')
const router = express.Router()
const authController = require('../controllers/auth')

//let { admin } = require('../data')

router.get('/', (req, res) => {
    //res.sendFile(path.resolve('./public/admin_login.html'))
    res.render("admin_login")
})

router.get('/admin1', (req, res) => {
    //res.sendFile(path.resolve('./public/admin1.html'))
    res.render("admin1")
})

router.get('/admin3', (req, res) => {
    //res.sendFile(path.resolve('./public/admin3.html'))
    res.render("admin3")
})

// router.get('/sem/:id', (request, response) => {
//     console.log(request.params)
//     console.log(request.query)
//     //If id = 1 fetch sem 1 data
//     //then respond with hbs template (sem 1, sem1 data);
//     response.status(200).send();
// })

router.get('/sem1', (req, res) => {
    // res.sendFile(path.resolve('./public/sem1.html'))
    res.render("sem1")
})

router.get('/sem3', (req, res) => {
    res.render("sem3")
})

router.get('/sem5', (req, res) => {
    res.render("sem5")
})

router.get('/sem7', (req, res) => {
    res.render("sem7")
})


module.exports = router