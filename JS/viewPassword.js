function togglePassword(campoId, eyeId) {
    const input = document.getElementById(campoId);
    const eyeIcon = document.getElementById(eyeId);

    if (input.type === 'password') {
      input.type = 'text';
      eyeIcon.src = '/IMG/eye-close.png'; // ícone de olho fechado
    } else {
      input.type = 'password';
      eyeIcon.src = '/IMG/eye-icon.png'; // ícone de olho aberto
    }
  }

  const dataInput = document.getElementById('dataNasc');
  const hoje = new Date().toISOString().split("T")[0];
  dataInput.max = hoje;