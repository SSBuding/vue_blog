// @ts-nocheck
const express = require("express")
const { db, snowId } = require("../db/DbUtils")
const router = express.Router()

// 查询博客
router.get('/search', async (req, res) => {
    /**
     * keyword 关键字
     * categoryId 分类编号
     * 
     * 分页：
     * page 页码
     * pagesize 分页大小
     */

    let { keyword, categoryId, page, pagesize } = req.query
    page = page == null ? 1 : page
    pagesize = pagesize == null ? 10 : pagesize
    categoryId = categoryId == null ? 0 : categoryId
    keyword = keyword == null ? '' : keyword

    let params = []
    let where_sqls = []
    if (categoryId !== 0) {
        where_sql.push(`category_id = ?`)
        params.push(categoryId)
    }
    if (keyword !== '') {
        where_sql.push(`(title like ? OR content = ?)`)
        params.push(`%${keyword}%`)
        params.push(`%${keyword}%`)
    }
    let where_sql = ''
    if (where_sqls.length > 0) {
        where_sql = ' WHERE ' + where_sqls.join(' AND ')
    }
    // 查分页数据
    let searchSqlStr = ' SELECT * FROM blog ' + where_sql + ' ORDER BY create_time DESC LIMIT ?,? '
    let searchParams = params.concat([(page - 1) * pagesize, pagesize])
    // 查总数
    let searchCountSqlStr = ' SELECT count(*) AS count FROM blog ' + where_sql
    let searchCountParams = params
    try {
        // 分页数据
        let searchResult = await db.query(searchSqlStr, searchParams)
        // 总数
        let countResult = await db.query(searchCountSqlStr, searchCountParams)
        console.log(countResult)
        if (searchResult.length > 0 && countResult.length > 0) {
            res.send({
                code: 200,
                message: '查询成功',
                data: {
                    keyword,
                    categoryId,
                    pagesize,
                    page,
                    searchResult,
                    count: countResult[0].count
                }
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


// 添加博客
router.post('/_token/add', async (req, res) => {
    let { title, categoryId, content } = req.body
    if (title && categoryId && content) {
        let id = snowId.NextId()
        let create_time = new Date().getTime()
        let sqlStr = `INSERT INTO blog (id,title,category_id,content,create_time) VALUES (?,?,?,?,?)`
        try {
            let rows = await db.query(sqlStr, [id, title, categoryId, content, create_time])
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
            message: 'title或categoryId或content为空'
        })
    }

})

// 修改博客
router.put('/_token/update', async (req, res) => {
    let { id, title, categoryId, content } = req.body
    if (id && title && categoryId && content) {
        let sqlStr = `UPDATE blog SET title = ? ,content = ? ,category_id = ? where id = ?`
        try {
            let rows = await db.query(sqlStr, [title, content, categoryId, id])
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
            message: 'id或title或categoryId或content为空'
        })
    }

})

// 删除博客
router.delete('/_token/delete', async (req, res) => {
    let id = req.query.id
    if (id) {
        let sqlStr = `DELETE FROM blog where id = ?`

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