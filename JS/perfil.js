// Pega os dados do usuário do localStorage
const user = JSON.parse(localStorage.getItem('user'));

// Verifica se o usuário está logado
if (!user || !user.id || !user.name || !user.email) {
  alert("Você precisa estar logado para acessar esta página.");
  window.location.href = "login.html"; // Redireciona para a página de login
} else {
  // Exibe os dados do usuário na página
  document.getElementById('user-name').textContent = user.name;
  document.getElementById('user-email').textContent = user.email;

  // Se houver data de nascimento no objeto do usuário, exibe
  if (user.dob) {
    document.getElementById('user-dob').textContent = user.dob;
  } else {
    document.getElementById('user-dob').textContent = "Não informado";
  }
}

// Função para abrir o modal
function openModal(field) {
  const modal = document.getElementById('edit-modal');
  modal.style.display = 'flex';

  const form = document.getElementById('edit-form');
  form.onsubmit = async (e) => {
    e.preventDefault();
    const newValue = document.getElementById('edit-input').value;

    if (newValue.trim() === '') {
      alert('O valor não pode estar vazio.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/auth/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: newValue }),
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      // Atualiza o campo no objeto do usuário
      user[field] = newValue;

      // Atualiza o localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Atualiza o campo na página
      document.getElementById(`user-${field}`).textContent = newValue;

      alert('Dados atualizados com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar: ' + err.message);
    }

    // Fecha o modal
    closeModal();
  };
}

// Função para fechar o modal
function closeModal() {
  const modal = document.getElementById('edit-modal');
  modal.style.display = 'none';
}

// Função de logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('user'); // Remove os dados do usuário do localStorage
  alert('Você foi desconectado.');
  window.location.href = "login.html"; // Redireciona para a página de login
});