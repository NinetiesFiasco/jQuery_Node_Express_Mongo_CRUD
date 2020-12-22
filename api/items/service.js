const { MongoClient, ObjectId } = require("mongodb")
const uri = "MONGO_URI=mongodb://127.0.0.1:27017?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true"

const DB = "CRUD_example", COLLECTION = "Items"


const err = (e) => ({
  success: 1,
  message: "Error",
  result: e.toString()
})
const success = (val) => ({
  success: 0,
  message: "OK",
  result: val
})

const add = async (data) => {
  let client,answer;
  try {
    client = await MongoClient.connect(uri)
    const collection = client.db(DB).collection(COLLECTION) 
    const result = await collection.insertOne(data)

    answer = success(result.ops[0])    
  } catch (e) {
    answer = err(e)
  } finally {
    if (client)
      await client.close()
  }

  return answer;
}

const count = async () => {
  let client,answer;
  try {
    client = await MongoClient.connect(uri)
    const collection = client.db(DB).collection(COLLECTION) 
    const result = await collection.countDocuments()

    answer = success(result)
  } catch (e) {
    answer = err(e)
  } finally {
    if (client)
      await client.close()
  }

  return answer;
}

const get = async (page,offset) => {
  let client,answer;
  try {
    client = await MongoClient.connect(uri)
    const collection = client.db(DB).collection(COLLECTION) 
    const result = await collection.find().skip((page-1)*offset).limit(offset).toArray()
    answer = success(result)
  } catch (e) {
    answer = err(e)
  } finally {
    if (client)
      await client.close()
  }

  return answer;
}

const _delete = async (id) => {
  let client,answer;
  try {
    client = await MongoClient.connect(uri)
    const collection = client.db(DB).collection(COLLECTION) 
    const result = await collection.deleteOne({"_id":ObjectId(id)})
    if (1 === result.deletedCount)
      answer = success("Запись с id: "+id+" успешно удалена")
    else if (result.deletedCount > 1)
      answer = success("Удалено больше одной записи")
    else 
      answer = success("Запись с таким id не найдена")
  } catch (e) {
    answer = err(e)
  } finally {
    if (client)
      await client.close()
  }

  return answer;
}

const update = async (id,updating) => {
  let client,answer;
  try {
    client = await MongoClient.connect(uri)
    const collection = client.db(DB).collection(COLLECTION) 
    const result = await collection.updateOne({"_id":ObjectId(id)},{$set:updating})    

    if (1 === result.modifiedCount)
      answer = success("Запись с id: "+id+" успешно обновлена")
    else if (result.modifiedCount > 1)
      answer = success("Обновлено больше одной записи")
    else 
      answer = success("Запись с таким id не найдена")

  } catch (e) {
    answer = err(e)
  } finally {
    if (client)
      await client.close()
  }

  return answer;
}

module.exports = {
  add,
  count,
  get,
  update,
  delete: _delete
}