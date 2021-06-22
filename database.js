const express = require('express')
const mysql = require('mysql')

const app = express()

const db = mysql.createConnection({
    host       :  'localhost',
    user       :  'root',
    password   :  'password',
    database   :  'college_database'
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