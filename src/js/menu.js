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

  const usuarioLogado = sessionStorage.getItem('usuario');
  document.getElementById("usuarioLogado").innerHTML = 'Usuario Logado: ' + usuarioLogado;

  if (usuarioLogado === 'tecnico') {
    document.getElementById('menuCadastro').style.display = 'none';
    document.getElementById('menuConfiguracoes').style.display = 'none';      
  }

  if (usuarioLogado === 'supervisor' || usuarioLogado === 'gerente' || usuarioLogado === 'demo') {
    document.getElementById('menuCadastro').style.display = 'block';
    document.getElementById('menuConfiguracoes').style.display = 'block';      
  }



    
}); 