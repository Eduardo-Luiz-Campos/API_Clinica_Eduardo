const express = require('express');
const app = express();
const PORT = 3000;
const pacientesRoutes = require('./routes/pacientes'); //exporta as rotas
const consultasRoutes = require('./routes/consultas');


app.use(express.json());
app.use(express.static('public'));


app.use('/pacientes', pacientesRoutes); //Define que as rotas dos pacientes teram /pacientes antes
app.use('/consultas', consultasRoutes); //Define que as rotas das consultas teram /consultas antes

app.listen(PORT, () => { // Para mostrar aonda o servidor está rodando no terminal e executar mais fácil
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});