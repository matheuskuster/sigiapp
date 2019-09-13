var interval
var segundo = 0 + '0'
var minuto = 0 + '0'
var winW = $(window).width()
var winH = $(window).height()

var recent = []
var committeID = null
var BASE_URL = 'http://sigiapp.serra.ifes.edu.br'
var list = null
var socket = io()

var aux = 0
var contEsp = 0

var time = null
var started = null

$('#iniciarsessao').show()
$('#iniciada').hide()
$('#favorContraList').hide()

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

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
    $('#zerar').click()
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

function vote () {
  const checkboxes = document.querySelectorAll('.vote')

  checkboxes.forEach(c => {
    c.addEventListener('click', function () {
      renderVoteNumbers()
      enableButton()
    })
  })

  document.querySelector('.voteResult').addEventListener('click', function () {
      showResult()
  })

  function enableButton() {
    const favorCheckboxes = document.querySelectorAll('.af:checked')
    const againstCheckboxes = document.querySelectorAll('.co:checked')
    const rightFavorCheckboxes = document.querySelectorAll('.fd:checked')
    const rightAgainstCheckboxes = document.querySelectorAll('.cd:checked')
    const absCheckboxes = document.querySelectorAll('.ab:checked')

    if(favorCheckboxes.length + againstCheckboxes.length + rightFavorCheckboxes.length + rightAgainstCheckboxes.length + absCheckboxes.length == (checkboxes.length / 5)) {
      $('.voteResult').attr('disabled', false)
    }
  }

  function showResult() {
    const favorCheckboxes = document.querySelectorAll('.af:checked')
    const againstCheckboxes = document.querySelectorAll('.co:checked')
    const rightFavorCheckboxes = document.querySelectorAll('.fd:checked')
    const rightAgainstCheckboxes = document.querySelectorAll('.cd:checked')
    const absCheckboxes = document.querySelectorAll('.ab:checked')

    const favorCountry = document.querySelectorAll('.country-af-true:checked')
    const rightFavorCountry = document.querySelectorAll('.country-fd-true:checked')
    const favorCountryVotes = favorCountry.length + rightFavorCountry.length

    const simple = parseInt(document.querySelector('#mSimples').innerHTML)
    const qualify = parseInt(document.querySelector('#mQualificada').innerHTML)

    const favorVotes = favorCheckboxes.length + rightFavorCheckboxes.length

    if(favorVotes >= simple) {
      $('.simple').html('<p>Maioria Simples</p><i class="fas fa-check" style="color: #36C1B6"></i>')
    } else {
      $('.simple').html('<p>Maioria Simples</p><i class="fas fa-times" style="color: #ff3838"></i>')
    }

    if(favorCountryVotes >= qualify) {
      $('.qualify').html('<p>Maioria Qualificada</p><i class="fas fa-check" style="color: #36C1B6"></i>')
    } else {
      $('.qualify').html('<p>Maioria Qualificada</p><i class="fas fa-times" style="color: #ff3838"></i>')
    }

    const rightFavorNames = []
    const rightAgainstNames = []

    rightFavorCheckboxes.forEach(c => {
      rightFavorNames.push(c.dataset.delegation)
    })

    rightAgainstCheckboxes.forEach(c => {
      rightAgainstNames.push(c.dataset.delegation)
    })

    if(rightFavorNames.length == 0) {
      $('.right-favor').html('<li>NENHUM</li>')
    } else {
      rightFavorNames.map(r => {
        $('.right-favor').append(`<li>${r.toUpperCase()}</li>`)
      })
    }

    if(rightAgainstNames.length == 0) {
      $('.right-against').html('<li>NENHUM</li>')
    } else {
      rightAgainstNames.map(r => {
        $('.right-against').append(`<li>${r.toUpperCase()}</li>`)
      })
    }

    const chart = new CanvasJS.Chart("chartContainer",
	  {
      animationEnabled: true,
      theme: "light2",		
      data: [
      {       
        type: "pie",
        toolTipContent: "{y} - #percent %",
        showInLegend: true,
        legendText: "{indexLabel}",
        dataPoints: [
          {  y: favorCheckboxes.length, indexLabel: "Favor" },
          {  y: againstCheckboxes.length, indexLabel: "Contra" },
          {  y: rightFavorCheckboxes.length, indexLabel: "Favor D." },
          {  y: rightAgainstCheckboxes.length, indexLabel: "Contra D."},
          {  y: absCheckboxes.length, indexLabel: "Abstenção" }
        ]
      }
      ]
    });

    chart.render()
  }

  function renderVoteNumbers () {
    const favorCheckboxes = document.querySelectorAll('.af:checked')
    const againstCheckboxes = document.querySelectorAll('.co:checked')
    const rightFavorCheckboxes = document.querySelectorAll('.fd:checked')
    const rightAgainstCheckboxes = document.querySelectorAll('.cd:checked')
    const absCheckboxes = document.querySelectorAll('.ab:checked')


    $('#nmrAF').html(favorCheckboxes.length + rightFavorCheckboxes.length)
    $('#nmrCO').html(againstCheckboxes.length + rightAgainstCheckboxes.length)
    $('#nmrAB').html(absCheckboxes.length)
  }
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

function setDebate () {
  $('.navbar').css('background-color', '#FAA98B')
  $('.paineldeControle').css('background-color', '#FAA98B')
  $('.icones').css('background-color', '#FAA98B')
  $('.botControlesMobile').css('background-color', '#FAA98B')
  $('.botMoreOptionsMobile').css('background-color', '#FAA98B')
  $('.activeNavIcon>a').css('color', '#FAA98B')
  $('.naveg').addClass('crisis')
  $('.naveg2').addClass('crisis')
}

function initTimer(debateTime, debateStarted) {
  started = debateStarted
  time = debateTime

  setDebateTimer()
  setInterval(setDebateTimer, 1000)
}

function setDebateTimer () {
  const finishTime = moment(started).add(time, 'minutes')
  const diff = finishTime.diff(moment(), 'milliseconds', true)
  const timer = moment.duration(diff)

  const minutes = parseInt(timer.minutes())
  let seconds = parseInt(timer.seconds())
  

  //console.log(minutes, seconds)

  if(minutes == 0 && seconds < 0) {
    seconds *= -1
    $('#minutes').html(`-${minutes.toString().padStart(2, '0')}`)
  } else {
    if (seconds < 0) {
      seconds *= -1
    } 

    $('#minutes').html(minutes.toString().padStart(2, '0'))
  }
  
  $('#seconds').html(seconds.toString().padStart(2, '0'))
}

call()
vote()
renderRecentDelegations()
socket.on('list', data => {
  renderSocketList(data)
})
