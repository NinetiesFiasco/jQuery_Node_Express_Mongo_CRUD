// Переменные под контролы
let 
  $add,$addResult,
  $count,$countResult,
  $get,$getPage,$getOffset,$getResult,
  $thead,$tbody,$tfoot,
  $deleteResult,
  $rTitle,$rCount,$rComment,
  $hiddenId,$bSave,$bCancel,
  $redactResult,$redactorTab

// Количество ячеек в таблице с данными
let tabSpan = 8

// Функция входа
$(()=>{
  fillVaryables()
  $add.click(addClick)
  $count.click(countClick)
  $get.click(getClick)
  $bSave.click(saveRedacted)
  $bCancel.click(cancelRedacted)
})

// Присваиваем контролы переменным
const fillVaryables = ()=>{
  $add = $("#add")
  $addResult = $("#addResult")
  $count = $("#count")
  $countResult = $("#countResult")
  $get = $("#get")
  $getPage = $("#getPage")
  $getOffset = $("#getOffset")
  $getResult = $("#getResult")
  $thead = $(".dataTab thead").first()
  $tbody = $(".dataTab tbody").first()
  $tfoot = $(".dataTab tfoot").first()
  $deleteResult = $("#deleteResult")
  $rTitle = $("#rTitle")
  $rCount = $("#rCount")
  $rComment = $("#rComment")
  $hiddenId = $("#hiddenId")
  $bSave = $("#bSave")
  $bCancel = $("#bCancel")
  $redactResult = $("#redactResult")
  $redactorTab = $(".redactorTab").first()
}

// Добавить новую запись в БД
const addClick = () => {
  clearRedactedForm()
  $redactorTab.show()
}

// Сохранить новую запись
const saveNew = () => {  
  if ("" !== $hiddenId.val())
    return;

  const data = {
    title: $rTitle.val(),
    count: $rCount.val(),
    text: $rComment.val(),
    date: Date.now()
  }

  $.ajax({
    method: 'post',
    url: 'api/items/',
    data: data,
    success: (answer) => {
      if (0===answer.success)
        $addResult.text("Запись добавилась: "+answer.message)
      else 
        $addResult.text("Ошибка: "+answer.result)
      console.log(answer)
    }
  })
}

// Получить общее кол-во элементов (для разбиения по страницам)
const countClick = () => {
  $.ajax({
    method: 'get',
    url: 'api/items/count',
    success: (answer) => {
      if (0===answer.success){
        $countResult.text("Кол-во записей: "+answer.result)
        fillTFoot(parseInt(answer.result))
      }
      else 
        $countResult.text("Ошибка: "+answer.result)
      console.log(answer)
    }
  })
}

// Отрисовать подвал с ссылками на страницы
const fillTFoot = (totalCount) => {
  const offset = parseInt($getOffset.val())
  let pagesCount = Math.ceil(totalCount/offset)
     
  let pages  = '';
  for (let i = 1; i <= pagesCount; i++)
    pages += "<div class='page'>"+i+"</div>"

  $tfoot.html(`<tr><td colspan=`+tabSpan+`>`+pages+`</td></tr>`)

  // Клик по странице
  $(".page").click(function(){
    const page = $(this).text()
    $getPage.val(page)
    getClick();
  })
}

// Получить записи по указанной странице и кол-вом записей на страницу
const getClick = () => {
  $.ajax({
    method: 'get',
    url: 'api/items/'+$getPage.val()+"/"+$getOffset.val(),
    success: (answer) => {
      if (0===answer.success){
        $getResult.text("Записи пришли в кол-ве: "+answer.result.length)
        fillTBody($tbody,answer.result)
      }
      else 
        $getResult.text("Ошибка: "+answer.result)
      console.log(answer)
    }
  })
}

// Удалить запись по ID
const deleteFnc = function () {
  const id = $(this).attr('x-data-id')
  $.ajax({
    method: 'delete',
    url: 'api/items/' + id,
    success: (answer) => {
      if (0===answer.success){
        $deleteResult.text("Запись успешно удалена: "+answer.result)
      }
      else 
        $deleteResult.text("Ошибка: "+answer.result)
      console.log(answer)
    }
  })
}

// Начать редактировать запись
const startRedact = function() {
  const $that = $(this)
  const $row = $that.closest('tr')
  
  const id= $that.attr('x-data-id')
  $hiddenId.val(id)

  if ("" !== id)
    $redactorTab.show()


  const title = $('.title',$row).first().text()
  const count = $('.count',$row).first().text()
  const text = $('.text',$row).first().text()

  $rTitle.val(title)
  $rComment.val(text)
  $rCount.val(count)

}

// Отрисовать полученные из БД записи в теле таблицы
const fillTBody = ($target,array) => {
  $target.html("")
  for (const el in array) {
    const $tr = $("<tr>")
    $tr.append("<td>"+(parseInt(el)+1)+"</td>")
    $tr.append("<td>"+array[el]._id+"</td>")
    $tr.append("<td class='title'>"+array[el].title+"</td>")
    $tr.append("<td class='count'>"+array[el].count+"</td>")
    $tr.append("<td class='text'>"+array[el].text+"</td>")
    $tr.append("<td>"+array[el].date+"</td>")
    $tr.append("<td><input type='button' value='Удалить' x-data-id='"+array[el]._id+"' class='delete' /></td>")
    $tr.append("<td><input type='button' value='Редактировать' x-data-id='"+array[el]._id+"' class='redact' /></td>")
    $target.append($tr)
  }

  $thead.html(`
<tr>
  <th colspan='`+tabSpan+`'>Записи</th>
</tr>
<tr>
  <th>№</th>
  <th>ID</th>
  <th>Заголовок</th>
  <th>Кол-во</th>
  <th>Комментарий</th>
  <th>Дата</th>
  <th>Удалить</th>
  <th>Редактировать</th>
</tr>`)

  $('.redact').click(startRedact)
  $('.delete').click(deleteFnc)

  countClick()
}

// Кнопка сохранить в редакторе (либо добавляет новую либо обновляет существующую запись)
const saveRedacted = () => {  
  const id = $hiddenId.val()
  if ("" === id)
    saveNew()
  else 
    saveUpdated(id)
}

// Обновить существующую запись по ID
const saveUpdated = (id) => {
  const data = {
    title: $rTitle.val(),
    count: $rCount.val(),
    text: $rComment.val()
  }

  $.ajax({
    method: 'put',
    url: 'api/items/'+id,
    data: data,
    success: (answer) => {
      if (0===answer.success)
        $redactResult.text("Обновление: "+answer.result)
      else 
        $redactResult.text("Ошибка: "+answer.result)
      console.log(answer)
    }
  })  
}

// Закрыть редактор (по кнопке отмена)
const cancelRedacted = () => {
  clearRedactedForm()
  $redactorTab.hide()
}
// Очистить форму редактора
const clearRedactedForm = () => {
  $hiddenId.val("")
  $rCount.val("")
  $rComment.val("")
  $rTitle.val("")
}