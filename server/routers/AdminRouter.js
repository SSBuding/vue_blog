const express = require("express")
const uuid = require('uuid');
const { db, snowId } = require("../db/DbUtils")
const router = express.Router()

router.post('/login', async (req, res) => {
    let { account, password } = req.body
    let sqlStr = `SELECT * FROM admin where account = ? and password = ?`

    try {
        let rows = await db.query(sqlStr, [account, password])
        if (rows.length > 0) {
            let login_token = uuid.v4()
            let update_token_sql = `UPDATE admin set token = ? where id = ?`
            await db.query(update_token_sql, [login_token, rows[0].id])
            let admin_info = rows[0]
            admin_info.token = login_token
            admin_info.password = ''
            res.send({
                code: 200,
                message: '登录成功',
                data: admin_info
            })
        } else {
            res.send({
                code: 501,
                message: '登录失败'
            })
        }
    } catch (err) {
        console.log(err)
        res.send({
            code: 500,
            message: '登录失败'
        })
    }



})

module.exports = router