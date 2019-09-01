$(function() {
  var winH = $(window).height();
  var winW = $(window).width();
  $(window).on("scroll", function() {
    if ($(window).scrollTop() > 150) {
      if (winW < 768){
        $("#navbar-default").css("background", "rgba(255, 255, 255, 0.8)");
      }else{
        $("#navbar-default").css("background", "#36c1b6");
      }      
      $("#banner").css('filter', 'blur(3px)');
    } else {
      $("#navbar-default").css("background", "rgba(255, 255, 255, 0.8");
      $("#banner").css('filter', 'blur(0)');
    }
  });
});

window.onload = function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('#banner').css('background-attachment', 'scroll');
    }else{
        $('#banner').css('background-attachment', 'fixed');
    }
}