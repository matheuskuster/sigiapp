var numMat = 0;
var idAtual = "mat" + numMat;
var matPub = "";
var pubAnt = 0;
var imagemLink;
var title;
var linkPub;
var namePub;
var typeOpt;
var question = $(".question");
var etapa1 = true;
var etapa2 = false;
var etapa3 = false


function previewPub() {
  $("#previa").remove();
  matPub = "";
  imagemLink = $("#imagemD").val();
  imagemLinkForm = "'" + imagemLink + "'";
  title = $("#titleD").val();
  linkPub = $("#linkD").val();
  namePub = $("#nameD").val();
  if (namePub == "") {
    namePub = "Anônimo";
  }
  typeOpt = $("#typeMat option:selected").text();
  matPub =
    '<div id="' +
    idAtual +
    '"><div class="mat"><div style="background: url(' +
    imagemLinkForm +
    '); background-position: center; background-repeat: no-repeat; background-size: cover; min-height: 200px; border-radius: 5px 5px 0 0; display: block;"></div><div class="line"></div><div style="height: 5px;"></div><div class="etiquetaMat"><mark>' +
    typeOpt +
    '</mark></div><div class="tituloMaterial">' +
    title +
    '</div><div class="descMat">Agora mesmo | ' +
    namePub +
    ' <i class="fas fa-share-alt" onclick(sharePub(' +
    linkPub +
    "))></i></div></div></div>";
  idAtual = "mat" + numMat;
  $("#inserirDadosMaterial").hide();
  $("#previaMaterial").show();
  $("#insertBut").hide();
  $("#viewBut").show();
  $("#previaMaterial").append(
    '<div id="previewBox"><div class="previa" id="previa"></div></div>'
  );
  $("#previa").append(matPub);
  etapa2 = true;
  etapa(2);
}

function sharePub(linktoShare, titleShare) {
  //alert(titleShare)
  var aspas = '"'
  $('#inline').html('');
  $('#inline').append("<input type='text'id='linkcopiar' style='width: 200px;' value='"+linktoShare+"'></input>"+
    "<div class='inline' data-dismiss='modal' aria-label='Close'><a href='javascript: void(0);' onclick="+aspas+"window.open('http://www.facebook.com/sharer.php?u="+linktoShare+"','ventanacompartir', 'toolbar=0, status=0, width=650, height=450');"+aspas+"><div class='circle-facebook'><i class='fab fa-facebook-f ico-share'></i></div></a>"+
    "<a href='https://twitter.com/intent/tweet?url="+linktoShare+"&text="+titleShare+"' target='_blank'><div class='circle-twitter'><i class='fab fa-twitter ico-share'></i></div> </a>"+
    "<a href='https://api.whatsapp.com/send?text="+titleShare+"                                  "+linktoShare+"'><div class='circle-wpp'><i class='fab fa-whatsapp ico-share'></i></div></a>"+
    "<div class='circle-messenger' onclick='copiarFunction()'id='copyButton'><i class='far fa-copy ico-share'></i></div></div>")
    $('#sharePainel').modal( 'toggle' );
}

  function copiarFunction() {
    var texto = document.getElementById("linkcopiar"); 
    texto.select(); 
    document.execCommand("Copy"); 
  };

function returnEdition() {
  matAtual = "#" + idAtual;
  $("#previewBox").remove();
  $(matAtual).remove();
  $("#previaMaterial").hide();
  $("#viewBut").hide();
  $("#inserirDadosMaterial").show();
  $("#insertBut").show();
  etapa2 = false;
  etapa1 = true;
  etapa(1);
}

function etapa(id){
  //alert('oe');
  if (etapa1) {
    $('#e1').css('background-color', '#36c1b6');
    $('#e2').css('background-color', '#d9d9d9');
    $('#title-box').html('Inserir Notícia');
  }
  if (etapa2) {
    $('#e2').css('background-color', '#36c1b6');
    $('#e3').css('background-color', '#d9d9d9');
    $('#title-box').html('Prévia do Card');
    $('#wiriteTextsBut').hide();
    $('#insertMateria').hide();
  }
}

function writeTextDip(){
  console.log('Quem me chamou?')
}

$(document).ready(function(){
  var posicaoAtual = $(window).scrollTop();
  var documentSize = $(document).height();
  var sizeWindow = $(window).height();
  
  $(window).scroll(function () {
    posicaoAtual = $(window).scrollTop();
    //alert(posicaoAtual);
    position = documentSize - sizeWindow;
    if (winW < 768) {
      position = documentSize - sizeWindow - 60;
    }
  if ( posicaoAtual >=  position) {
    //alert('fim');
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


function pubMat() {
  var BASE_URL = "http://localhost:3000";
  //console.log(imagemLink, title, linkPub, namePub, typeOpt);
  var dataJSON = {
    image: imagemLink,
    title: title,
    url: linkPub,
    name: namePub,
    approved: false,
    type: typeOpt
  };

  $.ajax({
    type: "POST",
    url: BASE_URL + "/material/store",
    dataType: "json",
    data: dataJSON,
    success: data => {
      returnEdition();
      pubAnt = numMat;
      numMat++;
      $("#titleD").val("");
      $("#linkD").val("");
      $("#nameD").val("");
      $("#imagemD").val("");

      swal({
        title: "Muito obrigado por compartilhar seus estudos conosco!",
        text:
          "Seu material foi postado com sucesso, porém só será exibido após passar por nosso processo de aprovação.",
        icon: "success"
      });
    }
  });
}
