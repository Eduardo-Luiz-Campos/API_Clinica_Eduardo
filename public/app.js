// URLs da API
const API_PACIENTES = '/pacientes';
const API_CONSULTAS = '/consultas';

// Inicia o sistema ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    atualizarTelas();
});

// Função mestre para atualizar os dados na tela
async function atualizarTelas() {
    await listarPacientes();
    await listarConsultas();
    await carregarPacientesNoSelect();
}

// =========================================================================
// SEÇÃO DE PACIENTES
// =========================================================================

// Listar Pacientes
async function listarPacientes() {
    const res = await fetch(API_PACIENTES);
    const pacientes = await res.json();
    const lista = document.getElementById('listaPacientes');
    lista.innerHTML = '';

    pacientes.forEach(p => {
        lista.innerHTML += `
            <li>
                <span><strong>${p.nome}</strong> (${p.idade} anos) - CPF: ${p.cpf}</span>
                <div>
                    <button class="btn-edit" onclick="editarPaciente(${p.id})">Editar</button>
                    <button class="btn-delete" onclick="deletarPaciente(${p.id})">Excluir</button>
                </div>
            </li>`;
    });
}

// Cadastrar Paciente
document.getElementById('formPaciente').addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        telefone: document.getElementById('telefone').value,
        idade: document.getElementById('idade').value
    };

    const res = await fetch(API_PACIENTES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    if (res.ok) {
        alert('Paciente cadastrado com sucesso!');
        e.target.reset();
        atualizarTelas();
    }
});

// Editar Paciente (PUT)
async function editarPaciente(id) {
    const res = await fetch(`${API_PACIENTES}/${id}`);
    const p = await res.json();

    const novoNome = prompt("Editar Nome:", p.nome);
    const novoCpf = prompt("Editar CPF:", p.cpf);
    const novaIdade = prompt("Editar Idade:", p.idade);
    const novoTel = prompt("Editar Telefone:", p.telefone);

    if (novoNome && novoCpf) {
        await fetch(`${API_PACIENTES}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: novoNome, cpf: novoCpf, idade: novaIdade, telefone: novoTel })
        });
        alert('Dados do paciente atualizados!');
        atualizarTelas();
    }
}

// Deletar Paciente
async function deletarPaciente(id) {
    if (confirm('Deseja realmente excluir este paciente?')) {
        await fetch(`${API_PACIENTES}/${id}`, { method: 'DELETE' });
        atualizarTelas();
    }
}

// =========================================================================
// SEÇÃO DE CONSULTAS (RELACIONAMENTO)
// =========================================================================

// Carrega os nomes dos pacientes no Select do formulário de consultas
async function carregarPacientesNoSelect() {
    const res = await fetch(API_PACIENTES);
    const pacientes = await res.json();
    const select = document.getElementById('id_paciente');
    
    select.innerHTML = '<option value="">Selecione o Paciente</option>';
    pacientes.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.nome;
        select.appendChild(option);
    });
}

// Listar Consultas
async function listarConsultas() {
    const resConsultas = await fetch(API_CONSULTAS);
    const consultas = await resConsultas.json();
    const resPacientes = await fetch(API_PACIENTES);
    const pacientes = await resPacientes.json();

    const lista = document.getElementById('listaConsultas');
    lista.innerHTML = '';

    consultas.forEach(c => {
        const paciente = pacientes.find(p => p.id == c.id_paciente);
        const nomePaciente = paciente ? paciente.nome : "Desconhecido";

        lista.innerHTML += `
            <li>
                <span><strong>${c.tipo}</strong> com Dr(a). ${c.nome_medico} (Paciente: ${nomePaciente})</span>
                <div>
                    <button class="btn-edit" onclick="editarConsulta(${c.id})">Editar</button>
                    <button class="btn-delete" onclick="deletarConsulta(${c.id})">Cancelar</button>
                </div>
            </li>`;
    });
}

// Agendar Consulta
document.getElementById('formConsulta').addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = {
        id_paciente: document.getElementById('id_paciente').value,
        tipo: document.getElementById('tipo').value,
        nome_medico: document.getElementById('nome_medico').value
    };

    const res = await fetch(API_CONSULTAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    if (res.ok) {
        alert('Consulta agendada!');
        e.target.reset();
        atualizarTelas();
    }
});

// Editar Consulta (PUT)
async function editarConsulta(id) {
    const res = await fetch(`${API_CONSULTAS}/${id}`);
    const c = await res.json();

    const novoTipo = prompt("Editar Tipo de Consulta:", c.tipo);
    const novoMedico = prompt("Editar Nome do Médico:", c.nome_medico);

    if (novoTipo && novoMedico) {
        await fetch(`${API_CONSULTAS}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id_paciente: c.id_paciente, // Mantém o vínculo com o mesmo paciente
                tipo: novoTipo, 
                nome_medico: novoMedico 
            })
        });
        alert('Consulta atualizada!');
        atualizarTelas();
    }
}

// Deletar Consulta
async function deletarConsulta(id) {
    if (confirm('Deseja cancelar esta consulta?')) {
        await fetch(`${API_CONSULTAS}/${id}`, { method: 'DELETE' });
        atualizarTelas();
    }
}
