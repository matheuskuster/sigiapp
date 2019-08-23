var interval
var segundo = 0 + '0'
var minuto = 0 + '0'
var winW = $(window).width()
var winH = $(window).height()
var listVote = []
var listPresent = []
var allVotes = []
var atualVote = ''

var recent = []
var committeID = null
var BASE_URL = 'http://sigiapp.serra.ifes.edu.br'
var list = null
var socket = io()

var aux = 0
var contEsp = 0

$('#iniciarsessao').show()
$('#iniciada').hide()
$('#favorContraList').hide()

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

function listSetVote () {
  $('#listVote').html('')
  for (var i = 0; i < listPresent.length; i++) {
    ind = listPresent[i]
    listVote.push(
      '<div class="line"><div class="nD">' +
        selList[ind] +
        '</div><div class="options"><label class="checkNec"><input type="radio" id="af' +
        i +
        '" name="v' +
        i +
        '" onclick="voteControl(' +
        i +
        ')"><span class="checkmark"></span></label><label class="checkNec"><input type="radio" id="co' +
        i +
        '" name="v' +
        i +
        '" onclick="voteControl(' +
        i +
        ')"><span class="checkmark"></span></label> <label class="checkNec"><input type="radio" id="fd' +
        i +
        '" name="v' +
        i +
        '" onclick="voteControl(' +
        i +
        ')"><span class="checkmark"></span></label><label class="checkNec"><input type="radio" id="cd' +
        i +
        '" name="v' +
        i +
        '" onclick="voteControl(' +
        i +
        ')"><span class="checkmark"></span></label><label class="checkNec"><input type="radio" id="ab' +
        i +
        '" name="v' +
        i +
        '" onclick="voteControl(' +
        i +
        ')"><span class="checkmark"></span></label></div></div>'
    )
    $('#listVote').append(listVote[i])
  }
}

function voteControl (id) {
  var af = $("input[id='af" + id + "']:checked").val()
  var co = $("input[id='co" + id + "']:checked").val()
  var fd = $("input[id='fd" + id + "']:checked").val()
  var cd = $("input[id='cd" + id + "']:checked").val()
  var ab = $("input[id='ab" + id + "']:checked").val()

  if (af) {
    atualVote = 'af'
  }
  if (co) {
    atualVote = 'co'
  }
  if (fd) {
    atualVote = 'fd'
  }
  if (cd) {
    atualVote = 'cd'
  }
  if (ab) {
    atualVote = 'ab'
  }

  if (atualVote != allVotes[id]) {
    if (atualVote == 'af' && allVotes[id] != 'fd') {
      votes(id)
    }
    if (atualVote == 'fd' && allVotes[id] != 'af') {
      votes(id)
    }
    if (atualVote == 'co' && allVotes[id] != 'cd') {
      votes(id)
    }
    if (atualVote == 'cd' && allVotes[id] != 'co') {
      votes(id)
    }
    if (atualVote == 'ab') {
      votes(id)
    }
  }
}

function votes (id) {
  if (atualVote == 'co' || atualVote == 'cd') {
    if (allVotes[id] == 'af' || (allVotes[id] == 'fd' && nmrAF > 0)) {
      nmrAF--
    }
    if (allVotes[id] == 'ab' && nmrAB > 0) {
      nmrAB--
    }
    nmrCO++
  }
  if (atualVote == 'af' || atualVote == 'fd') {
    if (allVotes[id] == 'co' || (allVotes[id] == 'cd' && nmrCO > 0)) {
      nmrCO--
    }
    if (allVotes[id] == 'ab' && nmrAB > 0) {
      nmrAB--
    }
    nmrAF++
  }

  if (atualVote == 'ab') {
    if (allVotes[id] == 'af' || (allVotes[id] == 'fd' && nmrAF > 0)) {
      nmrAF--
    }
    if (allVotes[id] == 'co' || (allVotes[id] == 'cd' && nmrCO > 0)) {
      nmrCO--
    }
    nmrAB++
  }

  allVotes[id] = atualVote

  $('#nmrAF').text(nmrAF)
  $('#nmrCO').text(nmrCO)
  $('#nmrAB').text(nmrAB)
}

function tempo () {
  if (segundo < 59) {
    segundo++
    if (segundo < 10) {
      segundo = '0' + segundo
    }
  } else if (segundo == 59 && minuto < 59) {
    segundo = 0 + '0'
    minuto++
    if (minuto < 10) {
      minuto = '0' + minuto
    }
  }

  $('#tempoCronometro').val(minuto + ':' + segundo)
}

function menuCronometro (opt) {
  if (opt == 1 && aux == 0) {
    $('#play').hide()
    $('#playMob').hide()
    $('#pauseBox').css('display', 'inline')
    $('#pauseBoxMob').css('display', 'inline')
    interval = setInterval(tempo, 1000)
    tempo()
    aux = 1
  }

  if (opt == 2) {
    clearInterval(interval)
    $('#pauseBox').css('display', 'none')
    $('#pauseBoxMob').css('display', 'none')
    $('#play').show()
    $('#playMob').show()
    tempoAtual = $('#tempoCronometro').val()
    $('#tempoCronometro').val(tempoAtual)
    aux = 0
  }

  if (opt == 3) {
    clearInterval(interval)
    $('#tempoCronometro').val('00:00')
    segundo = '00'
    minuto = '00'
    // proximo();
    aux = 0
  }

  if (opt == 4) {
    clearInterval(interval)
    $('#pauseBox').css('display', 'none')
    $('#pauseBoxMob').css('display', 'none')
    $('#play').show()
    $('#playMob').show()
    $('#tempoCronometro').val('00:00')
    segundo = '00'
    minuto = '00'
    aux = 0
  }
}

$(document).keypress(function (e) {

  if (contEsp == 0) {
    if (e.which == 32) $('#play').click()
    contEsp = 1
  } else {
    if (e.which == 32) $('#pause').click()
    contEsp = 0
  }
  if (e.which == 13) $('#proximo').click()

  if (e.which == 122) $('#zerar').click()
})

function emendaList () {
  $('#delegacaoFalando').hide()
  $('#listaOradores').hide()
  $('#favorContraList').show()
}

function call () {
  const checkboxes = document.querySelectorAll('.check')

  checkboxes.forEach(c => {
    c.addEventListener('click', function () {
      renderCallNumbers()
    })
  })

  function renderCallNumbers () {
    const ausencyCheckboxes = document.querySelectorAll('.a:checked')
    const presentCheckboxes = document.querySelectorAll('.p:checked')
    const votingPresentCheckboxes = document.querySelectorAll('.pv:checked')

    $('#nmrA').html(ausencyCheckboxes.length)
    $('#nmrP').html(presentCheckboxes.length)
    $('#nmrPv').html(votingPresentCheckboxes.length)
  }
}

function getCommitteIdFromNJK (id) {
  console.log(id)
  committeID = id
  renderList()
  joinSocketRoom()
}

function joinSocketRoom () {
  socket.emit('connectRoom', committeID)
}

function renderList () {
  $.ajax({
    method: 'GET',
    url: '/list/' + committeID,
    success: data => {
      renderSocketList(data)
    }
  })
}

function nextDelegation () {
  $.ajax({
    method: 'GET',
    url: '/list/next/' + committeID,
    success: data => {
      // RENDERIZAR LISTA (LOCAL OU DAR UM GET???)
    }
  })
}

function previousDelegation () {
  $.ajax({
    method: 'GET',
    url: '/list/previous/' + committeID,
    success: data => {
      // RENDERIZAR LISTA (LOCAL OU DAR UM GET???)
    },
    error: data => {
      if (data.responseJSON.id == 1) {
        Swal.fire({
          title: 'Impossível',
          text: 'Não há nenhuma delegação anterior!',
          type: 'error',
          confirmButtonColor: '#36c1b6',
          confirmButtonText: 'Fechar'
        })
      } else if (data.responseJSON.id == 0) {
        Swal.fire({
          title: 'Impossível',
          text:
            'A última delegação a sair da lista de oradores já se encontra na mesma novamente!',
          type: 'error',
          confirmButtonColor: '#36c1b6',
          confirmButtonText: 'Fechar'
        })
      }
    }
  })
}

function renderSocketList (data) {
  list = data

  if (list.length == 0) {
    $('.emptyList').show()
    $('.time').hide()
    $('#listaOradores').html('')
    $('#delegacaoFalando').hide()
  } else {
    $('.emptyList').hide()
    $('.time').show()
    $('#listaOradores').html('')

    list.forEach(({ delegation }, index) => {
      if (index == 0) {
        const speakingHTML = `
            <center>
              <img src="${
  delegation.flag
}" class="img-responsive bandeira1" alt="${
  delegation.name
}" id="bandeira1" draggable="false">
            </center>
            <div class="nome1">${delegation.name}</div>
          `

        $('#delegacaoFalando').html(speakingHTML)
      } else {
        const nextHTML = `
            <div class="flex-item-box">
              <div class="ordemDefault">${index + 1}º</div>
              <img src="${
  delegation.flag
}" class="img-responsive bandDefault" alt="${
  delegation.name
}" id="bandeira1">
              <div class="nomeDefault">${delegation.name}</div>
            </div>
          `

        $('#listaOradores').append(nextHTML)
      }
    })

    $('#listaOradores').show()
    $('#delegacaoFalando').show()
  }
}

$('.shut_session>button').click(e => {
  e.preventDefault()

  Swal.fire({
    title: 'Tem certeza?',
    text:
      'Todas as listas de oradores são excluídas. Você não poderá desfazer essa ação!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#36c1b6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Sim, encerrar!'
  }).then(result => {
    if (result.value) {
      $(`.shut_session`).submit()
    }
  })
})

$('.crisis-button').click(e => {
  e.preventDefault()

  Swal.fire({
    title: 'Tem certeza?',
    text: 'A tela de visualização mostrará apenas a descrição e o tempo restante. A lista de oradores continuará funcionando normalmente para os diretores e delegados.',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#36c1b6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Sim, entrar!'
  }).then(result => {
    if (result.value) {
      $('#crisis-form').submit()
    }
  })
})

function renderRecentDelegations () {
  if (recent.length == 0) {
    $('.recent_title').hide()
    $('#listRecentDelegations').hide()
  } else {
    $('.recent_title').show()
    $('#listRecentDelegations').html('')

    recent.map(rec => {
      const html = `
      <div class="line">
        <div class="nD">
          <a href="" style="font-family: 'Quicksand'; font-size: 22px; text-decoration: none" class="nD" onclick="addDelegation(this,'${
  rec.id
}')" data-dismiss="modal">${rec.name}</a>
        </div>
      </div>
      `

      $('#listRecentDelegations').append(html)
    })

    $('#listRecentDelegations').show()
  }
}

function addDelegation (e, id) {
  recent = recent.filter(rec => rec.id != id)

  recent.push({ name: e.innerHTML, id })

  $.ajax({
    url: `/list/push/${id}/${committeID}`,
    method: 'GET',
    success: data => {
      renderRecentDelegations()
    }
  })
}

function setCrisis () {
  $('.navbar').css('background-color', '#ff3838')
  $('.paineldeControle').css('background-color', '#ff3838')
  $('.icones').css('background-color', '#ff3838')
  $('.botControlesMobile').css('background-color', '#ff3838')
  $('.botMoreOptionsMobile').css('background-color', '#ff3838')
  $('.activeNavIcon>a').css('color', '#ff3838')
  $('.naveg').addClass('crisis')
  $('.naveg2').addClass('crisis')
}

call()
renderRecentDelegations()
socket.on('list', data => {
  renderSocketList(data)
})
