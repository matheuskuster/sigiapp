var BASE_URL = 'http://localhost:3000'
var list = []
var committeID = null
var userID = null
var socket = io()
var started = null;
var time = null;

function getUserIdFromNJK (id) {
  userID = id
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

function getIn () {
  $.ajax({
    method: 'GET',
    url: '/list/push/' + userID + '/' + committeID,
    success: data => {},
    error: data => {
      swal({
        title: 'Impossível',
        text: data.responseJSON.error,
        icon: 'error'
      })
    }
  })
}

function renderSocketList (data) {
  list = data

  $('#botOrPeq').show()
  $('#posicaoLiPeq').hide()
  $('#botO').show()
  $('#posicaoL').hide()

  if (list.length == 0) {
    $('.emptyList').show()
    $('#delegacaoFalando').hide()
  } else {
    $('.emptyList').hide()
    $('#listaOradores').html('')

    list.forEach(({ _id, delegation }, index) => {
      if (_id == userID) {
        $('#posicaoLiPeq').html(`${index + 1}º`)
        $('#botOrPeq').hide()
        $('#posicaoLiPeq').show()

        $('#posicaoL').html(`POSIÇÃO: ${index + 1}º`)
        $('#botO').hide()
        $('#posicaoL').show()
      }

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

function initDebateTimer(debateTime, debateStarted) {
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
  if (seconds < 0) {
    seconds *= -1
  }

  if(minutes == 0 && seconds > 0) {
    $('#minutes').html(`-${minutes.toString().padStart(2, '0')}`)
  }

  $('#minutes').html(minutes.toString().padStart(2, '0'))
  $('#seconds').html(seconds.toString().padStart(2, '0'))
}

socket.on('list', data => {
  renderSocketList(data)
})

socket.on('reload', data => {
  document.location.reload(true)
})
