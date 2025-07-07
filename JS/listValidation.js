const API_URL = 'http://localhost:3000/api/documentos';

async function carregarDocumentos() {
  const container = document.getElementById('documentos-container');

  try {
    const response = await fetch(`${API_URL}/pendentes`);
    const documentos = await response.json();

    if (!documentos.length) {
      container.innerHTML = '<p>Nenhum documento pendente.</p>';
      return;
    }

    let html = `
      <table>
        <thead>
          <tr>
            <th>ID do Pedido</th>
            <th>ID do Usuário</th>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
            <th>CEP</th>
            <th>Arquivo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
    `;

    documentos.forEach(doc => {
      html += `
        <tr>
          <td>${doc.id}</td>
          <td>${doc.user ? doc.user.id : '—'}</td>
          <td>${doc.user ? doc.user.name : '—'}</td>
          <td>${doc.user ? doc.user.email : '—'}</td>
          <td>${doc.cpf}</td>
          <td>${doc.cep}</td>
          <td>
            <a href="http://localhost:3000/uploads/${doc.arquivo}" target="_blank">Ver Arquivo</a>
          </td>
          <td>${doc.status}</td>
          <td>
            <button onclick="aprovar(${doc.id}, this)">Aprovar</button>
            <button onclick="rejeitar(${doc.id}, this)" style="margin-left: 5px; background-color: #e74c3c; color: white;">Rejeitar</button>
          </td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;

  } catch (err) {
    console.error(err);
    container.innerHTML = '<p>Erro ao carregar documentos.</p>';
  }
}

async function aprovar(id, btn) {
  btn.disabled = true;
  btn.textContent = 'Aprovando...';

  try {
    const res = await fetch(`${API_URL}/aprovar/${id}`, {
      method: 'PATCH',
    });

    const data = await res.json();

    if (res.ok) {
      alert('Usuário aprovado como Guia!');
      carregarDocumentos();
    } else {
      throw new Error(data.error || 'Erro na aprovação');
    }
  } catch (err) {
    alert('Erro ao aprovar: ' + err.message);
    btn.disabled = false;
    btn.textContent = 'Aprovar';
  }
}

async function rejeitar(id, btn) {
  btn.disabled = true;
  btn.textContent = 'Rejeitando...';

  try {
    const res = await fetch(`${API_URL}/rejeitar/${id}`, {
      method: 'PATCH',
    });

    const data = await res.json();

    if (res.ok) {
      alert('Pedido rejeitado!');
      carregarDocumentos();
    } else {
      throw new Error(data.error || 'Erro na rejeição');
    }
  } catch (err) {
    alert('Erro ao rejeitar: ' + err.message);
    btn.disabled = false;
    btn.textContent = 'Rejeitar';
  }
}

carregarDocumentos();
