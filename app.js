const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')

const app = express()

app.use(bodyParser.urlencoded({ extended: false}))

app.use(bodyParser.json())


const pool = mysql.createPool({
    host       :  'localhost',
    user       :  'root',
    password   :  'password',
    database   :  'college_database'
})

app.get('', (req,res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threasId}`)

        // query(sqlString, callback)

        connection.query('select * from student_signup', (err,rows) =>{
            connection.release()  //return the connection to port

            if(!err){
                res.send(rows)
            }
            else{
                console.log(err)
            }
        })
    })
})

db.connect((err) => {
    if(err){
        throw err
    }
    console.log('MySql Connected...')
})

app.listen('5000', () => {
    console.log('Sserver is listening on port 5000...')
})

module.exports = db;