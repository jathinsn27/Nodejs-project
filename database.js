const mysql = require('mysql')
const dotenv = require('dotenv')
const path = require('path')

// dotenv.config({ path: './.env'});

// const db = mysql.createConnection({
//     host       :  process.env.DATABASE_HOST,
//     user       :  process.env.DATABASE_USER,
//     password   :  process.env.DATABASE_PASSWORD,
//     database   :  process.env.DATABASE
// })

let DB_STATE = {
    pool: null
}

exports.connect = function( done) {
    DB_STATE.pool = mysql.createPool({
        host       :  process.env.DATABASE_HOST,
        user       :  process.env.DATABASE_USER,
        password   :  process.env.DATABASE_PASSWORD,
        database   :  process.env.DATABASE
    })

    done()
}

exports.get = function() {
    return DB_STATE.pool
}

// db.connect((err) => {
//     if(err){
//         throw err
//     }
//     console.log('Database connected...')
// })
