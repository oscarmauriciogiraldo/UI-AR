window.onload = async () => {
    let testEntityAdded = false;

    /* funcion para obtener parametros desde la URL */
    function getUrlParams(){
        const params = new URLSearchParams(window.location.search)
        return {
            user: params.get("usr"),
            userId: params.get("uuid") || "1234",
            latitude: parseFloat(params.get("lat")) || 4.8029365, // Coordenada mockeada ubicacion casa
            longitude: parseFloat(params.get("lng")) || -75.7342656, // Coordenada mockeada ubicacion casa
        }

    }
    /* Prueba mock url */
    /* http://localhost:5173/?lat=4.8029365/&lng=-75.7342656/&usr=dzWnzQ4fkQnVPJj2UfEt/&uuid=2ece92d1a7e54dd3b5a2dc2620afd6af */
    /* Prueba phone: https://6qt78s9s-5173.use2.devtunnels.ms/?lat=4.8029365/&lng=-75.7342656/&usr=dzWnzQ4fkQnVPJj2UfEt/&uuid=2ece92d1a7e54dd3b5a2dc2620afd6af */
    /* Api Real: https://itssoluciones.co/tesoro/?lat=4.8029365/&lng=-75.7342656/&usr=dzWnzQ4fkQnVPJj2UfEt/&uuid=2ece92d1a7e54dd3b5a2dc2620afd6af */

    //obtener parámetros (mockeados o reales)
    const { user, userId, latitude, longitude } = getUrlParams()
    console.log(`1. Datos recibidos del api mockeada:  Usuario: ${user}, User-ID: ${userId}, Latitud: ${latitude}, Longitud: ${longitude}`);
    /* ####### mock parametros recibidos URL ######## */
    

    const el = document.querySelector("[gps-new-camera]");

    el.addEventListener("gps-camera-update-position", e => {
        if(!testEntityAdded) {
            //alert(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);
            alert(`2. Ubicacion recibida por parametros: lon ${longitude} lat ${latitude} for user ${user}`);
           
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
                latitude: latitude + 0.001,
                longitude: longitude,
            });
            console.log('3. Modelo ubicado en  Latitud y longitud recibidas', latitude, longitude)
            document.querySelector("a-scene").appendChild(cofre);

            /* ****** Interacción con el Modelo (cofre) ******** */
            //let pista = 'NoCapturado'
            cofre.addEventListener('click', () => {

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
                
            })

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
                latitude: latitude + 0.001,
                longitude: longitude
                
            });
            document.querySelector("a-scene").appendChild(congratulations);
        }
        testEntityAdded = true;
    });

    
};