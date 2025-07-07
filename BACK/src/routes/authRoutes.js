const express = require('express');
const router = express.Router();
const { register, login, getUsers, editarUsuario } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);
router.patch('/users/:id', editarUsuario); // Nova rota para editar usuário

module.exports = router;
