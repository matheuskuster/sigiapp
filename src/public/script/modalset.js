function limpaTextArea(){
	$('#imagemD').val('');
	$('#titleD').val('');
	$('#linkD').val('');
	$('#textoDigitadomob').val('');
	$('#textoDigitado').focus();
}

function acertaCaixa(){
	winH = $(window).height();
	$('.campo-estilo-preenche').css('height', (winH-150)) + "px";
}

$(document).keyup(function(e){
	pubPreenchido()
})

$(document).keydown(function(e){
	pubPreenchido();
})

function pubPreenchido(){
	imagemDLen = $('#imagemD').val().length;
	titleDLen  = $('#titleD').val().length;
	linkDLen   = $('#linkD').val().length;
	typeOpt    = $('#typeMat').find(":selected").val();
	
	if (imagemDLen > 0 && titleDLen > 0 && linkDLen > 0){
		$('#botaoPub').prop("disabled", false);
	}else{
		$('#botaoPub').prop("disabled", true);
	}

	if (imagemDLen > 0 && titleDLen > 0 && linkDLen > 0){
		$('#matmobile').prop("disabled", false);
	}else{
		$('#matmobile').prop("disabled", true);
	}

}

function limpaformulario(){
	$('#imagemD').val('');
	$('#titleD').val('');
	$('#linkD').val('');
	pubPreenchido()
}