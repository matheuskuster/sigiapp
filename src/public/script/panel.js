var interval
var segundo = 0 + '0'
var minuto = 0 + '0'
var aux = 0
var contEsp = 0
var winW = $(window).width()
var winH = $(window).height()
var numdeOra = 2
var primeiro = true
var oradores = []
var codOradores = []
var listaDelegacoes = []
var listaSiglas = []
var qntOradores = 0
var nmrPv = 0
var nmrP = 0
var allS = []
var quorum = 0
var mSimples = 0
var mQualificada = 0
var selList = []
var nmtrDelTotal = selList.length
var nmrA = nmtrDelTotal
var listVote = []
var listPresent = []
var allVotes = []
var atualVote = ''
var nmrAF = 0
var nmrCO = 0
var nmrAB = 0
var allDelegation = []
var listAdd = []
var committeID = null
var BASE_URL = 'http://localhost:3000'
var list = null

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

function addDelegationList () {
  $('listVote').html('')
  for (var i = 0; i < listPresent.length; i++) {
    at = listPresent[i]
    listAdd.push(
      '<div class="line">' +
        '<div class="nD">' +
        selList[at] +
        '</div>' +
        '<div class="central">' +
        '<div class="options"><center>' +
        '<label class="checkNec removeMargin">' +
        '<input type="checkbox" id="' +
        selList[at] +
        '" name="ad">' +
        '<span class="checkmark"></span></label></center></div></div>' +
        '</div>'
    )
    $('#listAddDelegation').append(listAdd[i])
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
})

function iniciar () {
  $('#aguardando2').hide()
  $('#aguardando1').show()
  $('#iniciada').show()
  $('#iniciadaPeq').show()

  for (var i = 0; i < nmtrDelTotal; i++) {
    allS[i] = 'a'
  }
  $('#return-chamada').hide()
  // console.log(allS);
}

function liberaButton () {
  $('#return-chamada').show()
}

function calQuant () {
  quorum = nmrPv + nmrP
  mSimples = Math.ceil(quorum / 2)
  mQualificada = Math.ceil((quorum / 3) * 2)

  $('#quorum').text(quorum + '/' + nmtrDelTotal)
  $('#mSimples').text(mSimples)
  $('#mQualificada').text(mQualificada)
}

function emendaList () {
  $('#delegacaoFalando').hide()
  $('#listaOradores').hide()
  $('#favorContraList').show()
  console.log('click')
}

function call() {
  const checkboxes = document.querySelectorAll('.check')
  
  let ausency = $('#nmrA').html()
  let present = $('#nmrP').html()
  let votingPresent = $('#nmrPv').html()

  checkboxes.forEach(c => {
    c.addEventListener('click', function() {
      renderCallNumbers()
    })
  })

  function renderCallNumbers() {
    const ausencyCheckboxes = document.querySelectorAll('.a:checked')
    const presentCheckboxes = document.querySelectorAll('.p:checked')
    const votingPresentCheckboxes = document.querySelectorAll('.pv:checked')

    $('#nmrA').html(ausencyCheckboxes.length)
    $('#nmrP').html(presentCheckboxes.length)
    $('#nmrPv').html(votingPresentCheckboxes.length)
  }
}

function getCommitteIdFromNJK(id) {
  committeID = id
  renderList()
}

function renderList() {
  $.ajax({
    method: 'GET',
    url: BASE_URL + '/list/' + committeID,
    success: (data) => {
      list = data

      if(list.length == 0) {
        $('.emptyList').show()
        $('.time').hide()

      } else {
        $('.emptyList').hide()
        $('#listaOradores').html('')

        list.forEach(({ delegation }, index) => {
          console.log(delegation)

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
  })
}

function nextDelegation() {
   $.ajax({
    method: 'GET',
    url: BASE_URL + '/list/next/' + committeID,
    success: data => {
      console.log(data)
    }
   })
}

function previousDelegation() {
  $.ajax({
    method: 'GET',
    url: BASE_URL + '/list/previous/' + committeID,
    success: data => {
      console.log(data)
    },
    error: data => {
      console.log('NÃO HÁ ANTERIOR')
    }
   })
}

call()

  
