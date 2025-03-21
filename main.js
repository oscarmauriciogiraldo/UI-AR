async function fetchData() {
    try {
        const response = await fetch("https://itssoluciones.co/cda/controller/categoria.php?op=CatchPoint");
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }
        const data = await response.json();
        console.log("Datos recibidos desde la API:", data);
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
}

window.onload = async () => {

    await fetchData()
    
    let testEntityAdded = false;
    let estadoPista = 'PistaVista'
    const minDistance = 10
    /* ***** modal ***** */
    const modal = document.getElementById('modal-container')
    const indicePont = document.getElementById('indicePoint-container')
    
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

        const cofreLat = latitude + 0.001
        const cofrelng = longitude

        /* function actualizarIndiceGuia(objLat, objLon) {
            if (userLat && userLng) {
                let deltaX = objLon - userLng;
                let deltaY = objLat - userLat;
                let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                let screenX = (angle / 180) * (window.innerWidth / 2) + (window.innerWidth / 2);
                indicePont.style.left = `${screenX}px`;
            }
        } */

        function actualizarPuntoGuia() {
            if (userLat !== null && userLng !== null && latitude !== null && longitude !== null) {
                let deltaLat = cofreLat - userLat;
                let deltaLon = cofrelng - userLng;
                
                let angle = Math.atan2(deltaLat, deltaLon) * (180 / Math.PI);
                indicePont.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
                
                
                /* const distancia = Math.sqrt(deltaLat * deltaLat + deltaLon * deltaLon) * 111139; // Convertir a metros
                if (distancia < radioMinimo) {
                    indicePont.style.display = 'none';
                } else {
                    indicePont.style.display = 'block';
                } */
            }
        }
       /*  setInterval(actualizarPuntoGuia, 1000); */
        actualizarPuntoGuia();

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

                indicePont.classList.add('show-indice')
                
               
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
                    latitude: cofreLat,
                    longitude: cofrelng,
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
                    indicePont.classList.add('show-indice')

                }
                closeBtn.forEach(c => c.addEventListener('click', closeModal))
            }

        
            
            document.querySelector("a-scene").appendChild(cofre);            
            document.querySelector("a-scene").appendChild(congratulations);

            /* actualizarIndiceGuia(userLat + 0.001, userLng); */
        }
        testEntityAdded = true;
    });

    
};