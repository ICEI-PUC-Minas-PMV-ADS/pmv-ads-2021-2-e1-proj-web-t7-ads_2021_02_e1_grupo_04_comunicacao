function abrirMenu(){
  document.getElementById("menu").style.width = '300px';
  document.getElementById("conteudo").style.marginLeft = '300px';
}

function fecharMenu(){
  document.getElementById("menu").style.width = '0px';
  document.getElementById("conteudo").style.marginLeft = '0px';
}

$(document).ready(function(){    
  $('.sub-btn').click(function(){
      $(this).next('.sub-menu').slideToggle();
      $(this).find('.dropdown').toggleClass('rotate');
      console.log("passo1");
  });

  $('.menu-btn').click(function(){
      $('.side-bar').addClass('active');
      $('.menu-btn').css("visibility", "hidden");                                
      document.getElementById("conteudo").style.marginLeft = '300px';
      console.log("passo2");
  });

  $('.close-btn').click(function(){
      $('.side-bar').removeClass('active');
      $('.menu-btn').css("visibility", "visible");
      document.getElementById("conteudo").style.marginLeft = '0px';
      console.log("passo3");
  });    
  }); 