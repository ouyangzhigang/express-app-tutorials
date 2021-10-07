const express = require('express')

const app = express()
const port = 8877

const thatRouter = require('./route')

app.use('/that', thatRouter)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})