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
    
}
