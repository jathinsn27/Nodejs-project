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
       const isMatch = await bcrypt.compare(pass, results[0].password)
       console.log(isMatch);
       if(!results || !isMatch) {
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
        res.status(200).redirect('/admin/admin1')
        //res.status(200).render('examform')
       }
    })
}

const adminLogout = async (req, res) => {
    res.cookie('jatins_cookie', 'logout', {
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    })

    res.status(200).redirect('../admin')
}

const adminregister = (req, res) => {
    console.log(req.body);

    const { name, email, num, date, password1, password2, validation } = req.body;
    db.get().query('SELECT email FROM admin_login WHERE email = ?', [email], async (error, results) => {
    if(error){
        console.log(error);
    }

    if( results.length > 0 ){
        return res.render('admin_login', {
            message: 'Email not available'
        })
    }
    else if( password1 != password2){
        return res.render('admin_login', {
            message: 'Password do not match'
        })       
    }

    let hashedPassword = await bcrypt.hash(password1, PASSWORD_HASH_SECRET)
    console.log(hashedPassword)

    db.get().query('INSERT INTO admin_login set ?', { 
        name: name,
         email: email, 
         num:num, 
         date:date, 
         password:hashedPassword, 
         validation:validation 
        }, (error, results) =>{
        if(error){
            console.error(error)           
        }
        else{
            console.log(results)
            return res.status(201).render('admin_login', {
                message: 'User registered'
            })
        }
    })


    })
    // response.status(201).send({
    //     message: 'Registered successfully'
    // })
    //res.redirect('/student')
}

const adminInfo = (req, res, next) => {
    try{
    db.get().query('SELECT SUM(WHERE sem=1) FROM admin_login', (error, result) => {
        if(error){
            console.error(error)
            return next()
        }
        else{
            console.log(result)
            sem1=result
            return next()
        }
    }) 
    }
    catch (error) {
        console.error(error)
        return next()
    }
}

const admin1 = async (req, res, next) => {
    //console.log(req.cookies)
    if( req.cookies.jatins_cookie){
        try{
            const decoded = await promisify(jwt.verify)(req.cookies.jatins_cookie, process.env.JWT_SECRET)

            console.log(decoded)

            db.get().query('SELECT * FROM examform where sem=1', (error, result) => {
            console.log(result)

            if(!result){
                return next();
            }

            req.sem1Info = result[0];
            return next();

            })

        } catch (error) {
            console.error(error)
            return next();
        } 
    }

    else{
        next()
    }
}

module.exports = {
    adminlogin,
    adminregister,
    adminLogout,
    adminInfo,
    admin1
}