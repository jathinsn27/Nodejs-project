const express = require('express')
const path = require('path')
const router = express.Router()
const dotenv = require('dotenv');
const mysql = require('mysql')

const app = express()

dotenv.config({ path: './.env'});

const db = mysql.createConnection({
    
    host       :  process.env.DATABASE_HOST,
    user       :  process.env.DATABASE_USER,
    password   :  process.env.DATABASE_PASSWORD,
    database   :  process.env.DATABASE
})

db.connect((err) => {
    if(err){
        throw err
    }
    console.log('Database connected...')
})

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

app.set('view engine', 'hbs')

const student = require('./routes/student')
const admin = require('./routes/admin')
const auth = require('./routes/auth');
const { dirname } = require('path');

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', student)
app.use('/admin', admin)
app.use('/auth', auth)

app.listen(5000, () => {
    console.log('server is listening on port 5000....')
})
