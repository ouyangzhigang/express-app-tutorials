const express = require('express')

const router = express.Router()

router.use((req, res, next) => {
    console.log('that router middleware is run~')
    next()
})

router.get('/list', [/* multiple middleware */],  (req, res) => {
    res.json({
        list: [1,2,3,4,5]
    })
})

module.exports = router;