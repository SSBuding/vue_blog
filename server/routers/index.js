const express = require("express")
const { db, snowId } = require("../db/DbUtils")
const router = express.Router()

router.get('/test', async (req, res) => {
    let sqlStr = `SELECT * FROM admin`
    let out = await db.query(sqlStr, [])
    res.send({
        id: snowId.NextId(),
        out
    })
})

module.exports = router