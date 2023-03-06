const express = require("express")
const { db, snowId } = require("../db/DbUtils")
const router = express.Router()

// 列表接口
router.get('/list', async (req, res) => {
    let sqlStr = `SELECT * FROM category`
    try {
        let rows = await db.query(sqlStr, [])
        if (rows.length > 0) {
            res.send({
                code: 200,
                message: '查询成功',
                rows
            })
        } else {
            res.send({
                code: 501,
                message: '查询失败'
            })
        }
    } catch (err) {
        console.log(err)
        res.send({
            code: 500,
            message: '查询失败'
        })
    }
})


// 添加接口
router.post('/add', async (req, res) => {
    let { name } = req.body
    if (name) {
        let sqlStr = `INSERT INTO category (id,name) VALUES (?,?)`
        try {
            let rows = await db.query(sqlStr, [snowId.NextId(), name])
            // console.log(rows)
            if (rows.affectedRows > 0) {
                res.send({
                    code: 200,
                    message: '添加成功',
                })
            } else {
                res.send({
                    code: 501,
                    message: '添加失败'
                })
            }
        } catch (err) {
            console.log(err)
            res.send({
                code: 500,
                message: '添加失败'
            })
        }
    } else {
        res.send({
            code: 502,
            message: 'name为空'
        })
    }

})

// 修改接口
router.put('/update', async (req, res) => {
    let { name, id } = req.body
    if (name && id) {
        let sqlStr = `UPDATE category SET name = ? where id = ?`
        try {
            let rows = await db.query(sqlStr, [name, id])
            // console.log(rows)
            if (rows.affectedRows > 0) {
                res.send({
                    code: 200,
                    message: '修改成功',

                })
            } else {
                res.send({
                    code: 501,
                    message: '修改失败'
                })
            }
        } catch (err) {
            console.log(err)
            res.send({
                code: 500,
                message: '修改失败'
            })
        }
    } else {
        res.send({
            code: 502,
            message: 'name或id为空'
        })
    }

})

// 删除接口
router.delete('/delete', async (req, res) => {
    let id = req.query.id
    if (id) {
        let sqlStr = `DELETE FROM category where id = ?`

        try {
            let rows = await db.query(sqlStr, [id])
            // console.log(rows)

            if (rows.affectedRows > 0) {
                res.send({
                    code: 200,
                    message: '删除成功',

                })
            } else {
                res.send({
                    code: 501,
                    message: '删除失败'
                })
            }
        } catch (err) {
            console.log(err)
            res.send({
                code: 500,
                message: '删除失败'
            })
        }
    } else {
        res.send({
            code: 502,
            message: 'id为空'
        })
    }

})


module.exports = router