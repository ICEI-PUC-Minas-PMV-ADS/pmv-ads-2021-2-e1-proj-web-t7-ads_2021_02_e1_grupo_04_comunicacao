var usuarios = [
  {"login": "demo", "senha": "demo123"},
  {"login": "tecnico", "senha": "tecnico123"},
  {"login": "supervisor", "senha": "supervisor123"},
  {"login": "gerente", "senha": "gerente123"},
];

function Login() {
  var usuario = document.getElementById('usuario').value;
  var password = document.getElementById('password').value;
  for (var u in usuarios) {
      var us = usuarios[u];
      if (us.login === usuario && us.senha === password) {
        document.getElementById('erroMsg').style.display = 'none';
        return true;
      }
  }
  //alert("Dados incorretos, tente novamente.");
  
  document.getElementById('erroMsg').style.display = 'block';
  return false;
}