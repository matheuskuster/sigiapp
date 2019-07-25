   var posLista = 0;
   document.head || (document.head = document.getElementsByTagName('head')[0]);

   function changeFavicon(src) {
    var link = document.createElement('link'),
        oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'icon';
    link.href = src;
    if (oldLink) {
     document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
   }

   function order() {
    posLista++;
    if (posLista == 1) {
      changeFavicon('imagens/faviconsinterativos/1.png');
    }
    if (posLista == 2) {
      changeFavicon('imagens/faviconsinterativos/2.png'); 
    }
    if (posLista == 3) {
      changeFavicon('imagens/faviconsinterativos/3.png'); 
    }
    if (posLista == 4) {
      changeFavicon('imagens/faviconsinterativos/4.png'); 
    }
    if (posLista == 5) {
      changeFavicon('imagens/faviconsinterativos/5.png'); 
    }
    if (posLista == 6) {
      changeFavicon('imagens/faviconsinterativos/6.png'); 
    }
    if (posLista == 7) {
      changeFavicon('imagens/faviconsinterativos/7.png'); 
    }
    if (posLista == 8) {
      changeFavicon('imagens/faviconsinterativos/8.png'); 
    }
    if (posLista == 9) {
      changeFavicon('imagens/faviconsinterativos/9.png'); 
    }
    if (posLista >= 10) {
      changeFavicon('imagens/faviconsinterativos/9plus.png'); 
    }
   };

   // Optimized Google Analytics snippet
   // See https://mathiasbynens.be/notes/async-analytics-snippet
   var _gaq = [['_setAccount', 'UA-6065217-11'], ['_trackPageview']];
   (function(d, t) {
    var g = d.createElement(t),
        s = d.getElementsByTagName(t)[0];
    g.src = 'https://www.google-analytics.com/ga.js';
    s.parentNode.insertBefore(g, s);
   })(document, 'script');