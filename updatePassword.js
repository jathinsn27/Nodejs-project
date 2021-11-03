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
          pass: ''
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
