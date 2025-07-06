document.getElementById("cadastroForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("senha").value;
  const confirmPassword = document.getElementById("confirmaSenha").value;
  const birthDate = document.getElementById("dataNasc").value;

  if (!name) {
    alert("Por favor, preencha seu nome.");
    return;
  }

  if (password !== confirmPassword) {
    alert("As senhas não coincidem!");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        confirmPassword,
        birthDate,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Conta criada com sucesso!");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Erro ao cadastrar.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao conectar com o servidor.");
  }
});
