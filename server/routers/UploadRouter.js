// @ts-nocheck
const express = require("express")
const { db, snowId } = require("../db/DbUtils")
const fs = require("fs")
const router = express.Router()

router.post('/rich_editor_upload', async (req, res) => {

    if (!req.files) {
        res.send({
            "errno": 1,
            "message": "失败信息"
        })
        return
    }

    let files = req.files
    let ret_files = []
    for (let file of files) {
        // 获取文件名后缀
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf('.') + 1)

        // 随机文件名
        let file_name = snowId.NextId() + "." + file_ext
        // 修改文件名 移动文件
        fs.renameSync(
            process.cwd() + "/public/upload/temp/" + file.filename,
            process.cwd() + "/public/upload/" + file_name
        )
        ret_files.push("/upload/" + file_name)
    }
    res.send({
        "errno": 0,
        "data": {
            "url": ret_files[0]
        }
    })
})

module.exports = router