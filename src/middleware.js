const express = require('express')

const app = express()

/*
function demo_middleware(err, req, res, next) {
    // 异常
    // 请求
    // 响应
    // 转交控制权
}
**/

function middleware(req, res, next) {
    const { name } = req.query
    if (!name) {
        res.status(403).json({ message: '缺少必要参数' })
    } else {
        next()
    }
}

function log_middleware(req, res, next) {
    console.log('发起请求 =>', req.method, req.query, req.params, '请求结束 。 \n')
    next()
}

app.use(log_middleware)

app.use('/api', middleware)

// 加载一个static的中间件
app.use(express.static('static', {
    extensions: ['html', 'htm', 'js', 'css']
}))

// route
app.get('/test', (req, res) => {
    res.json({
        message: 'test'
    })
})

app.listen(3000, () => {
    console.log('server is runing')
})