document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("senha").value;
  
    if (!email || !password) {
      alert("Preencha todos os campos!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const { token, user } = data;
  
        // Remove senha se tiver
        if (user.password) delete user.password;
  
        // Salva token e user no localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
  
        alert("Login realizado com sucesso!");
        window.location.href = "index.html";
      } else {
        alert(data.message || "Erro no login.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao conectar com o servidor.");
    }
  });
  