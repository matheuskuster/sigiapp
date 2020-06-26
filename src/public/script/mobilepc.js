var winW = $(window).width();
var winH = $(window).height();

$( window ).resize(function() {
	winW = $(window).width();
	winH = $(window).height();
	mobilepc();
});
$(document).ready(function(){
  mobilepc();
});
function mobilepc(){
	if (winW > 990){
		$('.botEscrever').css('bottom', '20px');
		$('.paineldeControle').css('bottom', ('0px'));
	}else{
		$('.botEscrever').css('bottom', '60px');
		$('.paineldeControle').css('bottom', ('49px'));
	}
}