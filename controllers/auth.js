const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../database')
const { promisify } = require('util')
const PASSWORD_HASH_SECRET = 8;
var nodemailer = require('nodemailer');
 
//  const signin =(req, res) => {
//      const { email, pass } = req.body
//      db.get().query('SELECT email, password FROM student_signup WHERE email = ?', [email], async (error, results) => {
//         console.log('database:' ,results)
//         // Load hash from your password DB.
//         bcrypt.compare(pass, results[0].hashedPassword, function(err, result) {
//         // result == true
//             console.log('Password result: ',results);
//         });
//      })
// }

const signin = async (req, res, next) => {
    const { email, pass } = req.body

    if(!email || !pass) {
        return res.status(400).render('login', {
            message: "Plese provide email and password"
        })
    }

    db.get().query('SELECT * FROM student_signup WHERE email = ?', [email] , async (error, results) => {
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
        //res.status(200).render('examform')
       }
    })

     
    // console.log("hello world")
    // console.log(req.body)
    // res.status(200).send({
    //     message: "Request successful"
    // })
}

const register = (req, res) => {
    console.log(req.body);

    const { name, email, usn, num, date, password1, password2, validation } = req.body;
    db.get().query('SELECT email FROM student_signup WHERE email = ?', [email], async (error, results) => {
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

    db.get().query('INSERT INTO student_signup set ?', { 
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
    // response.status(201).send({
    //     message: 'Registered successfully'
    // })
    //res.redirect('/student')
}

const isLoggedIn = async (req, res, next) => {
    //console.log(req.cookies)
    if( req.cookies.jatins_cookie){
        try{
            const decoded = await promisify(jwt.verify)(req.cookies.jatins_cookie, process.env.JWT_SECRET)

            console.log(decoded)

            db.get().query('SELECT * FROM student_signup WHERE sno = ?', [decoded.sno], (error, result) => {
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
    db.get().query('INSERT INTO examform set ?', { 
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
            // return res.status(201).render('confirm', {
            //     message: 'Form Submitted'
            // })
        }
    })
}

const forgotpassword =(req, res) => {
    const { email } = req.body;
    db.get().query('SELECT email FROM student_signup WHERE email = ?', [email], async (error, results) => {
        if(error){
            console.log(error);
        }
    
        else if( results.length = 0 ){
            return res.render('signup', {
                message: 'Email doesnot exist'
            })
        }
    else{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'testingdummybms@gmail.com',
          pass: 'cookiethedog'
        }
      })
      
      try {
          const emailToken = jwt.sign(
            {
              user: _.pick(user, 'id'),
            },
            EMAIL_SECRET,
            {
              expiresIn: '1d',
            },
            )

            const url = `http://localhost:3000/student/forgot_password2/${emailToken}`

      var mailOptions = {
        from: 'testingdummybms@gmail.com',
        to: email,  //email
        subject: 'Password update mail',
        // text: 'That was easy!'
        html: '<h1>Welcome</h1> <a href="${url}">Click here to reset password</a>'
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

const forgotpassword2 =(req, res) => {
    const { password1, password2 } = req.body;
    db.get().query('SELECT email FROM student_signup WHERE email = ?', [])
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