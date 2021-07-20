const express = require('express')
const path = require('path')
const router = express.Router()
const dotenv = require('dotenv')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const hbs = require('hbs')
const cors = require('cors')
const db = require('./database')

const app = express()

dotenv.config({ path: './.env'});

const viewPath = path.join(__dirname, 'views')
app.use(cors())
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

const PORT = 5000;


    app.listen(PORT, () => {
        console.log('server is listening on port 5000....')
    })

