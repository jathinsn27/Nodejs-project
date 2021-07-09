const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/signin', authController.signin)
router.post('/register', authController.register)
router.get('/logout', authController.logout)
router.post('/examform', authController.examform)
router.post('/forgotpassword', authController.forgotpassword)
router.post('/forgotpassword2', authController.forgotpassword2)
    

module.exports = router;