Este projeto é uma aplicação Full-Stack desenvolvida para o trabalho avaliativo da disciplina de Back-End. O sistema permite o gerenciamento de pacientes e o agendamento de consultas médicas.

Tecnologias Utilizadas:
Node.js e Express, Arquivos JSON (módulo fs), HTML5, CSS3 e JavaScript (Fetch API) e Git e GitHub

Estrutura do Projeto:
    /routes: Definição das rotas de Pacientes e Consultas.
    /data: Arquivos JSON para persistência dos dados.
    /public: Arquivos estáticos do front-end (interface do usuário).
    index.js: Ponto de entrada da aplicação e configuração do servidor.

Endpoints da API:

    Pacientes:
        GET	    /pacientes	    Lista todos os pacientes
        GET	    /pacientes/:id	Busca um paciente por ID
        POST	/pacientes	    Cadastra um novo paciente
        PUT	    /pacientes/:id	Atualiza dados de um paciente
        DELETE	/pacientes/:id	Remove um paciente
    
    Consultas:
        GET	    /consultas	    Lista todas as consultas
        GET	    /consultas/:id	Busca uma consulta por ID
        POST	/consultas	    Cadastra uma nova consulta
        PUT	    /consultas/:id	Atualiza uma consulta
        DELETE	/consultas/:id	Remove uma consulta

Autor: Eduardo Luiz Campos 




