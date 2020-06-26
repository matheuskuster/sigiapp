var searchForm = $('#search-form')
var companyInput = $('#search_companie_name')
var apiResponse
var BASE_SEARCH_URL =
  'https://autocomplete.clearbit.com/v1/companies/suggest?query='

// var BASE_URL = 'http://sigiapp.serra.ifes.edu.br'
var BASE_URL = 'http://localhost:3000'

try {
  var delegations_checkbox_list =
    document.forms['delegations-form'].elements['delegations[]']
} catch {
  var delegations_checkbox_list = null
}

var checkboxObject = $('.delegation-checkbox')

var principalTopicsNumber = 1

var principalTopics = []

$('#form-request').submit(e => {
  e.preventDefault()
  var name = $('#delegation-name').val()

  $.ajax({
    method: 'GET',
    url: '/app/delegation/ask/' + name,
    success: data => {
      $('.modal').modal('hide')
      swal({
        title: 'Delegação solicitada!',
        icon: 'success',
        text: `A delegação ${name} será adicionada automaticamente ao seu comitê o mais breve possível. Continue escolhendo o restante das delegações. Obrigado!`
      })
    },
    error: data => {
      console.log(data)
    }
  })
})

checkboxObject.click(e => {
  countCheckedDelegations()
})

searchForm.submit(e => {
  e.preventDefault()
  const searchTerm = companyInput.val()

  $.ajax({
    method: 'GET',
    url: BASE_SEARCH_URL + searchTerm,
    success: data => {
      if (data.length == 0) {
        swal({
          title: 'Não encontrado!',
          icon: 'warning',
          text: `Tem certeza que você digitou o que procurava corretamente?`
        })
      } else {
        $('.formToHide').hide()
        $('.searchResult').show()
        apiResponse = data
        var html = ''

        apiResponse.map((res, index) => {
          html += `<li>
                  <a onclick="subscribeDelegation(${index})">
                    <img src="${res.logo}" alt="" />
                    <p>${res.name.toUpperCase()}</p>
                  </a>
                </li>`
        })

        $('.result-list').html(html)
      }
    }
  })
})

function subscribeDelegation(i) {
  const choosed = apiResponse[i]

  const code = generateDelegationCode(choosed)

  const json = {
    name: choosed.name,
    code: code,
    flag: choosed.logo
  }

  $.ajax({
    method: 'POST',
    url: '/delegation/store',
    dataType: 'json',
    data: json,
    success: data => {
      const html = `<li>
                      <div class="img-name">
                        <img class="delegation-img" src="${data.flag}" alt="${
        data.name
        } FLAG"/>
                        <p>${data.name}</p>
                      </div>

                      <input class="form-radio delegation-checkbox" type="checkbox" name="delegations[]" value="${
        data._id
        }" checked/>
                    </li>`

      $('.delegations-list').append(html)
      countCheckedDelegations()

      $('.formToHide').show()
      $('.searchResult').hide()
      $('.result-list').html('')

      swal({
        title: 'Delegação cadastrada!',
        icon: 'success',
        text: `Obrigado por ajudar a SiGI cadastrando novas delegações em nosso sistema, ${
          choosed.name
          } foi adicionado a lista e já está marcado para você :)`
      })
    },
    error: data => {
      swal({
        title: 'Delegação não cadastrada!',
        icon: 'error',
        text: `Aparentemente a delegação ${
          choosed.name
          } já está cadastrada em nosso sistema. Caso acredite que não, selecione a opção NÃO ENCONTREI.`
      })
    }
  })
}

function generateDelegationCode(choosed) {
  const domain = choosed.domain.split('.')
  let code = ''
  let iterations = 0

  domain.map(d => {
    if (d != 'com' && iterations < 2) {
      code += d
      iterations += 1
    }
  })

  return code
}

function returnSearch() {
  $('.formToHide').show()
  $('.searchResult').hide()
  $('.result-list').html('')
}

function countCheckedDelegations() {
  let checked = 0

  for (var i = 0; i < delegations_checkbox_list.length; i++) {
    if (delegations_checkbox_list[i].checked) {
      checked += 1
    }
  }

  $('.delegations-number').html(checked)
}

function oneMoreTopic() {
  principalTopicsNumber += 1
  renderTopics()
}

function renderTopics() {
  let html = ''

  html += `<li>
              <input
                class="topic"
                type="text"
                name=""
                id="topic-${principalTopicsNumber}"
                placeholder="Tópico ${principalTopicsNumber}"
              />
              <input
                class="n-sub"
                type="number"
                placeholder="Subtópicos"
                min="0"
                max="10"
                id="subtopic-number-${principalTopicsNumber}"
              />
            </li>`

  $('#topics-list').append(html)
}

function setTopics() {
  var render = true

  for (let i = 1; i <= principalTopicsNumber; i++) {
    var title = $(`#topic-${i}`).val()
    var subtopicsNumber = $(`#subtopic-number-${i}`).val()

    if (title == '' || subtopicsNumber == '') {
      render = false
      break
    }

    var data = {
      title,
      subtopicsNumber,
      subtopics: []
    }

    principalTopics.push(data)
  }

  if (render) {
    renderSubTopics()
  } else {
    swal({
      title: 'Campos não preenchidos!',
      text: 'Por favor, preencha os campos de todos os tópicos.',
      icon: 'warning'
    })
  }
}

function renderSubTopics() {
  $('.topics-title').html('SUBTÓPICOS')
  $('#topics-list').hide()
  $('.create').hide()
  $('#sub-button').hide()
  $('#finish-button').show()
  $('.plus').css('justify-content', 'flex-end')

  let html = ''

  principalTopics.map((topic, index) => {
    let subHtml = ''

    for (let i = 1; i <= topic.subtopicsNumber; i++) {
      subHtml += `
                <li>
                  <p>${index + 1}.${i}</p>
                  <input id="subtopic-${index +
        1}-${i}" type="text" placeholder="Subtópico ${index +
        1}.${i}" />
                </li>
      `
    }

    html += `<li>
              <p>${index + 1}. ${topic.title}</p>
              <ul>
                ${subHtml}
              </ul>
            </li>`
  })

  $('#subtopics-list').html(html)
  $('#subtopics-list').show()
}

function sendSchedule() {
  principalTopics.map((topic, index) => {
    for (let i = 1; i <= topic.subtopicsNumber; i++) {
      var value = $(`#subtopic-${index + 1}-${i}`).val()
      topic.subtopics.push(value)
    }
  })

  var json = {
    topics: principalTopics
  }

  $.ajax({
    method: 'POST',
    url: '/app/committe/schedule',
    dataType: 'json',
    data: json,
    success: data => {
      location.reload()
    }
  })
}

function notify() {
  swal({
    text:
      'Estamos trabalhando a todo vapor para lhes trazer uma experiência nova, moderna e tecnológica para que a SiGI cresça cada vez mais. Fique tranquilo, você será notificado quando as próximas funcionalidades estiverem disponíveis. Obrigado pela compreensão!',
    icon: 'warning',
    title: 'Estamos correndo!'
  })
}

function generateUsers() {
  $.ajax({
    method: 'GET',
    url: '/app/committe/users',
    success: data => {
      window.location.href = '/app/users'
    }
  })
}

renderTopics()
