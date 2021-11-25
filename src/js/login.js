var usuarios = [
  {"login": "demo", "senha": "demo123"},
  {"login": "supervisor", "senha": "supervisor123"},
  {"login": "gerente", "senha": "gerente123"},
];

function Login() {
  var usuario = document.getElementById('usuario').value;
  var password = document.getElementById('password').value;
  for (var u in usuarios) {
      var us = usuarios[u];
      if (us.login === usuario && us.senha === password) {
        return true;
      }
  }
  alert("Dados incorretos, tente novamente.");
  return false;
}