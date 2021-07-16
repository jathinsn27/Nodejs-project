const mysql = require('mysql2')
const dotenv = require('dotenv')
const path = require('path')
const util = require('util')
dotenv.config({ path: './.env'});

// // const db = mysql.createConnection({
// //     host       :  process.env.DATABASE_HOST,
// //     user       :  process.env.DATABASE_USER,
// //     password   :  process.env.DATABASE_PASSWORD,
// //     database   :  process.env.DATABASE
// // })

// let DB_STATE = {
//     pool: null
// }

// exports.connect = function( done) {
//     DB_STATE.pool = mysql.createPool({
//         host       :  process.env.DATABASE_HOST,
//         user       :  process.env.DATABASE_USER,
//         password   :  process.env.DATABASE_PASSWORD,
//         database   :  process.env.DATABASE
//     })

//     done()
// }

// exports.get = function() {
//     return DB_STATE.pool
// }

// db.connect((err) => {
//     if(err){
//         throw err
//     }
//     console.log('Database connected...')
// })

let pool = mysql.createPool({
            host       :  process.env.DATABASE_HOST,
            user       :  process.env.DATABASE_USER,
            password   :  process.env.DATABASE_PASSWORD,
            database   :  process.env.DATABASE
        })
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})

pool.query = util.promisify(pool.query);

module.exports = pool
