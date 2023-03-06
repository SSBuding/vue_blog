// @ts-nocheck
const mysql = require("mysql")
const SnowId = require("../utils/SnowFlake")
const snowId = new SnowId({ WorkerId: 1 })
const pool = mysql.createPool({
    user: 'root',          //用户名
    password: '123456',	//密码
    host: 'localhost',		//主机（默认都是local host）
    database: 'vue_blog'       //数据库名
})

const db = {}

// 封装方法
// 通过该方法获取链接
db.query = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}


module.exports = {
    db,
    snowId
}