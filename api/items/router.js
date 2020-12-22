
var express = require('express')
var router = express.Router()
var controller = require('./controller')

// Привязка запросов к обработчикам
router.post('/', controller.add)                // Добавить
router.get('/count', controller.count)          // Получить общее кол-во
router.get('/:page/:offset', controller.get)    // Получить записи по нужной странице и кол-ву
router.delete('/:id',controller.delete)         // Удалить запись по ID
router.put('/:id',controller.update)            // Обновить запись

module.exports = router