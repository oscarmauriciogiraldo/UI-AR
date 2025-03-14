window.onload = async () => {

    let testEntityAdded = false;
    let estadoPista = 'PistaVista'
    const minDistance = 10
    /* ***** modal ***** */
    const modal = document.getElementById('modal-container')
    /* let modalShow = false
    const myModal = new bootstrap.Modal(document.getElementById("distanceModal")) */

    /* const distanceOut = document.getElementById('textModal')
    distanceOut.innerHTML = `` */
    /* funcion para obtener parametros desde la URL */
    function getUrlParams(){
        const params = new URLSearchParams(window.location.search)
        return {
            user: params.get("usr"),
            userId: params.get("uuid"),
            latitude: parseFloat(params.get("lat")), // Coordenada mockeada ubicacion casa
            longitude: parseFloat(params.get("lng")), // Coordenada mockeada ubicacion casa
        }

    }
    /* ####### mock parametros recibidos URL ######## */

    //obtener parámetros (mockeados o reales)
    const { user, userId, latitude, longitude } = getUrlParams()
    console.log(`1. Datos recibidos del URL mockeada:  Usuario: ${user}, User-ID: ${userId}, Latitud: ${latitude}, Longitud: ${longitude}`);
    

    //Botón finalizar juego

    /* ********** Calcular distancia entre dos puntos ************* */
    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000;
        const rad = Math.PI / 180;
        const dLat = (lat2 - lat1) * rad;
        const dLon = (lon2 - lon1) * rad;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    

    const el = document.querySelector("[gps-new-camera]");

    el.addEventListener("gps-camera-update-position", (e) => {

        const userLat =  e.detail.position.latitude
        const userLng = e.detail.position.longitude

        const distance = getDistance(userLat, userLng, latitude, longitude)

        if(!testEntityAdded ) {

            /* **** Declaracion de modelos 3D **** */
            const cofre = document.createElement('a-entity')
            const congratulations = document.createElement('a-entity')

            /**
             * Verifica si el rango de distancia es la minima
             * @constant {number} minDistance - distancia minima
             */
            if(distance <= minDistance){
                //alert(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);
                //alert(`2. Ubicacion recibida por parametros: lon ${longitude} lat ${latitude} for user ${user}`);
                /* Atributos modelo */
                cofre.setAttribute("scale", {
                    x: 0.50, 
                    y: 0.50,
                    z: 0.50,
                });
                cofre.setAttribute('position', {
                    x: 0,
                    y: -10,
                    z: -8
                });
                cofre.setAttribute('gltf-model', './assets/cofre_zelda/scene.gltf');
                cofre.setAttribute('rotation', '40 10 0');
                cofre.setAttribute('animation-mixer', '');
                cofre.setAttribute('desaparecer-al-tocar', '');
                /* Add a model to the nort of the initial GPS position  */
                cofre.setAttribute('gps-new-entity-place', {
                    latitude: latitude + 0.001,
                    longitude: longitude,
                });
                cofre.setAttribute('visible', true)
                console.log('3. Modelo ubicado en  Latitud y longitud recibidas', latitude, longitude)

                /* ***** Segundo modelo 3d ****** */
                congratulations.setAttribute('id', 'objeto-capturado');
                congratulations.setAttribute("scale", {
                    x: 0.90,
                    y: 0.90,
                    z: 0.90
                });
                congratulations.setAttribute('position', {
                    x: 0,
                    y: -2,
                    z: -8
                });
                congratulations.setAttribute('gltf-model', './assets/popmii/scene.gltf');
                congratulations.setAttribute('animation-mixer', '');
                congratulations.setAttribute('visible', false);
                congratulations.setAttribute('gps-new-entity-place', {
                    latitude: latitude + 0.001,
                    longitude: longitude
                    
                });

                /* ****** Interacción con el Modelo (cofre) ******** */
                cofre.addEventListener('click', async () => {

                    if (estadoPista === 'PistaVista'){
                        estadoPista = 'Capturado'
                        alert(`Enviando estado de la pista, estado: ${estadoPista}`)

                        console.log('objeto tocado')
                        alert('4. Pista Capturada')
                        cofre.setAttribute('animation', {
                            property: 'scale',
                            to: '0 0 0',
                            dur: 1000,
                            easing: 'easeOutQuad'
                        });
                        // Desactivar el objeto1 y mostrar el modelo 2
                        setTimeout(() => {
                            cofre.setAttribute('visible', false);
                            congratulations.setAttribute('visible', true);
                            
                        }, 1000);
                    }
                    
                })

            } else {
                /* ** usuario fuera del rango ** */
                modal.classList.add('show-modal')
                //alert(`Tu objetivo esta fuera de alcance, se encuentra a ${distance.toFixed(2)} metros de tu ubicacion actual`)
                const distanceOut = document.getElementById('textModal')
                distanceOut.innerHTML = `Destino a ${distance.toFixed(2)} Metros` 
                cofre.setAttribute('visible', false)

                /* ***** Close Modal ***** */
                const closeBtn = document.querySelectorAll('.close-modal')

                function closeModal(){
                    const modalContainer = document.getElementById('modal-container')
                    modalContainer.classList.remove('show-modal')
                }
                closeBtn.forEach(c => c.addEventListener('click', closeModal))
            }

            
           
           
            
            document.querySelector("a-scene").appendChild(cofre);            
            document.querySelector("a-scene").appendChild(congratulations);

            // Obtener posición del usuario y actualizar icono de guía
            /* el.addEventListener("gps-camera-update-position", evt => {
                actualizarDireccion(evt.detail.position.latitude, evt.detail.position.longitude, latitude + 0.001, longitude);
            }); */
        }
        testEntityAdded = true;
    });

    
};