const service = require('./service')

// Добавить
const add = async (req,res) => {
  const data = req.body

  const answer = await service.add(data)
  res.json(answer)
}

// Общее количество
const count = async (req,res) => {
  const answer = await service.count()
  res.json(answer)
}

// Получить записи по странице и кол-ву
const get = async (req,res) => {
  const page = parseInt(req.params.page)
  const offset = parseInt(req.params.offset)

  const answer = await service.get(page,offset)
  res.json(answer)
}

// Удалить по ID
const _delete = async (req,res) => {
  const id = req.params.id

  const answer = await service.delete(id)
  res.json(answer)
}

// Обновить по ID
const update = async (req,res) => {
  const id = req.params.id
  const updating = req.body

  const answer = await service.update(id,updating)
  res.json(answer)
}

module.exports = {
  add,
  count,
  get,
  update,
  delete: _delete
}