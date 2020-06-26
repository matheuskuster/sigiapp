$(document).ready(function(){
  var posicaoAtual = $(window).scrollTop();
  var documentSize = $(document).height();
  var sizeWindow = $(window).height();
  
  $(window).scroll(function () {
    posicaoAtual = $(window).scrollTop();
    position = documentSize - sizeWindow;
    if (winW < 768) {
      position = documentSize - sizeWindow - 60;
    }
  if ( posicaoAtual >=  position) {
      $( ".botEscrever" ).fadeOut();
    }else{
       $( ".botEscrever" ).fadeIn();
    }
  });
  
  $(window).resize(function() {
    posicaoAtual = $(window).scrollTop();
    documentSize = $(document).height();
    sizeWindow = $(window).height();
  });
  
  
});