const express = require('express')
const authController = require('../controllers/autha');

const router = express.Router();

router.post('/adminlogin', authController.adminlogin)

module.exports = router;