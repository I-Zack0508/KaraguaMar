const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const enviarDocumento = async (req, res) => {
  try {
    const { cpf, cep, userId } = req.body;
    const arquivo = req.file?.filename;

    if (!cpf || !cep || !arquivo || !userId)
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });

    const documento = await prisma.documentoGuia.create({
      data: {
        cpf,
        cep,
        arquivo,
        userId: parseInt(userId)
      }
    });

    res.status(201).json({ message: "Documento enviado com sucesso!", documento });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao enviar documento." });
  }
};

const listarPendentes = async (req, res) => {
  try {
    const docs = await prisma.documentoGuia.findMany({
      where: { status: 'pendente' },
      include: { user: true }
    });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar documentos." });
  }
};

const aprovarGuia = async (req, res) => {
  try {
    const { id } = req.params;

    const documento = await prisma.documentoGuia.update({
      where: { id: parseInt(id) },
      data: { status: 'aceito' }
    });

    await prisma.user.update({
      where: { id: documento.userId },
      data: { isGuia: true }
    });

    res.json({ message: "Usuário promovido a guia." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao aprovar guia." });
  }
};

module.exports = { enviarDocumento, listarPendentes, aprovarGuia };
