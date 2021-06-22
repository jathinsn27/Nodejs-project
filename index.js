const express = require('express')

const app = express()


const student = require('./routes/student')
const admin = require('./routes/admin')

app.use(express.static('./public'))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', student)
app.use('/admin', admin)


app.listen(5000, () => {
    console.log('server is listening on port 5000....')
})