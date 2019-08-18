var BASE_URL = 'http://localhost:3000'
var list = []
var committeID = null
var userID = null
var socket = io()

function getUserIdFromNJK(id) {
  userID = id
}

function getCommitteIdFromNJK(id) {
  committeID = id
  renderList()
  joinSocketRoom()
}

function joinSocketRoom() {
  socket.emit('connectRoom', committeID)
}

function renderList() {
  $.ajax({
    method: 'GET',
    url: '/list/' + committeID,
    success: (data) => {
      renderSocketList(data)
    }
  })
}

function getIn() {
  $.ajax({
    method: 'GET',
    url: '/list/push/' + userID + '/' + committeID,
    success: data => {

    },
    error: data => {
      swal({
        title: 'Impossível',
        text: data.responseJSON.error,
        icon: 'error'
      })
    }
  })
}

function renderSocketList(data) {
  list = data

  $('#botOrPeq').show()
  $('#posicaoLiPeq').hide()
  $('#botO').show()
  $('#posicaoL').hide()

  if(list.length == 0) {
    $('.emptyList').show()
    $('#delegacaoFalando').hide()

  } else {
    $('.emptyList').hide()
    $('#listaOradores').html('')

    list.forEach(({ _id, delegation }, index) => {
      if(_id == userID) {
        $('#posicaoLiPeq').html(`${index+1}º`)
        $('#botOrPeq').hide()
        $('#posicaoLiPeq').show()

        $('#posicaoL').html(`POSIÇÃO: ${index+1}º`)
        $('#botO').hide()
        $('#posicaoL').show()
      }

      if(index == 0) {
        const speakingHTML = `
          <center>
            <img src="${delegation.flag}" class="img-responsive bandeira1" alt="${delegation.name}" id="bandeira1" draggable="false">
          </center>
          <div class="nome1">${delegation.name}</div>
        `

        $('#delegacaoFalando').html(speakingHTML)
      } else {
        const nextHTML = `
          <div class="flex-item-box">
            <div class="ordemDefault">${index+1}º</div>
            <img src="${delegation.flag}" class="img-responsive bandDefault" alt="${delegation.name}" id="bandeira1">
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

socket.on('list', data => {
  renderSocketList(data)
})
