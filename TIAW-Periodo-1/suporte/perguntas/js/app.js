var db_perguntas = {
    "data": [{
            "id": 1,
            "nickname": "Wellington",
            "titulo_pergunta": "Como faz para criar um aviso de buraco no mapa?",
            "texto": "Onde eu moro tem muito buraco na rua, e eu queria criar alguns avisos no mapa pra mostrar pras outras pessoas onde eles estão. As únicas opções que eu encontro é de acidente, engarrafamento e pista alagada.",
        },
        {
            "id": 2,
            "nickname": "Cleber",
            "titulo_pergunta": "Como faz pra mudar a visualização do gráfico da inclinação da rua?",
            "texto": "Sempre que tem uma rua mais inclinada, o site avisa através de um gráfico. Porém eu não entendo ele direito e eu queria mudar a vizualização dele pra outra mais simples."
        },
        {
            "id": 3,
            "nickname": "Luiz",
            "titulo_pergunta": "Como que faz pra registrar o carro como forma de locomoção?",
            "texto": "Eu comprei um carro novo e queria mudar as formas de transporte pra aparecer apenas carro. O padrão é mostrar todos os meios de transporte, e eu queria mudar isso. Como que faz?"
        },
        {
            "id": 4,
            "nickname": "Andriano",
            "titulo_pergunta": "Como faço pra tirar as marcações dos lugares do meu mapa",
            "texto": "Outro dia eu tava fazendo uma rota no site e não conseguia ver as ruas no mapa porque tinha muita marcação. Eu não gosto dessas marcações, por isso eu queria tirar. Eu fui nas configurações do mapa mas eu não encontrei nada. Alguém pode me ajudar?"
        },
        {
            "id": 5,
            "nickname": "Wesley Wagner",
            "titulo_pergunta": "Como faz pra reportar as rotas erradas?",
            "texto": "Eu moro no interior e toda vez que eu faço um percurso, o site me indica uma rota que toda errada. Eu queria reportar essas rotas para que elas não apareçam mais. Obrigado!!!!"
        }
    ]
}

// Caso os dados já estejam no Local Storage, caso contrário, carrega os dados iniciais
var db = JSON.parse(localStorage.getItem('db_quests'));
if (!db) {
    db = db_perguntas;
}

function insertPergunta(pergunta) {
    let novoId

    if (!db.data.length) {
        novoId = 1;
    } else {
        novoId = db.data[db.data.length - 1].id + 1;
    }

    let novaPergunta = {
        "id": novoId,
        "nickname": pergunta.nickname,
        "titulo_pergunta": pergunta.titulo_pergunta,
        "texto": pergunta.texto
    }

    // Insere o novo objeto no array
    db.data.push(novaPergunta);

    // Atualiza os dados no Local Storage
    localStorage.setItem('db_quests', JSON.stringify(db));
}


function updatePergunta(id, pergunta) {
    // Localiza o indice do objeto a ser alterado no array a partir do seu ID
    let index = db.data.map(obj => obj.id).indexOf(id);

    // Altera os dados do objeto no array
    db.data[index].nickname = pergunta.nickname,
        db.data[index].titulo_pergunta = pergunta.titulo_pergunta,
        db.data[index].texto = pergunta.texto;

    // Atualiza os dados no Local Storage
    localStorage.setItem('db_quests', JSON.stringify(db));
}


function deletePergunta(id) {
    // Filtra o array removendo o elemento com o id passado
    db.data = db.data.filter(function(element) { return element.id != id });

    // Atualiza os dados no Local Storage
    localStorage.setItem('db_quests', JSON.stringify(db));
}