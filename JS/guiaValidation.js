const form = document.getElementById('form-upload');
const resultado = document.getElementById('resultado');
const nomeUsuario = document.getElementById('nome-usuario'); // elemento pra exibir nome (opcional)

// pega o user do localStorage
const user = JSON.parse(localStorage.getItem('user'));

// verifica se está logado
if (!user || !user.id) {
  alert("Você precisa estar logado para enviar a validação.");
  window.location.href = "login.html"; // redireciona se não estiver logado
}

// exibe o nome na tela (opcional)
if (nomeUsuario) {
  nomeUsuario.textContent = `Olá, ${user.name}`;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  // adiciona o userId ao formulário
  formData.append('userId', user.id);

  try {
    const response = await fetch('http://localhost:3000/api/documentos/enviar', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      resultado.textContent = 'Documento enviado com sucesso! ID: ' + data.documento.id;
      form.reset();
    } else {
      resultado.textContent = 'Erro: ' + (data.error || 'Algo deu errado');
    }
  } catch (err) {
    resultado.textContent = 'Erro na requisição: ' + err.message;
  }
});
