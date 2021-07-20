const express = require('express')
const path = require('path')
const router = express.Router()
const authaController = require('../controllers/autha')

router.get('/', (req, res) => {
    res.render("admin_login")
})

router.get('/admin1', (req, res) => {
    res.render("admin1")
})

router.get('/admin3', authaController.summary, (req, res) => {
    console.log(req.semResult);
    res.render("admin3", {
        sem1: req.semResult[1], 
        sem3: req.semResult[3], 
        sem5: req.semResult[5], 
        sem7: req.semResult[7],
        pendingSem1: 50 - req.semResult[1],
        pendingSem3: 50 - req.semResult[3],
        pendingSem5: 50 - req.semResult[5],
        pendingSem7: 50 - req.semResult[7],
    }
        )
})

// router.get('/sem/:id', (request, response) => {
//     console.log(request.params)
//     console.log(request.query)
//     //If id = 1 fetch sem 1 data
//     //then respond with hbs template (sem 1, sem1 data);
//     response.status(200).send();
// })

router.get('/sem/:semId', authaController.admin1, (req, res) => {
    // if( req.sem1) {
    //     res.render('sem1', {
    //         sem1: req.sem1
    //     })
    // }
    // else{
    //     res.redirect('/student')
    // }
    //res.sendFile(path.resolve('./public/examform.html'))
    res.render("sem1", {result: req.result})
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

router.get('/admin_signup', (req, res) => {
    res.render("admin_signup")
})


module.exports = router