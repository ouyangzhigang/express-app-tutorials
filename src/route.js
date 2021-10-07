const express = require('express')

const router = express.Router()

// router的方法包含： post/get/all/use

router.get('/list', (req, res) => {
    res.json({
        list: [1,2,3,4,5]
    })
})

module.exports = router;