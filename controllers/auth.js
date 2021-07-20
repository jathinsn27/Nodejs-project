const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const pool = require('../database')
const { promisify } = require('util')
const PASSWORD_HASH_SECRET = 8;
var nodemailer = require('nodemailer');
const _ = require('lodash')
const express = require('express')
const student = require('../routes/student')

const app = express();
 
const signin = async (req, res, next) => {
    const { email, pass } = req.body

    if(!email || !pass) {
        return res.status(400).render('login', {
            message: "Plese provide email and password"
        })
    }

    pool.query('SELECT * FROM student_signup WHERE email = ?', [email] , async (error, results) => {
       console.log('database:' ,results)
       console.log(pass)
       const isMatch = await bcrypt.compare(pass, results[0].password)
       console.log(isMatch);
       if(!results || !isMatch) {
           return res.status(401).render('login', {
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

        res.cookie('jatins_cookie', token, cookieOptions)
        res.status(200).redirect('/student/examform')
       }
    })
}

const register = (req, res) => {
    console.log(req.body);

    const { name, email, usn, num, date, password1, password2, validation } = req.body;
    pool.query('SELECT email FROM student_signup WHERE email = ?', [email], async (error, results) => {
    if(error){
        console.log(error);
    }

    if( results.length > 0 ){
        return res.render('login', {
            message: 'Email not available'
        })
    }
    else if( password1 != password2){
        return res.render('login', {
            message: 'Password do not match'
        })       
    }

    let hashedPassword = await bcrypt.hash(password1, PASSWORD_HASH_SECRET)
    console.log(hashedPassword)

    pool.query('INSERT INTO student_signup set ?', { 
        name: name,
         email: email, 
         usn:usn, 
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
            return res.status(201).render('login', {
                message: 'User registered'
            })
        }
    })


    })
}

const isLoggedIn = async (req, res, next) => {
    if( req.cookies.jatins_cookie){
        try{
            const decoded = await promisify(jwt.verify)(req.cookies.jatins_cookie, process.env.JWT_SECRET)

            console.log(decoded)

            pool.query('SELECT * FROM student_signup WHERE sno = ?', [decoded.sno], (error, result) => {
            console.log(result)

            if(!result){
                return next();
            }

            req.user = result[0];
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

const logout = async (req, res) => {
    res.cookie('jatins_cookie', 'logout', {
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    })

    res.status(200).redirect('../student')
}

const examform = (req, res) => {
    console.log(req.body);

    const { name, email, usn, num, date, fname, fnum, mname, mnum, sex, country, state, registration, sem, course1, course2 ,course3 ,course4 , course5, validation} = req.body;
    pool.query('INSERT INTO examform set ?', { 
        name: name,
        email: email, 
        usn:usn, 
        num:num, 
        date:date, 
        fname:fname,
        fnum:fnum,
        mname:mname,
        mnum:mnum,
        sex:sex,
        country:country,
        state:state,
        registration:registration,
        sem:sem,
        course1:course1,
        course2:course2,
        course3:course3,
        course4:course4,
        course5:course5,
        validation:validation 
        }, (error, results) =>{
        if(error){
            console.error(error)  
        }
        else{
            console.log(results)
            res.status(200).redirect('../student/confirm')
        }
    })
}

const forgotpassword =(req, res) => {
    const { email } = req.body;
    console.log(req.params.jwt);
    const decode = jwt.decode(req.params.jwt);
    console.log(decode)
    pool.query('SELECT email, sno FROM student_signup WHERE email = ?', [email],  (error, results) => {
        if(error){
            console.log(error);
        } else if( results.length === 0 ){
            return res.render('signup', {
                message: 'Email doesnot exist'
            })
        } else{
            const id = results[0].sno;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'testingdummybms@gmail.com',
          pass: 'cookiethedog'
        }
      })
      
      try {
          const emailToken = jwt.sign(
            {
              user: id,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: '1d',
            },
            )
            console.log(emailToken);
            const url = `http://localhost:3000/student/forgot_password2/${emailToken}`

      var mailOptions = {
        from: 'testingdummybms@gmail.com',
        to: email,  //email
        subject: 'Password update mail',
        html: `<h1>Welcome</h1> <a href="${url}">Click here to reset password</a>`
      };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    }) 
    }catch (err) {
    console.error(err);
    }
}
})
}

const forgotpassword2 = async (req, res) => {
    const { password1, password2 } = req.body;
    console.log(password1)
    mail_token=student.mail_token
    console.log(mail_token);
    const decode = jwt.decode(mail_token)
    console.log(decode)
    console.log(decode.user)
    const id = decode.user
    let hashedPassword = await bcrypt.hash(password1, PASSWORD_HASH_SECRET)
    console.log(hashedPassword)
    let sql = `UPDATE student_signup SET password='${hashedPassword}' WHERE sno='${id}'`
    pool.query(sql, (error, results) => {
        if(error){
            console.error(error)  
        }
        else{
            console.log(results)
            res.status(200).redirect('../student')               
        }
    })
    
    // pool.query('SELECT sno FROM student_signup WHERE sno = ?', [sno], (err, results) => { 
    //     if(err){
    //         console.error(err)
    //     }
    //     else{
    //         console.log(results)
    //         // pool.query(`UPDATE student_signup SET password=${password1} WHERE sno=id`,{

    //         // })
    //         // if(error){
    //         //     console.error(error)  
    //         // }
    //         // else{
    //         //     console.log(results)
    //         //     res.status(200).redirect('../student')               
    //         //}
    //     }
    // })
}

module.exports = {
    signin,
    register,
    isLoggedIn,
    logout,
    examform,
    forgotpassword,
    forgotpassword2
}
