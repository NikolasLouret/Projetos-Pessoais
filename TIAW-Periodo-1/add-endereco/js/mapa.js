// Importar a chave da API do mapa
//import { APIKEY } from "./apikey.js";

// Recupera as coordenadas do localSession
let coordenadas = JSON.parse(window.sessionStorage.getItem("coordenadas"));

// Chama a função que pega as coordenadas do usuáriovar
if (!coordenadas)
    getLocation();

// Se não tem as coordenadas do usuário, coloca como sendo o marco central de BH
if (!coordenadas) {
    coordenadas = {
        lat: -19.916667,
        lng: -43.933333,
    };
}

// Função que pega as coordenadas do usuário
function getLocation() {
    // Verifica se o navegador suporta geolocalização
    if (navigator.geolocation) {
        // caso sim, chama a função que vai guardar as coordenadas
        navigator.geolocation.getCurrentPosition(myLocation);
    }
    // Caso não, mostra um mensagem de erro
    else {
        alert("O seu navegador não suporta Geolocalização.");
    }

    // Função que guarda as coordenadas do usuário, recebendo a posição como parâmetro
    function myLocation(position) {
        // Cria o objeto e guarda as coordenadas
        let objetoCoordenadas = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };

        // Salva tudo no localSession
        window.sessionStorage.setItem(
            "coordenadas",
            JSON.stringify(objetoCoordenadas)
        );
    }
}

// Criar o mapa
mapboxgl.accessToken = 'pk.eyJ1Ijoibmlrb2xhc2xvdXJldCIsImEiOiJja3Z5MWF5aTQ5djUyMnVxMXpwZHFtY3p3In0.tmhesiuf4EmWuiptIuhaAg';
const map = new mapboxgl.Map({
    // ID do container do map
    container: 'map',
    // URL do estilo do mapa padrão
    style: 'mapbox://styles/mapbox/streets-v11',
    // Iniciando com a posição das coordenadas [lng, lat] do usuário, caso tenha
    center: [coordenadas.lng, coordenadas.lat],
    // Define o zoom inicial do mapa
    zoom: 13,
    //Permite controlar o zoom com o scroll do mouse
    scrollZoom: true
});