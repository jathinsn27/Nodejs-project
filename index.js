const express = require('express')
const path = require('path')
const router = express.Router()
const dotenv = require('dotenv')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const hbs = require('hbs')
const db = require('./database')

const app = express()

dotenv.config({ path: './.env'});

const viewPath = path.join(__dirname, 'views')
// app.use(express.static(publicDirectory))
app.set('view engine', 'hbs')
app.set('views', viewPath)
app.use(cookieParser())
app.use(express.static(__dirname + '/public'));

const student = require('./routes/student')
const admin = require('./routes/admin')
const auth = require('./routes/auth');
const autha = require('./routes/autha')
const { dirname } = require('path');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', student)
app.use('/admin', admin)
app.use('/auth', auth)
app.use('/autha', autha)

db.connect((err) => {
    if(err){
        console.error('Unable to connect to database.')
        throw err
    }
    console.log('Database connected...')
    app.listen(3000, () => {
        console.log('server is listening on port 3000....')
    })
})
