window.onload = async () => {
    let testEntityAdded = false;

    /* ####### mock parametros recibidos URL ######## */
    /* funcion para obtener parametros desde la URL */
    const urlParams = new URLSearchParams(window.location.search)
    console.log('1. Datos del url params: ', urlParams)
    /* Prueba mock url */
    /* http://localhost:5173/?lat=4.8029365/&lng=-75.7342656/&usr=dzWnzQ4fkQnVPJj2UfEt/&uuid=2ece92d1a7e54dd3b5a2dc2620afd6af 
     js puro: http://127.0.0.1:5500/?lat=4.8029365/&lng=-75.7342656/&usr=dzWnzQ4fkQnVPJj2UfEt/&uuid=2ece92d1a7e54dd3b5a2dc2620afd6af */
    /* Prueba phone: https://6qt78s9s-5173.use2.devtunnels.ms/?lat=4.8029365/&lng=-75.7342656/&usr=dzWnzQ4fkQnVPJj2UfEt/&uuid=2ece92d1a7e54dd3b5a2dc2620afd6af */
    /* Api Real: https://itssoluciones.co/tesoro/?lat=4.8029365/&lng=-75.7342656/&usr=dzWnzQ4fkQnVPJj2UfEt/&uuid=2ece92d1a7e54dd3b5a2dc2620afd6af */

    const user = urlParams.get("usr");
    const userId = urlParams.get("uuid") || "1234";
    const latitude = parseFloat(urlParams.get("lat")) || 4.8029365; // Coordenada mockeada ubicacion casa
    const longitude = parseFloat(urlParams.get("lng")) || -75.7342656; // Coordenada mockeada ubicacion casa

    console.log(`2. Datos recibidos del api mockeada:  Usuario: ${user}, User-ID: ${userId}, Latitud: ${latitude}, Longitud: ${longitude}`);
    /* ####### mock parametros recibidos URL ######## */
    

    const el = document.querySelector("[gps-new-camera]");

    el.addEventListener("gps-camera-update-position", e => {
        if(!testEntityAdded) {
            //alert(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);
            alert(`Got first GPS position: lon ${data.longitude} lat ${data.latitude}`);
           
            /* Add a model to the nort of the initial GPS position */
            const cofre = document.createElement('a-entity')
            /* Atributos modelo */
            cofre.setAttribute("scale", {
                x: 0.50, 
                y: 0.50,
                z: 0.50
            });
            cofre.setAttribute('position', {
                x: 0,
                y: -2,
                z: -8
            });
            cofre.setAttribute('gltf-model', './assets/cofre_zelda/scene.gltf');
            cofre.setAttribute('rotation', '40 0 0');
            cofre.setAttribute('animation-mixer', '');
            cofre.setAttribute('desaparecer-al-tocar', '');
            cofre.setAttribute('gps-new-entity-place', {
                /* Calcula la ubicacion y pone el modelo en estas coordenadas */
                /* latitude: e.detail.position.latitude + 0.001,
                longitude: e.detail.position.longitude */
                latitude: data.latitude + 0.001,
                longitude: data.longitude
            });
            document.querySelector("a-scene").appendChild(cofre);

            /*  ***** segundo modelo ******* */
            const congratulations = document.createElement('a-entity')
            congratulations.setAttribute('id', 'objeto-capturado');
            congratulations.setAttribute("scale", {
                x: 0.90, 
                y: 0.90,
                z: 0.90
            });
            congratulations.setAttribute('position', {
                x: 0,
                y: -10,
                z: -8
            });
            congratulations.setAttribute('gltf-model', './assets/popmii/scene.gltf');
            congratulations.setAttribute('animation-mixer', '');
            congratulations.setAttribute('visible', false);
            congratulations.setAttribute('gps-new-entity-place', {
                latitude: e.detail.position.latitude + 0.001,
                longitude: e.detail.position.longitude
                
            });
            document.querySelector("a-scene").appendChild(congratulations);
        }
        testEntityAdded = true;
    });

    
};