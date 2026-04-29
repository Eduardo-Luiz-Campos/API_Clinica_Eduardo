const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const pathDados = path.join(__dirname, '../data/consultas.json');

// Função para ler dados
const readData = () => {
    const data = fs.readFileSync(pathDados);
    return JSON.parse(data);
};

// Função para salvar dados
const writeData = (data) => {
    fs.writeFileSync(pathDados, JSON.stringify(data, null, 2));
};

// _______________________________________________________________ ROTAS_________________________________________________________________________

// GET - Listar todas as consultas
router.get('/', (req, res) => {
    const consultas = readData();
    res.json(consultas);
});

// Rota GET (ler) consulta por ID
router.get('/:id', (req, res) => {  
    const id = Number(req.params.id);
    const consultas = readData();
    const consulta = consultas.find(a => a.id === id);

    if (!consulta) { //Verifica se existe o ID
        return res.status(404).json({
            erro: "consulta não encontrada",
            mensagem: "Não existe nenhuma consulta com esse Id"
        });
    };

    res.json(consulta);
});

// POST - Criar novo consulta
router.post('/', (req, res) => {
    const { id_paciente, tipo, nome_medico } = req.body;

    // Validação básica se existe ou  não
    if (!id_paciente || !nome_medico) {
        return res.status(400).json({ erro: "Id_Paciente e nome_médico são obrigatórios" });
    }

    const consultas = readData();
    const novoconsulta = {
        id: consultas.length > 0 ? consultas[consultas.length - 1].id + 1 : 1 ,
        id_paciente,
        tipo,
        nome_medico
    };

    consultas.push(novoconsulta);
    writeData(consultas);

    res.status(201).json(novoconsulta);
});

router.put('/:id', (req, res) => { // Rota PUT (modificar) algum consulta por ID
    const id = Number(req.params.id);
    const {  id_paciente, tipo, nome_medico } = req.body;
    const consultas = readData();
    const index= consultas.findIndex(a => a.id === id);

    if (index === -1) { //Verifica se existe pelo ID
        return res.status(404).json({
            erro: "consulta não encontrada",
            mensagem: "Não existe nenhuma consulta com esse Id"
        });
    };

    consultas[index] = { id, id_paciente, tipo, nome_medico };

    fs.writeFileSync('./data/consultas.json', JSON.stringify(consultas, null, 2));
    res.json(consultas[index]);
});

// DELETE - Remover
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    let consultas = readData();
    const existe = consultas.some(a => a.id === id);

    if (!existe) {
        return res.status(404).json({ erro: "consulta não encontrada" });
    }

    consultas = consultas.filter(a => a.id !== id);
    writeData(consultas);
    res.json({ mensagem: 'consulta removida!' });
});

module.exports = router;
