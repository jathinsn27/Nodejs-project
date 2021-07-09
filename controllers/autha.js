const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../database')
const { promisify } = require('util')
const PASSWORD_HASH_SECRET = 8;
var nodemailer = require('nodemailer');

const adminlogin = async (req, res, next) => {
    const { email, pass } = req.body

    if(!email || !pass) {
        return res.status(400).render('admin_login', {
            message: "Plese provide email and password"
        })
    }

    db.get().query('SELECT * FROM admin_login WHERE email = ?', [email] , async (error, results) => {
       console.log('database:' ,results)
       console.log(pass)
    //    const isMatch = await bcrypt.compare(pass, results[0].password)
    //    console.log(isMatch);
       if(!results ) {
           return res.status(401).render('admin_login', {
               message: 'Incorrect email or password'
           })
       }
       else{
            const sno =results[0].sno
            console.log(sno)
            const token = jwt.sign({ sno }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            })
        console.log("The token is: " + token)

        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        }

        res.cookie('admins_cookie', token, cookieOptions)
        res.status(200).redirect('admin_login')
        //res.status(200).render('examform')
       }
    })
}

module.exports = {
    adminlogin
}