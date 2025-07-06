const authArea = document.getElementById('authArea');
const navLinks = document.getElementById('navLinks'); // tem que garantir que a UL tem esse id no HTML
const userData = JSON.parse(localStorage.getItem('user'));

if (userData && userData.name) {
  const firstName = userData.name.split(' ')[0];

  // Botão do usuário logado
  authArea.innerHTML = `
    <button class="user_logged" onclick="window.location.href='perfil.html'">
      ${firstName}
    </button>
  `;

  // Adiciona links extras conforme isAdmin e isGuia
  if (userData.isAdmin) {
    const liAdmin = document.createElement('li');
    liAdmin.innerHTML = '<a href="validacoes.html">Validações</a>';
    navLinks.appendChild(liAdmin);
  }

  if (userData.isGuia) {
    const liGuia = document.createElement('li');
    liGuia.innerHTML = '<a href="conversas.html">Conversas</a>';
    navLinks.appendChild(liGuia);
  }
} else {
  // Se não tiver user logado, mantém botão de login normal
  authArea.innerHTML = `
    <button>
      <a href="login.html">Login</a>
    </button>
  `;
}
