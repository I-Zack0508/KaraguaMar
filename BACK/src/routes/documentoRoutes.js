const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { enviarDocumento, listarPendentes, aprovarGuia } = require('../controllers/documentoController');

// Upload do documento com multer
router.post('/enviar', upload.single('arquivo'), enviarDocumento);

// Listar documentos pendentes para admin
router.get('/pendentes', listarPendentes);

// Aprovar guia (mudar status + atualizar usuário)
router.patch('/aprovar/:id', aprovarGuia);

module.exports = router;
