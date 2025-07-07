const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const enviarDocumento = async (req, res) => {
  const { cpf, cep, userId, email, name } = req.body;
  const arquivo = req.file?.filename;

  if (!cpf || !cep || !userId || !arquivo || !email || !name) {
    return res.status(400).json({ error: "Campos obrigatórios faltando." });
  }

  try {
    const documento = await prisma.documentoGuia.create({
      data: {
        cpf,
        cep,
        arquivo,
        status: 'pendente',
        userId: parseInt(userId), // ⚠️ isso é essencial!
        email, // Salva o email do usuário
        name,  // Salva o nome do usuário
      },
    });

    res.status(201).json({ message: "Documento enviado!", documento });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar documento." });
  }
};


const listarPendentes = async (req, res) => {
  try {
    const documentosPendentes = await prisma.documentoGuia.findMany({
      where: { status: 'pendente' }, // Filtra documentos com status "pendente"
      include: {
        user: true, // Inclui os dados do usuário relacionado ao documento
      },
    });

    // Retorna os dados necessários
    const documentosFormatados = documentosPendentes.map(doc => ({
      id: doc.id,
      userId: doc.userId,
      email: doc.user.email,
      name: doc.user.name,
      cpf: doc.cpf,
      cep: doc.cep,
      arquivo: doc.arquivo,
      status: doc.status,
    }));

    res.json(documentosFormatados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar documentos pendentes." });
  }
};

const aprovarGuia = async (req, res) => {
  const { id } = req.params;

  try {
    // Busca o documento e inclui o user
    const documento = await prisma.documentoGuia.findUnique({
      where: { id: parseInt(id) },
      include: { user: true }
    });

    if (!documento) {
      return res.status(404).json({ error: "Documento não encontrado." });
    }

    // Atualiza o status do documento
    await prisma.documentoGuia.update({
      where: { id: documento.id },
      data: { status: 'aceito' }
    });

    // Atualiza o usuário para isGuia: true
    await prisma.user.update({
      where: { id: documento.userId },
      data: { isGuia: true }
    });

    res.json({ message: "Usuário aprovado como Guia." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao aprovar guia." });
  }
};


const rejeitarGuia = async (req, res) => {
  try {
    const { id } = req.params;

    const documento = await prisma.documentoGuia.findUnique({
      where: { id: parseInt(id) },
    });

    if (!documento) {
      return res.status(404).json({ error: "Documento não encontrado." });
    }

    await prisma.documentoGuia.update({
      where: { id: parseInt(id) },
      data: { status: 'rejeitado' },
    });

    res.json({ message: "Documento rejeitado com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao rejeitar documento." });
  }
};


module.exports = { enviarDocumento, listarPendentes, aprovarGuia, rejeitarGuia };
