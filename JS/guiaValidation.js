const form = document.getElementById('form-upload');
    const resultado = document.getElementById('resultado');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      try {
        const response = await fetch('http://localhost:3000/api/documentos/enviar', {
          method: 'POST',
          body: formData,
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