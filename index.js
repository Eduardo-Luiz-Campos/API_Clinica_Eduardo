const express = require('express');
const app = express();
const PORT = 3000;
const pacientesRoutes = require('./routes/pacientes'); //exporta as rotas

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => { // Rota para enviar texto no diretório principal
    res.send('Servidor da API de clinica está rodando com sucesso!');
});

app.use('/pacientes', pacientesRoutes); //Define que as rotas dos pacientes teram /pacientes antes

app.listen(PORT, () => { // Para mostrar aonda o servidor está rodando no terminal e executar mais fácil
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});