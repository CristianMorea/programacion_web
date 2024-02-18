// Se crea un objeto URLSearchParams a partir de los parámetros de la URL actual
const urlParams = new URLSearchParams(window.location.search);
// Se obtiene el valor del parámetro 'id' de la URL
const characterId = urlParams.get('id');

// Se construye la URL del personaje utilizando el ID obtenido
const characterUrl = `https://rickandmortyapi.com/api/character/${characterId}`;

// Función para obtener los detalles del personaje desde la API
function getCharacterDetailsFromApi() {
    // Se realiza una solicitud fetch para obtener los detalles del personaje
    fetch(characterUrl)
        .then((response) => {
            // Se verifica si la respuesta fue exitosa
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            // Se convierte la respuesta a formato JSON y se retorna
            return response.json();
        })
        .then((character) => {
            // Se muestran los detalles del personaje en la página
            displayCharacterDetails(character);
            // Se obtienen los nombres de los episodios en los que aparece el personaje
            const episodeUrls = character.episode;
            getEpisodeNames(episodeUrls);
        })
        .catch((error) => {
            // Se maneja cualquier error ocurrido durante la solicitud fetch
            console.error("Hubo un problema con la operación fetch:", error);
        });
}

// Función para mostrar los detalles del personaje en la página
function displayCharacterDetails(character) {
    const characterDetails = document.getElementById("characterDetails");
    // Se muestra la información del personaje en la página
    characterDetails.innerHTML = `
        <h2>Detalles del Personaje</h2>
        <p>Nombre: ${character.name}</p>
        <p>Especie: ${character.species}</p>
        <p>Estado: ${character.status}</p>
        <p>Género: ${character.gender}</p>
        <p>Origen: ${character.origin.name}</p>
        <p>Número de episodios en los que ha aparecido: ${character.episode.length}</p>
    `;
}

// Función para obtener los nombres de los episodios en los que aparece el personaje
function getEpisodeNames(episodeUrls) {
    // Se crea un array de promesas para obtener los nombres de los episodios
    const episodePromises = episodeUrls.map((episodeUrl) => {
        // Se realiza una solicitud fetch para obtener los detalles del episodio
        return fetch(episodeUrl)
            .then((response) => response.json())
            .then((episode) => {
                // Se retorna el nombre del episodio
                return episode.name;
            });
    });

    // Se esperan a que todas las promesas se resuelvan
    Promise.all(episodePromises)
        .then((episodeNames) => {
            // Una vez resueltas, se muestran los nombres de los episodios en la página
            displayEpisodeNames(episodeNames);
        })
        .catch((error) => {
            // Se maneja cualquier error ocurrido durante la obtención de los nombres de los episodios
            console.error("Hubo un problema al obtener los nombres de los episodios:", error);
        });
}

// Función para mostrar los nombres de los episodios en la página
function displayEpisodeNames(episodeNames) {
    const characterDetails = document.getElementById("characterDetails");
    const episodeList = document.createElement("div");
    // Se muestra la lista de nombres de episodios en la página
    episodeList.innerHTML = `
        <h3>Episodios en los que aparece:</h3>
        <ul>
            ${episodeNames.map(name => `<li>${name}</li>`).join('')}
        </ul>
    `;
    characterDetails.appendChild(episodeList);
}

// Evento al cargar la página para obtener los detalles del personaje del API
document.addEventListener("DOMContentLoaded", getCharacterDetailsFromApi);

// Event listeners para los botones y enlace de perfil
