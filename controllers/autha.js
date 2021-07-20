const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const pool = require('../database')
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

    pool.query('SELECT * FROM admin_login WHERE email = ?', [email] , async (error, results) => {
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
    pool.query('SELECT email FROM admin_login WHERE email = ?', [email], async (error, results) => {
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

    pool.query('INSERT INTO admin_login set ?', { 
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
}

const admin1 = async (req, res, next) => {
    const semNumber = req.params.semId;

    //console.log(req.cookies)
        try{
            pool.query('SELECT * FROM examform WHERE sem=?',[semNumber], (error, result) => {
                if(error){
                    console.error(error)
                    return next()
                }
                else{
                    let semResult = [];
                    let length = Object.keys(result).length
                    for (let i=0; i<length; i++){
                        let dummy ={
                            'name': result[i].name,
                            'email': result[i].email,
                            'usn': result[i].usn,
                            'regisrtration': result[i].registration
                        }
                        semResult.push(dummy)
                    }
                    
                    console.log(semResult)
                    // console.log(result)
                    // result=result
                    req.result = semResult;
                    // pool.release();
                    return next()
                }
            }) 
            }
            catch (error) {
                console.error(error)
                return next()
            }
    
}

const summary = async (req, res, next) => {
    let semResult = {};
    let sems = [1, 3,5 ,7];
    try {
        const sem1Result = await pool.query('SELECT count(*) FROM examform WHERE sem=1');
        const sem3Result = await pool.query('SELECT count(*) FROM examform WHERE sem=3');
        const sem5Result = await pool.query('SELECT count(*) FROM examform WHERE sem=5');
        const sem7Result = await pool.query('SELECT count(*) FROM examform WHERE sem=7');
        semResult = {
            1: sem1Result[0]['count(*)'],
            3: sem3Result[0]['count(*)'],
            5: sem5Result[0]['count(*)'],
            7: sem7Result[0]['count(*)']
        }
    } catch(e) {
        console.error(e);
    }
    
    req.semResult = semResult;
    next();  
}

module.exports = {
    adminlogin,
    adminregister,
    adminLogout,
    admin1,
    summary
}