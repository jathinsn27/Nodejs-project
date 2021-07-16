const express = require('express')
const authaController = require('../controllers/autha');

const router = express.Router();

router.post('/adminlogin', authaController.adminlogin)
router.get('/adminLogout', authaController.adminLogout)
router.post('/adminregister', authaController.adminregister)
router.post('/admin1', authaController.admin1)
router.post('/summary', authaController.summary)

module.exports = router;