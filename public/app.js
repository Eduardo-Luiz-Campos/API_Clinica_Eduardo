// URLs da API
const API_PACIENTES = '/pacientes';
const API_CONSULTAS = '/consultas';

// Ao carregar a página, busca os dados
document.addEventListener('DOMContentLoaded', () => {
    atualizarTelas();
});

// Função principal para atualizar as listas e o select
async function atualizarTelas() {
    await listarPacientes();
    await listarConsultas();
    await carregarPacientesNoSelect();
}

// __________________________________________ LÓGICA DE PACIENTES __________________________________________________

async function listarPacientes() {
    const res = await fetch(API_PACIENTES);
    const pacientes = await res.json();
    const lista = document.getElementById('listaPacientes');
    lista.innerHTML = '';

    pacientes.forEach(p => {
        lista.innerHTML += `
            <li>
                <strong>${p.nome}</strong> (CPF: ${p.cpf}) - ${p.idade} anos
                <button class="btn-delete" onclick="deletarPaciente(${p.id})">Excluir</button>
            </li>`;
    });
}

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
        alert('Paciente cadastrado!');
        e.target.reset();
        atualizarTelas();
    }
});

async function deletarPaciente(id) {
    if (confirm('Deseja excluir este paciente?')) {
        await fetch(`${API_PACIENTES}/${id}`, { method: 'DELETE' });
        atualizarTelas();
    }
}

// --- LÓGICA DE CONSULTAS (RELACIONAMENTO) ---

async function carregarPacientesNoSelect() {
    const res = await fetch(API_PACIENTES);
    const pacientes = await res.json();
    const select = document.getElementById('id_paciente');
    
    // Mantém a opção padrão e limpa o resto
    select.innerHTML = '<option value="">Selecione o Paciente</option>';
    
    pacientes.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.nome;
        select.appendChild(option);
    });
}

async function listarConsultas() {
    const resConsultas = await fetch(API_CONSULTAS);
    const consultas = await resConsultas.json();
    
    const resPacientes = await fetch(API_PACIENTES);
    const pacientes = await resPacientes.json();

    const lista = document.getElementById('listaConsultas');
    lista.innerHTML = '';

    consultas.forEach(c => {
        // Busca o nome do paciente pelo ID para exibir na tela
        const paciente = pacientes.find(p => p.id == c.id_paciente);
        const nomePaciente = paciente ? paciente.nome : "Paciente não encontrado";

        lista.innerHTML += `
            <li>
                <strong>Consulta: ${c.tipo}</strong><br>
                Paciente: ${nomePaciente} | Médico: ${c.nome_medico}
                <button class="btn-delete" onclick="deletarConsulta(${c.id})">Cancelar</button>
            </li>`;
    });
}

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

async function deletarConsulta(id) {
    if (confirm('Deseja cancelar esta consulta?')) {
        await fetch(`${API_CONSULTAS}/${id}`, { method: 'DELETE' });
        atualizarTelas();
    }
}
