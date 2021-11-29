var idPerguntaModal;

function validacaoForm() {
    var asterisco;

    //Verificar os campos do formulário das perguntas individualmente
    const fields = document.querySelectorAll("[required]");

    function validateField(field) {
        //Lógica para verificar se existem erros
        function verifyErrors() {
            let foundError = false;

            for (key in field.validity) {
                if (field.validity[key] && !field.validity.valid)
                    foundError = key;
            }

            return foundError;
        }

        function setCustomMessage(message) {
            if (message) {
                $(field).attr('placeholder', field.placeholder + message);
            }
        }

        return function() {
            if (verifyErrors()) {
                field.style.border = "1px solid red";

                if (!asterisco) {
                    setCustomMessage("*");
                    asterisco = true;
                }
            } else {
                field.style.border = "1px solid rgb(0, 201, 0)";
                setCustomMessage();
            }
        }
    }

    function customValidation(event) {
        const field = event.target;
        const validation = validateField(field);
        if (field.placeholder == "Nome" || field.placeholder == "Título da pergunta" || field.placeholder == "Descreva o problema")
            asterisco = false;
        else asterisco = true;
        validation();
    }

    for (field of fields) {
        field.addEventListener("invalid", event => {
            //Tirar o bubble
            event.preventDefault();

            customValidation(event);
        })

        field.addEventListener("blur", customValidation);
    }
}

function addPergunta() {
    //Faz a verificação individual de cada campo do formulário
    validacaoForm();

    // Verfica se o formulário está preenchido corretamente
    if (!$('#form-perguntas')[0].checkValidity()) {
        return;
    }

    // Obtem os valores dos campos do formulário
    let campoNome = $("#inputNome").val();
    let campoTitulo = $("#inputTitulo").val();
    let campoTexto = $("#inputProblema").val();
    let pergunta = {
        nickname: campoNome,
        titulo_pergunta: campoTitulo,
        texto: campoTexto
    }

    //Adicionar a nova pergunta no banco de dados
    insertPergunta(pergunta);

    //Recarregar a página
    location.reload();
}

function alterarPergunta() {
    //Faz a verificação individual de cada campo do formulário
    validacaoForm();

    // Verfica se o formulário está preenchido corretamente
    if (!$('#form-perguntas-modal')[0].checkValidity()) {
        return;
    }

    // Intercepta o click do botão Alterar
    let campoNome = $("#inputNomeModal").val();
    let campoTitulo = $("#inputTituloModal").val();
    let campoTexto = $("#inputProblemaModal").val();
    let pergunta = {
        nickname: campoNome,
        titulo_pergunta: campoTitulo,
        texto: campoTexto
    }

    //Adicionar os novos dados no banco de dados
    updatePergunta(parseInt(idPerguntaModal.id), pergunta);

    //Recarregar a página
    location.reload();
}

function descobrirId(idPergunta) {
    //Descobrir qual o id da pergunta
    idPerguntaModal = db.data.find(element => element.id == idPergunta);
}

function apagarPergunta() {
    //Apaga os dados da pergunta no banco de dados
    deletePergunta(parseInt(idPerguntaModal.id));

    //Recarregar a página
    location.reload();
}

function gerarModal() {
    $(".modal-header").html("");
    $("#corpoModal").html("");

    // Gera o modal com a pergunta
    $("#tituloModal").append(`<h5 id="titulo_disc">${idPerguntaModal.titulo_pergunta}</h5>
                                        <button id="fecharModalMostrarPergunta" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`);

    $("#corpoModal").append(`<p id="p1-pergunta">${idPerguntaModal.nickname}</p>
                                        <p id="p2-pergunta" class="p2-modal">${idPerguntaModal.texto}</p>`);
}

function editarModal() {
    //Preenche os campos do modal para possível edição
    $("#inputNomeModal").val($("#p1-pergunta").text());
    $("#inputTituloModal").val($("#titulo_disc").text());
    $("#inputProblemaModal").val($("#p2-pergunta").text());
}

function filtroPerguntas() {
    const inputSearch = document.querySelector('#barra-pesquisa input');
    const filterInput = document.querySelector("#search");
    const filterList = document.querySelector('#historico');
    const cleanButton = document.querySelector("#cleanButton");
    const searchButton = document.querySelector("#searchButton");
    const posts = document.querySelectorAll("#conteudo_discussao li");

    const filterResults = (results, inputValue, returnMatchedResults) => results
        .filter(result => {
            const matchedResults = result.textContent.toLowerCase().includes(inputValue);
            return returnMatchedResults ? matchedResults : !matchedResults;
        });

    const hideResults = (results, inputValue) => {
        filterResults(results, inputValue, false)
            .forEach(result => {
                result.classList.remove('block');
                result.classList.add('hidden');
            });
    }

    const showResults = (results, inputValue) => {
        filterResults(results, inputValue, true)
            .forEach(result => {
                result.classList.remove('hidden');
                result.classList.add('block');
            });
    }

    const showPostIfMatchInputValue = inputValue => post => {
        const postTitle = post.querySelector('#tituloPergunta').textContent.toLocaleLowerCase();
        const postBody1 = post.querySelector('#p1-pergunta').textContent.toLocaleLowerCase();
        const postBody2 = post.querySelector('#p2-pergunta').textContent.toLocaleLowerCase();
        const postContainsInputValue = postTitle.includes(inputValue) ||
            postBody1.includes(inputValue) ||
            postBody2.includes(inputValue);

        if (postContainsInputValue) {
            post.style.display = 'block';
            return
        }

        post.style.display = 'none';
    }

    const cleanInput = event => {
        inputSearch.value = "";

        posts.forEach(post => {
            post.style.display = 'block';
        });

        switchSearchIcon();
    }

    function switchSearchIcon() {
        if (inputSearch.value.length > 0) {
            searchButton.classList.remove("block");
            searchButton.classList.add("hidden");

            cleanButton.classList.remove("hidden");
            cleanButton.classList.add("block");
        } else {
            searchButton.classList.remove("hidden");
            searchButton.classList.add("block");

            cleanButton.classList.remove("block");
            cleanButton.classList.add("hidden");
        }
    }

    const handleInputValue = event => {
        const inputValue = event.target.value.trim().toLowerCase();
        const results = Array.from(filterList.children);


        posts.forEach(showPostIfMatchInputValue(inputValue));

        hideResults(results, inputValue);
        showResults(results, inputValue);

        switchSearchIcon();
    }

    filterList.addEventListener('click', event => {
        const inputValue = event.target.textContent.toLocaleLowerCase();

        posts.forEach(showPostIfMatchInputValue(inputValue));

        filterInput.value = event.target.textContent;
    });

    inputSearch.addEventListener('input', handleInputValue);

    inputSearch.addEventListener('blur', switchSearchIcon());

    cleanButton.addEventListener('click', cleanInput);
}
const btnMobile = document.getElementById('btn-mobile');

function toggleMenu() {
    const nav = document.getElementById("nav");

    nav.classList.toggle('active');
}

$(document).ready(function() {
    //Calcula o ano
    document.querySelector('#ano').innerHTML = new Date().getFullYear();

    //Limpa todas as informações do Data Base
    $("#conteudo_discussao").html("");
    $("#historico").html("");

    // Popula a lista com os registros do banco de dados
    for (i = 0; i < db.data.length; i++) {
        let discus = db.data[i];
        $("#conteudo_discussao").append(`<li display="block" class="perguntaLinha" data-bs-target="#modal-pergunta" data-bs-toggle="modal" id="${discus.id}">
                                                    <h5 id="tituloPergunta">${discus.titulo_pergunta}</h5>           
                                                    <p id="p1-pergunta">${discus.nickname}</p>
                                                    <p id="p2-pergunta">${discus.texto}</p>
                                                    <hr>
                                                </li>`);
        $("#historico").append(`<option id="historicoPesquisa">${discus.titulo_pergunta}</option>`);
    }


    // Identifica qual pergunta clickada 
    $("#conteudo_discussao").on("click", "li", function(e) {
        let linhaPergunta = this;
        descobrirId(linhaPergunta.id);
        gerarModal();
    });
})