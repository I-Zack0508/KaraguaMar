const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { name, birthDate, email, password, confirmPassword, isAdmin = false, isGuia = false } = req.body;

    if (!name || !birthDate || !email || !password || !confirmPassword)
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });

    if (password !== confirmPassword)
      return res.status(400).json({ error: "Senhas diferentes." });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ error: "Email já cadastrado." });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        birthDate: new Date(birthDate),
        email,
        password: hashed,
        isAdmin,
        isGuia
      }
    });

    res.status(201).json({ message: "Usuário cadastrado com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email e senha são obrigatórios." });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Senha incorreta." });

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin, isGuia: user.isGuia },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isGuia: user.isGuia
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        isGuia: true,
      },
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
};

const editarUsuario = async (req, res) => {
  const { id } = req.params; // ID do usuário
  const { name, email, password, dob } = req.body; // Dados enviados para atualização

  try {
    // Busca o usuário pelo ID
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Atualiza os campos fornecidos
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name: name || user.name, // Atualiza o nome se fornecido
        email: email || user.email, // Atualiza o email se fornecido
        password: password ? await bcrypt.hash(password, 10) : user.password, // Atualiza a senha se fornecida
        dob: dob || user.dob, // Atualiza a data de nascimento se fornecida
      },
    });

    res.json({ message: "Usuário atualizado com sucesso.", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
};

module.exports = { register, login, getUsers, editarUsuario };
