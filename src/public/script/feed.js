var contPub = 0;
var usuarioImg = 'dir1oit.jpg';
var nomeUsuario = 'João Antônio S. C.';
var cargoUsuario = 'Diretor Geral - OIT 2018';
var pubAtual = 0;
var tamanhoTexto = 0;
var winW = $(window).width();
var winH = $(window).height();

function escreverPub(opt){
		contPub++;
		if (opt == 1) {
			textoPub = $('#textoDigitado').val();
		}
		if (opt == 2) {
			textoPub = $('#textoDigitadomob').val();
		}
		publication = '<div class="pub" id="'+contPub+'"><div class="excluirPub" id="exc'+contPub+'" onclick="escolherPub('+contPub+')" data-toggle="modal" data-target="#deletePublication")"><i class="fas fa-times"></i></div><img src="imagens/ftPerfis/'+usuarioImg+'" class="ftPub" id="ftPub'+contPub+'"><div class="usuarioPub" id="usuarioPub'+contPub+'">'+nomeUsuario+'</div><div class="cargoPub" id="cargoPub'+contPub+'">'+cargoUsuario+'</div><div class="textoPub" id="textoPub'+contPub+'">'+textoPub+'</div></div>'
		$('#feed').prepend(publication);
}

function escolherPub(id){
	pubAtual = '#' + id;
}

function removePub(){
	$(pubAtual).remove();
}

$( window ).resize(function() {
	acertaCaixa();
});

$(document).keyup(function(e){
	pubPreenchido()
})

$(document).keydown(function(e){
	pubPreenchido()
})

function pubPreenchido(){
	tamanhoTexto = $('#textoDigitado').val().length;
	tamanhoTextoMob = $('#textoDigitadomob').val().length;
	if (tamanhoTexto > 0){
		$('#botaoPub').prop("disabled", false);
	}else{
		$('#botaoPub').prop("disabled", true);
	}

	if (tamanhoTextoMob > 0) {
		$('#pubmobile').prop("disabled", false);
	}else{
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