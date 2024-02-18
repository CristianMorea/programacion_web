function mostrarAnimales() {
    fetch('animales.json')
        .then(response => response.json())
        .then(data => {
            let html = '<div class="row">';
            data.forEach(animal => {
                html += `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <img src="${animal.foto}" class="card-img-top" alt="${animal.nombre}">
                            <div class="card-body">
                                <h5 class="card-title">${animal.nombre}</h5>
                                <p class="card-text">${animal.descripcion}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            document.getElementById('animalesContainer').innerHTML = html;
        })
        .catch(error => console.error('Error al obtener los datos:', error));
}

function mostrarTodosLosPersonajes() {
    document.getElementById('animalesContainer').innerHTML = '';

    const baseUrl = 'https://rickandmortyapi.com/api/character/';
    const promises = [];
    fetch(baseUrl)
        .then(response => response.json())
        .then(data => {
            const totalCharacters = data.info.count;
            const totalPages = Math.ceil(totalCharacters / data.results.length);
            for (let i = 1; i <= totalPages; i++) {
                promises.push(fetch(`${baseUrl}?page=${i}`).then(response => response.json()));
            }
            Promise.all(promises)
                .then(pagesData => {
                    let html = '<div class="row">';
                    pagesData.forEach(pageData => {
                        pageData.results.forEach(character => {
                            html += `
                                <div class="col-md-4 mb-4">
                                    <div class="card">
                                        <img src="${character.image}" class="card-img-top" alt="${character.name}" data-id="${character.id}" data-url="${character.url}">
                                        <div class="card-body">
                                            <h5 class="card-title">${character.name}</h5>
                                            <p class="card-text">Status: ${character.status}</p>
                                            <p class="card-text">Species: ${character.species}</p>
                                        </div>
                                    </div>
                                </div>
                            `;
                        });
                    });
                    html += '</div>';
                    document.getElementById('rickMortyContainer').innerHTML = html;

                    // Agregar evento de clic a cada tarjeta de personaje de Rick y Morty
                    document.querySelectorAll('#rickMortyContainer .card').forEach(card => {
                        card.addEventListener('click', function() {
                            const characterId = this.querySelector('img').getAttribute('data-id');
                            const characterUrl = this.querySelector('img').getAttribute('data-url');
                            // Redireccionar a la página de información del personaje
                            window.location.href = `character_info.html?id=${characterId}&url=${encodeURIComponent(characterUrl)}`;
                        });
                    });
                })
                .catch(error => console.error('Error al obtener los datos de los personajes:', error));
        })
        .catch(error => console.error('Error al obtener el número total de personajes:', error));
}
function mostrarPerfilUsuario() {
    // Limpiar el contenido previo en el contenedor del perfil
    const perfilContainer = document.getElementById('perfilContainer');
    perfilContainer.innerHTML = '';

    // Obtener y mostrar los datos del perfil
    fetch('perfil.json')
        .then(response => response.json())
        .then(data => {
            // Obtener los datos del perfil
            const nombre = data.nombre;
            const edad = data.edad;
            const ocupacion = data.ocupacion;
            const descripcion = data.descripcion;

            // Mostrar los datos del perfil en el contenedor
            perfilContainer.innerHTML = `
                <h2>Datos de Perfil</h2>
                <p>Nombre: ${nombre}</p>
                <p>Edad: ${edad}</p>
                <p>Ocupación: ${ocupacion}</p>
                <p>Descripción: ${descripcion}</p>
            `;
        })
        .catch(error => console.error('Error al obtener los datos del perfil:', error));
}



// Asociar el evento de clic al botón "Perfil"

document.getElementById('btnPerfil').addEventListener('click', mostrarPerfilUsuario);
document.getElementById('btnRickMorty').addEventListener('click', mostrarTodosLosPersonajes);
document.getElementById('btnAnimales').addEventListener('click', mostrarAnimales);
