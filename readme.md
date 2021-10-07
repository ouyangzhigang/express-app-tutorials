## nodemon在开发环境

nodeman是一个开发环境能够自动重启线程工具，并且能够启动多个应用子线程

- 配置 nodemon.json

```
{
    "name": "node-demo",
    "restartable": "rs",
    "verbose": true,
    "env": {
        "NODE_ENV": "development",
        "PORT": 8877
    },
    "watch": [
        "src/"
    ],
    "events": {
        "restart": "echo \"restart...\""
    },
    "nodemonConfig": {
        "ignore": [".git", "node_modules/*"],
        "delay": 2555
    },
    "ext": "js json",
    "legacy-watch": false
}
```

- npm script启动

package.json
```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "npx nodemon ./src/app.js"
  }
```

`npm run start`


## web服务如何处理一个请求

`app 表示 application 实例`

url --> 网络 --> dns解析 --> 目标服务器 --> 处理逻辑/数据 --> 响应返回 --> 浏览器接收 --> 解析代码 --> 渲染/绘制
> 如何处理这个请求： 根据路由/规则/请求方式 --> req上取传惨，res处理返回
> 请求方式区分： 主要通过 get/post/head/option

```
const express = require('express')

const app = express()
const port = 8877

app.get('/', (req, res) => {
    console.log(req.query)

    res.send('hello word') 
    // res.json({niu: 'bi'})
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
```

## 通过uri/url定义和区分请求接口(路径)

- url ege：

    `https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=scratch&fenlei=256&oq=instantly&rsv_pq=87f75e9d000425a7&rsv_t=85bcwQf%2FWoJoRh%2FPEmyGndGqHYsD%2B3JC6yZO%2B%2FeEZWY%2FZJN6W%2BosBVfQf2g&rqlang=cn&rsv_enter=1&rsv_dl=tb&rsv_btype=t&inputT=3955&rsv_sug3=39&rsv_sug1=43&rsv_sug7=101&rsv_sug2=0&rsv_sug4=5018`


- 路由请求

```
// url/uri请求： get/post/put/delete

app.get('/get', (req, res) => {
    const { query } = req
    res.json(query)
})
app.post('/post', (req, res) => {
    const { name } = req.query
    res.json({name})
})

app.get('/user/id', (req, res) => {
    const { id } = req.query
    res.json({id})
})
app.get('/user/name', (req, res) => {
    const { name } = req.query
    res.json({name})
})

```

## 路由api使用
### app.all

- 需要定义一个api/路由 需要满足客户端 无论使用什么方式 都可以 实现

```
const express = require('express')

const app = express()

// 满足任何请求方式
app.all('/api/demo', (req, res) => {
    res.json({
        message: JSON.stringify(req.query),
        method: req.method
    })
})

app.listen(3000, () => {
    console.log('server run success!')
})
```

- 无论客户端使用任何uri，我们的服务都可以使用 》日志

```
app.all('*', (req, res) => {
    res.json({
        message: JSON.stringify(req.query),
        method: req.method,
        uri: req.path
    })
})

```

### app.use

- 局部中间件

```
app.use('/use', (req, res) => {
    res.json({
        message: JSON.stringify(req.query),
        method: req.method,
        uri: req.path
    })
})
```

- 全局中间件

```
app.use((req, res) => {
    res.json({
        message: JSON.stringify(req.query),
        method: req.method,
        uri: req.path
    })
})
```

## 如何进行路由拆分

- app.js
```
const express = require('express')

const app = express()
const port = 8877

const thatRouter = require('./route')

app.use('/that', thatRouter)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
```

- thatRouter
```
const express = require('express')

const router = express.Router()

// router的方法包含： post/get/all/use

router.get('/list', (req, res) => {
    res.json({
        list: [1,2,3,4,5]
    })
})

module.exports = router;
```

## 中间件介绍和使用

### 什么是中间件

中间件是一个可插可拔的设计结构

它是一个函数

处理异常、验证

处理下一个业务功能，通过next转交控制权

### 内置中间件和第三方中间件介绍

- app级别
```
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

app.use('/api', middleware)
```

- router 级别

that router
```
const express = require('express')

const router = express.Router()

router.use((req, res, next) => {
    console.log('that router middleware is run~')
    next()
})

router.get('/list', (req, res) => {
    res.json({
        list: [1,2,3,4,5]
    })
})

module.exports = router;
```

app
```
app.use('/that', thatRouter)
```

multiple middleware
```
router.get('/list', [/* multiple middleware */],  (req, res) => {
    res.json({
        list: [1,2,3,4,5]
    })
})
```


- log处理（app级别）

```
function log_middleware(req, res, next) {
    console.log('发起请求 =>', req.method, req.query, req.params, '请求结束 。 \n')
    next()
}

app.use(log_middleware)

```

- 静态中间件（内置）
```
// 加载一个static的中间件
app.use(express.static('static', {
    extensions: ['html', 'htm', 'js', 'css']
}))
```


### 自定义中间件

```
// one
function demo_middleware(req, res, next) {
    try {
        // mysql option
    } catch (err) {
        next(error)
    }
}

// two
Promise.then().catch(next)

// 被error中间件接收
app.use('/api', err_handler_middleware)
```

## 异常捕获

- 直接抛出

```
throw new Error('xxx')
```

- 中间件处理

定义中间件

```
function err_handler_middleware(err, req, res, next) {
    if (err) {
        res.status(500).json({ message: 'error' })
    } else {
        //
        next()
    }
}

function not_found_middleware(req, res, next) {
    res.json({
        message: '未找到'
    })
}
```

注册中间件
```
app.use('/api', err_handler_middleware)
app.use(not_found_middleware)
```


## mysql

>> 结构话数据库中的一种

>> 提供了数据存放的服务

>> 数据库划分数据：数据库 --> 表


- 安装mysql

> 进入官网

> installing mysql shell

> installing mysql shell on [system]

> mac install
install
`brew install mysql`

check
`brew list | grep mysql`

services
`brew services list`

stop
`brew services stop mysql`

start
`brew services start mysql`


- mysql use

launch
`mysql -u root`


sql databases
`show databases;`

select sql
`use [databases];`

tables
`show tables;`

select table
`select * from [table]`
`select count(*) from [table]`

- client
> navicat premium

> 嗨迪sql

> workbench

> sqlite


## nodejs sql

使用sequelize进行数据库连接，还有数据库的数据一系列操作

- 什么是ORM
`node app --> ORM --> node-mysql --> mysql db`

- sequelize作用
`数据库操作`

- 在nodejs应用中集成sequelize
`mysql2`
`sequelize-cli`


### reference

[pnpm](https://pnpm.io/cli/add)
[Sequelize](https://sequelize.org/master/)
[express](https://www.expressjs.com.cn/starter/hello-world.html)
[sequelize/cli](https://github.com/sequelize/cli)