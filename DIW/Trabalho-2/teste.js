import { Octokit } from "https://cdn.skypack.dev/@octokit/core";

const octokit = new Octokit({
    auth: `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`
});

const inputPesquisar = $('#inputPesquisa');
const form = $('.pesquisaRepositorio form');

form.on('submit',
    async function searchReposUser(e) {
        e.preventDefault();

        if (inputPesquisar.val()) {
            const reposUser = await octokit.request('GET /users/{username}/repos', {
                username: `${consertarCaracteres(inputPesquisar.val())}`,
                accept: 'application/vnd.github.v3 + json',
                per_page: 100
            })

            repositorios(reposUser.data);
        }
    }
);

function consertarCaracteres(nome) {
    const name = nome.split(" ").join("");
    name.toLowerCase();

    return name;
}

async function repositorios(infos) {
    const lista = infos.map(function(item) {
        return {
            name: item.name,
            description: item.description,
            html_url: item.html_url,
            created_at: item.created_at,
            updated_at: item.updated_at,
            visibility: item.visibility,
            size: item.size,
            login: item.owner.login,
            avatar: item.owner.avatar_url,
            perfil_link: item.owner.html_url
        }
    });

    //Função que cria a lista de repositórios
    criarLista(lista);
}

function criarLista(infos) {
    const perfil = document.querySelector('.content-list-container');

    // Ao iniciar uma pesquisa, a div 'perfil' é limpa
    perfil.innerHTML = "";

    // Criar uma div pra cada resultado da pesquisa
    const div = document.createElement('div');
    div.className = 'resultPerfil';

    // Criar elemento para comportar a imagem de cada usuário
    const img = document.createElement('img');
    img.src = `${infos[0].avatar}`;

    // Criar elemento para comportar o nome de cada usuário
    const namePerfil = document.createElement('a');
    namePerfil.setAttribute('href', infos[0].perfil_link);
    namePerfil.setAttribute('target', '_blank');
    namePerfil.setAttribute('title', 'Nome do usuário');
    namePerfil.appendChild(document.createTextNode(infos[0].login));

    // Atribuição dos elementos 'img' e 'namePerfil' à uma div
    div.appendChild(img);
    div.appendChild(namePerfil);
    perfil.appendChild(div);

    // Criação do elemento ul para armazenar as li's
    const ul = document.createElement('ul');
    ul.id = 'reposList';

    // Atribuição da lista à div
    perfil.appendChild(ul);

    for (const item of infos) {
        // Criar elemento para comportar o título do repositório
        const nameRepos = document.createElement('h3');
        nameRepos.appendChild(document.createTextNode(item.name));

        // Criar elemento 'visibility'
        const visibility = document.createElement('strong');

        // Verificação para saber se o repositório é público ou privado
        if (item.visibility == 'public')
            visibility.className = 'statusVisibility public';
        else
            visibility.className = 'statusVisibility private';

        visibility.appendChild(document.createTextNode(item.visibility));

        // Criar uma div para comportar o nome e a visibilidade do repositório
        const divHeader = document.createElement('div');
        divHeader.className = 'reposHeader';
        divHeader.appendChild(nameRepos);
        divHeader.appendChild(visibility);

        // Criar elemento 'created_at'
        const created_at = document.createElement('span');
        created_at.innerHTML = '<i class="fas fa-star"></i>';
        created_at.appendChild(document.createTextNode(arrumaData(item.created_at)));

        // Criar elemento 'updated_at'
        const updated_at = document.createElement('span');
        updated_at.innerHTML = '<i class="fas fa-cloud-upload-alt"></i>';
        updated_at.appendChild(document.createTextNode(arrumaData(item.updated_at)));

        // Criar elemento 'size'
        const size = document.createElement('span');
        size.appendChild(document.createTextNode(`${item.size} KB`));

        // Criar uma div para comportar o a data de criação, a data do último update e o tamanho do repositório
        const divInfos = document.createElement('div');
        divInfos.className = 'reposInfos';
        divInfos.appendChild(created_at);
        divInfos.appendChild(updated_at);
        divInfos.appendChild(size);

        // Criar elemento para comportar a descrição do repositório
        const descriptionEl = document.createElement('p');
        if (item.description == null)
            descriptionEl.innerText = "";
        else
            descriptionEl.appendChild(document.createTextNode(item.description));

        // Criação do elemento a
        const itemLink = document.createElement('a');
        itemLink.setAttribute('href', item.html_url);
        itemLink.setAttribute('target', '_blank');
        itemLink.className = 'itemLink';

        // Criação do elemento li
        const itemEl = document.createElement('li');
        itemEl.setAttribute('title', `${item.name}`);
        itemEl.className = 'itemList';

        // Atribuição das li's ao ul
        itemLink.appendChild(divHeader);
        itemLink.appendChild(divInfos);
        itemLink.appendChild(descriptionEl);
        itemEl.appendChild(itemLink);
        ul.appendChild(itemEl);
    }
}