var contPub = 0;
var usuarioImg = 'dir1oit.jpg';
var nomeUsuario = 'João Antônio S. C.';
var cargoUsuario = 'Diretor Geral - OIT 2018';
var pubAtual = 0;
var tamanhoTexto = 0;
var winW = $(window).width();
var winH = $(window).height();
var notifications = 0
var socket = io()
$('.botNotifications').hide()

var bar = new ProgressBar.Circle(container, {
    strokeWidth: 8,
    easing: "easeInOut",
    duration: 1,
    color: "#36c1b6",
    trailColor: "#999",
    trailWidth: 2,
    svgStyle: null
});

var barMobile = new ProgressBar.Circle(container_mobile, {
    strokeWidth: 8,
    easing: "easeInOut",
    duration: 1,
    color: "#36c1b6",
    trailColor: "#999",
    trailWidth: 2,
    svgStyle: null
});


function calculatePercentage(c) {
    return c / 280;
}

$('#textoDigitado').keydown(e => {
		setTimeout(function() {
      pubPreenchido()
      let charactersNumber = $('#textoDigitado').val().length
      $('#c_number').html(charactersNumber)
      bar.animate(calculatePercentage(charactersNumber));
      barMobile.animate(calculatePercentage(charactersNumber));
    }, 50)
});

$( window ).resize(function() {
	acertaCaixa();
});

function pubPreenchido(){
	tamanhoTexto = $('#textoDigitado').val().length;
	if (tamanhoTexto > 0){
		$('#botaoPub').prop("disabled", false);
		$('#pubmobile').prop("disabled", false);
	}else{
		$('#botaoPub').prop("disabled", true);
		$('#pubmobile').prop("disabled", true);
	}
}

function limpaTextArea(){
	$('#textoDigitado').val('');
	$('#textoDigitadomob').val('');
	pubPreenchido();
}

function acertaCaixa(){
	winH = $(window).height();
	$('.campo-estilo-preenche').css('height', (winH-150)) + "px";
}

function joinSocketFeed () {
  socket.emit('connectFeed', 'feed')
}

socket.on('feed', data => {
  notifications += 1
	if(notifications >= 10) {
		notifications = 9
	}

	$('.botNotifications').html(notifications)
	$('.botNotifications').slideDown()
})

$('.botNotifications').click(e => {
	document.location.reload()
})

$('.excluirPub').click(e => {
	const id = e.target.dataset.id

	Swal.fire({
    title: 'Tem certeza?',
    text:
      'Deseja mesmo excluir esse post?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#36c1b6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Sim, excluir!'
  }).then(result => {
    if (result.value) {
      window.location.replace('/app/feed/remove/' + id)
    }
  })
})

joinSocketFeed()