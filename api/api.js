const express = require('express')
const router = express.Router()
const items = require('./items/router')

// Сбор всего API в одном месте
router.use('/items', items)

module.exports = router