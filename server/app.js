const express = require("express");
const multer = require("multer")
const { db, snowId } = require("./db/DbUtils")
const path = require('path')
const app = express()

const port = 8019

//开放跨域请求
app.use(function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "*");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method == "OPTIONS") res.sendStatus(200); //让options尝试请求快速结束
    else next();
});
app.use(express.json())

// 处理文件上传
const update = multer({
    dest: "./public/upload/temp"
})
app.use(update.any())
// 静态资源路径
app.use(express.static(path.join(__dirname, "public")))
// 路由设置
const ADMIN_TOKEN_PATH = '/_token'
app.all('*', async (req, res, next) => {
    if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
        let token = req.headers.token
        let token_sql = " SELECT * FROM admin WHERE token = ?"
        try {
            let admin_result = await db.query(token_sql, [token])
            if (admin_result.length === 0) {
                res.send({
                    code: 403,
                    message: "请先登录"

                })
                return
            }
            next()
        } catch (err) {
            console.log(err)
        }
    } else {
        next()
    }
})

app.get('/', (req, res) => {
    res.send('hello world')
})
app.use('/test', require('./routers/TestRouter'))
app.use('/admin', require('./routers/AdminRouter'))
app.use('/category', require('./routers/CategoryRouter'))
app.use('/blog', require('./routers/BlogRouter'))
app.use('/upload', require('./routers/UploadRouter'))
// 监听端口
app.listen(port, () => {
    console.log(`服务端启动成功: http://localhost:${port}/`)
})
