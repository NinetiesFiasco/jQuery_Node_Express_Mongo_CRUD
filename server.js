
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000

// Статичные файлы лежат в папке static
app.use(express.static('static'))
// Промежуточный обработчик раскрывает данные формы
app.use(bodyParser.urlencoded({ extended:true }))

// API
app.use('/api', require('./api/api.js'))

// запуск сервера
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})