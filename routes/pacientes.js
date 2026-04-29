const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const pathDados = path.join(__dirname, '../data/pacientes.json');

// Função para ler dados
const readData = () => {
    const data = fs.readFileSync(pathDados);
    return JSON.parse(data);
};

// Função para salvar dados
const writeData = (data) => {
    fs.writeFileSync(pathDados, JSON.stringify(data, null, 2));
};

// ________________________________________ ROTAS_________________________________________________________________________

// GET - Listar todos os pacientes
router.get('/', (req, res) => {
    const pacientes = readData();
    res.json(pacientes);
});

// Rota GET (ler) paciente por ID
router.get('/:id', (req, res) => {  
    const id = Number(req.params.id);
    const pacientes = readData();
    const paciente = pacientes.find(a => a.id === id);

    if (!paciente) { //Verifica se existe o ID
        return res.status(404).json({
            erro: "paciente não encontrado",
            mensagem: "Não existe nenhum paciente com esse Id"
        });
    };

    res.json(paciente);
});

// POST - Criar novo paciente
router.post('/', (req, res) => {
    const { cpf, nome, telefone, idade } = req.body;

    // Validação básica se existe ou  não
    if (!nome || !cpf || !idade) {
        return res.status(400).json({ erro: "CPF, Nome e idade são obrigatórios" });
    }

    const pacientes = readData();
    const novoPaciente = {
        id: pacientes.length > 0 ? pacientes[pacientes.length - 1].id + 1 : 1 ,
        nome,
        cpf,
        telefone,
        idade
    };

    pacientes.push(novoPaciente);
    writeData(pacientes);

    res.status(201).json(novoPaciente);
});

router.put('/:id', (req, res) => { // Rota PUT (modificar) algum paciente por ID
    const id = Number(req.params.id);
    const {  cpf, nome, telefone, idade } = req.body;
    const pacientes = readData();
    const index= pacientes.findIndex(a => a.id === id);

    if (index === -1) { //Verifica se existe pelo ID
        return res.status(404).json({
            erro: "paciente não encontrado",
            mensagem: "Não existe nenhum paciente com esse Id"
        });
    };

    pacientes[index] = { id, cpf, nome, telefone, idade };

    fs.writeFileSync('./data/pacientes.json', JSON.stringify(pacientes, null, 2));
    res.json(pacientes[index]);
});

// DELETE - Remover
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    let pacientes = readData();
    const existe = pacientes.some(a => a.id === id);

    if (!existe) {
        return res.status(404).json({ erro: "paciente não encontrado" });
    }

    pacientes = pacientes.filter(a => a.id !== id);
    writeData(pacientes);
    res.json({ mensagem: 'paciente removido!' });
});

module.exports = router;
