function apiDados() {
    //Calcula o ano
    document.querySelector('#anoCpyright').innerHTML = new Date().getFullYear();

    let xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText);
            //console.log(data);
            perfil(data);
            repositorios(data);
            linkFooter(data);
        } else
            alert(`Erro código: ${this.status}`);
    }

    xhr.onerror = function() {
        alert(`Erro na requisição dos dados \nCódigo: ${this.status} - ${this.statusText}`);
    }

    xhr.open('GET', 'https://api.github.com/users/nikolaslouret');
    xhr.send();
}

function perfil(data) {
    $('#perfil').append(`<!--Imagem do perfil-->
                        <img src="${data.avatar_url}" id="avatar_img" title="Foto de Perfil">

                        <!--Texto e Redes do perfil-->
                        <div class="infosPerfil">
                            <!--Texto-->
                            <div class="texto_perfil">
                                <a href="${data.html_url}" target="_blank" title="Perfil no GitHub">${data.name}</a>
                                <p class="bio" title="Biografia">${data.bio}</p>
                            </div>

                            <div class="infos">
                                <div class="linha-1">
                                    <div id="location">
                                        <span><i class="fas fa-map-marker-alt"></i> Localização</span>
                                        : ${data.location}
                                    </div>

                                    <div id="created_at">
                                        <span><i class="fas fa-user"></i> Entrou</span>
                                        : ${arrumaData(data.created_at)}
                                    </div>
                                </div>

                                <div class="linha-2">
                                    <div id="public_repos">
                                        <span><i class="fab fa-github"></i> Repositórios</span>
                                        : ${data.public_repos}
                                    </div>

                                    <div id="email">
                                        <span><i class="fas fa-envelope"></i> Email</span>
                                        : nikoul.ret@gmail.com
                                    </div>
                                </div>
                            </div>
                            <a class="linkPerfil" href="${data.html_url}" target="_blank"><button id="btn-perfil" title="Acessar perfil no GitHub">Carregar perfil</button></a>
                        </div>`);
}

async function repositorios(data) {
    const api = async() => {
        const response = await fetch(`https://api.github.com/users/NikolasLouret/repos`, { method: "GET" });
        const repos = await response.json();

        return repos;
    }

    const api_data = await api();
    console.log(api_data);

    const lista = api_data.map(function(item) {
        return {
            name: item.name,
            created_at: item.created_at,
            updated_at: item.updated_at,
            description: item.description,
            html_url: item.html_url,
            location: item.location,
            twitter_username: item.twitter_username,
            public_repos: item.public_repos,
            visibility: item.visibility,
            size: item.size,
        }
    });

    console.log(lista);

    for (var i = 0; i < lista.length; i++) {
        $('.info_repositorio').append(`<a href="${lista[i].html_url}" class="reposContent" title="${lista[i].name}">
                                            <div class="reposTitle">
                                                <h3 title="${lista[i].name}">${lista[i].name}</h3>
                                            </div>
                                            <div class="text_repositorio">
                                                <p title="Descrição">${lista[i].description}</p>
                                                <div class="reposDates">
                                                    <span title="Data de criação"><i class="fas fa-star"></i> ${arrumaData(lista[i].created_at)}</span>
                                                    <span title="Última Atualização"><i class="fas fa-cloud-upload-alt"></i> ${arrumaData(lista[i].updated_at)}</span>
                                                    <span title="Tamanho do Repositório">${lista[i].size} KB</span>
                                                </div>
                                            </div>
                                        </a>`);

        // Criar elemento 'visibility'
        const visibilidade = document.createElement('strong');

        // Verificação para saber se o repositório é público ou privado
        if (lista[i].visibility == 'public')
            visibilidade.className = 'statusVisibility public';
        else
            visibilidade.className = 'statusVisibility private';

        visibilidade.appendChild(document.createTextNode(lista[i].visibility));

        const reposHeader = document.querySelectorAll('.reposTitle');
        reposHeader[i].appendChild(visibilidade);
    }
}

function linkFooter(data) {
    // Set the url to GitHub perfil
    const linkGitHub = document.getElementById('gitHub');
    linkGitHub.setAttribute('href', `${data.html_url}`);

    // Set the url to Twitter perfil
    const linkTwitter = document.getElementById('twitter');
    linkTwitter.setAttribute('href', `https://www.twitter.com/${data.twitter_username}`);
}

function arrumaData(data) {
    data = data.substr(0, data.indexOf("T"));
    var date = new Date(data);

    var dataFormatada = date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    return dataFormatada;
}