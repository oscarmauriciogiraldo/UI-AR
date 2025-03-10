<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>GeoAR.js demo</title>
    <script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
    <script type='text/javascript' src='https://raw.githack.com/AR-js-org/AR.js/3.4.5/three.js/build/ar-threex-location-only.js'></script>
    <script type='text/javascript' src='https://raw.githack.com/AR-js-org/AR.js/3.4.5/aframe/build/aframe-ar.js'></script>
</head>
  </head>

  <body>
    <a-scene
      vr-mode-ui='enabled: false'
      arjs='sourceType: webcam; videoTexture: true; debugUIEnabled: false'
      renderer='antialias: true; alpha: true'
    >
      <a-assets>
        <a-assets-item
          id="cofre"
          src="assets/cofre_zelda/scene.gltf"
        ></a-assets-item>
      </a-assets>
      <a-entity
        id="tesoro"
        gltf-model="#cofre"
        scale="0.02 0.02 0.02"
        position="0 -2 -3"
        rotation="45 0 0"
        animation-mixer
        look-at="[gps-camera]"
        gps-new-entity-place="latitude: 10.47821; longitude: 73.27333;"
      ></a-entity>
      <a-camera gps-new-camera='gpsMinDistance: 5'> </a-camera>
    </a-scene>

    <script>
      document.querySelector("#tesoro").addEventListener("model-loaded", function (e) {
        let entity = e.target;
        let model = entity.getObject3D("mesh");

        if (model && model.animations && model.animations.length > 0) {
          console.log("Animaciones disponibles:", model.animations.map(a => a.name));

          let mixer = new THREE.AnimationMixer(model);
          let action = mixer.clipAction(model.animations.find(a => a.name === "Take 001"));
          
          if (action) {
            action.setLoop(THREE.LoopRepeat);
            action.play();
            console.log("Animación activada:", action._clip.name);
          } else {
            console.error("No se encontró la animación especificada.");
          }

          // Añadir el mixer a la escena para que actualice la animación en cada frame
          AFRAME.registerComponent("animate-model", {
            tick: function (time, delta) {
              mixer.update(delta / 1000);
            }
          });
          entity.setAttribute("animate-model", "");
        } else {
          console.error("No se encontraron animaciones en el modelo.");
        }
      });
    </script>
  </body>
</html>



<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>GeoAR.js Mejorado</title>
    <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>
    <script src="https://unpkg.com/aframe-look-at-component@1.0.0/dist/aframe-look-at-component.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>
  </head>

  <body>
    <h3>Ingresa las coordenadas GPS:</h3>
    <form id="gps-form">
      <label for="latitud">Latitud:</label>
      <input type="number" id="latitud" step="any" required>
      <label for="longitud">Longitud:</label>
      <input type="number" id="longitud" step="any" required>
      <button type="submit">Actualizar</button>
    </form>
    <p id="mensaje">Esperando ubicación...</p>

    <a-scene
      vr-mode-ui="enabled: false"
      arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false"
      renderer="antialias: true; alpha: true"
    >
      <a-assets>
        <a-assets-item id="cofre" src="assets/cofre_zelda/scene.gltf"></a-assets-item>
      </a-assets>

      <a-entity
        id="tesoro"
        gltf-model="#cofre"
        scale="0.02 0.02 0.02"
        rotation="0 180 0"
        animation-mixer
        look-at="[gps-camera]"
        gps-entity-place="latitude: 0; longitude: 0;"
        visible="false"
      ></a-entity>

      <a-camera gps-camera rotation-reader></a-camera>
    </a-scene>

    <script>
      let userLat, userLon, objLat = 0, objLon = 0;
      const threshold = 0.0001; // Margen de error para detección GPS (~11m)
      const mensaje = document.getElementById("mensaje");
      const objeto3D = document.getElementById("tesoro");

      // Actualizar coordenadas con el formulario
      document.getElementById("gps-form").addEventListener("submit", function (event) {
        event.preventDefault();
        objLat = parseFloat(document.getElementById("latitud").value);
        objLon = parseFloat(document.getElementById("longitud").value);
        objeto3D.setAttribute("gps-entity-place", `latitude: ${objLat}; longitude: ${objLon};`);
        mensaje.textContent = "Ubicación actualizada. Acércate al punto indicado.";
      });

      // Obtener coordenadas del usuario en tiempo real
      function obtenerUbicacion() {
        if (navigator.geolocation) {
          navigator.geolocation.watchPosition((position) => {
            userLat = position.coords.latitude;
            userLon = position.coords.longitude;

            // Calcular distancia al objetivo
            let distancia = calcularDistancia(userLat, userLon, objLat, objLon);
            mensaje.textContent = `Distancia al objeto: ${distancia.toFixed(2)} m`;

            // Mostrar u ocultar objeto según la distancia
            if (distancia <= 10) {
              objeto3D.setAttribute("visible", "true");
              mensaje.textContent = "¡Has llegado al punto exacto!";
            } else {
              objeto3D.setAttribute("visible", "false");
            }
          });
        } else {
          mensaje.textContent = "Geolocalización no soportada en este dispositivo.";
        }
      }

      // Función para calcular la distancia entre dos coordenadas en metros
      function calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371000; // Radio de la Tierra en metros
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      }

      obtenerUbicacion();

      // Ajuste del objeto según la inclinación del dispositivo
      window.addEventListener("deviceorientation", (event) => {
        let beta = event.beta; // Inclinación del dispositivo
        let gamma = event.gamma;
        let altura = Math.max(1, Math.min(3, 1.5 + beta / 90)); // Altura del objeto

        if (objeto3D.getAttribute("visible") === "true") {
          objeto3D.setAttribute("position", `0 ${altura} 0`);
        }
      });
    </script>
  </body>
</html>


<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>GeoAR.js Mejorado</title>
    <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>
    <script src="https://unpkg.com/aframe-look-at-component@1.0.0/dist/aframe-look-at-component.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>
  </head>

  <body>
    <div id="form-container">
      <h2>Ingrese Coordenadas GPS</h2>
      <label>Latitud:</label>
      <input type="number" id="lat" step="any" />
      <label>Longitud:</label>
      <input type="number" id="lng" step="any" />
      <button onclick="startAR()">Iniciar RA</button>
      <p id="message"></p>
    </div>

    <a-scene
      id="scene"
      vr-mode-ui='enabled: false'
      arjs='sourceType: webcam; videoTexture: true; debugUIEnabled: false'
      renderer='antialias: true; alpha: true'
      style="display: none;"
    >
      <a-assets>
        <a-assets-item id="cofre" src="assets/cofre_zelda/scene.gltf"></a-assets-item>
      </a-assets>

      <a-entity
        id="tesoro"
        gltf-model="#cofre"
        scale="0.02 0.02 0.02"
        rotation="45 90 180"
        animation-mixer
        look-at="[gps-camera]"
        gps-entity-place="latitude: 0; longitude: 0;"
      ></a-entity>

      <a-camera gps-camera rotation-reader></a-camera>
    </a-scene>

    <script>
      let userLat, userLng;
      let targetLat, targetLng;
      let threshold = 0.0001; // Margen de error para coordenadas
      
      function startAR() {
        targetLat = parseFloat(document.getElementById('lat').value);
        targetLng = parseFloat(document.getElementById('lng').value);

        if (isNaN(targetLat) || isNaN(targetLng)) {
          document.getElementById('message').textContent = 'Ingrese coordenadas válidas';
          return;
        }

        document.getElementById('form-container').style.display = 'none';
        document.getElementById('scene').style.display = 'block';
        updateTreasureLocation();
      }

      function updateTreasureLocation() {
        navigator.geolocation.watchPosition(position => {
          userLat = position.coords.latitude;
          userLng = position.coords.longitude;
          let distance = getDistance(userLat, userLng, targetLat, targetLng);
          let messageElement = document.getElementById('message');

          if (distance < threshold) {
            document.getElementById('tesoro').setAttribute('gps-entity-place', `latitude: ${targetLat}; longitude: ${targetLng};`);
            document.getElementById('tesoro').setAttribute('visible', 'true');
            messageElement.textContent = 'Tesoro encontrado';
          } else {
            document.getElementById('tesoro').setAttribute('visible', 'false');
            messageElement.textContent = `Acérquese a la ubicación. Distancia: ${distance.toFixed(5)} km`;
          }
        }, console.error, { enableHighAccuracy: true });
      }

      function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radio de la Tierra en km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      }
    </script>
  </body>
</html>

<!-- Ultimo de chat  -->
<!-- TODO : vamos a convinarlo -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>GeoAR.js demo</title>
    <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>
    <script src="https://unpkg.com/aframe-look-at-component@1.0.0/dist/aframe-look-at-component.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>
  </head>

  <body>
    <a-scene
      vr-mode-ui='enabled: false'
      arjs='sourceType: webcam; videoTexture: true; debugUIEnabled: false'
      renderer='antialias: true; alpha: true'
    >
      <a-assets>
        <a-assets-item
          id="cofre"
          src="assets/cofre_zelda/scene.gltf"
        ></a-assets-item>
      </a-assets>
      <a-entity
        id="tesoro"
        gltf-model="#cofre"
        scale="0.02 0.02 0.02"
        position="0 -2 -3"
        rotation="45 0 0"
        animation-mixer
        look-at="[gps-camera]"
        gps-entity-place="latitude: 10.47821; longitude: 73.27333;"
      ></a-entity>
      <a-camera gps-camera rotation-reader> </a-camera>
    </a-scene>

    <script>
      document.querySelector("#tesoro").addEventListener("model-loaded", function (e) {
        let entity = e.target;
        let model = entity.getObject3D("mesh");

        if (model && model.animations && model.animations.length > 0) {
          console.log("Animaciones disponibles:", model.animations.map(a => a.name));

          let mixer = new THREE.AnimationMixer(model);
          let action = mixer.clipAction(model.animations.find(a => a.name === "Take 001"));
          
          if (action) {
            action.setLoop(THREE.LoopRepeat);
            action.play();
            console.log("Animación activada:", action._clip.name);
          } else {
            console.error("No se encontró la animación especificada.");
          }

          // Añadir el mixer a la escena para que actualice la animación en cada frame
          AFRAME.registerComponent("animate-model", {
            tick: function (time, delta) {
              mixer.update(delta / 1000);
            }
          });
          entity.setAttribute("animate-model", "");
        } else {
          console.error("No se encontraron animaciones en el modelo.");
        }
      });
    </script>
  </body>
</html>

<!-- fUNCTIONAL -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>GeoAR.js demo</title>
    <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>
    <script src="https://unpkg.com/aframe-look-at-component@1.0.0/dist/aframe-look-at-component.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>
  </head>

  <body>
    <a-scene
      vr-mode-ui='enabled: false'
      arjs='sourceType: webcam; videoTexture: true; debugUIEnabled: false'
      renderer='antialias: true; alpha: true'
    >
      <a-assets>
        <a-assets-item
          id="cofre"
          src="assets/cofre_zelda/scene.gltf"
        ></a-assets-item>
       </a-assets>
      <a-entity
        id="tesoro"
        gltf-model="#cofre"
        scale="0.02 0.02 0.02"
        position="0 -2 -3"
        rotation="45 0 0"
        animation-mixer
        look-at="[gps-camera]"
      ></a-entity>
      <a-camera gps-camera rotation-reader> </a-camera>
    </a-scene>

    <script>
      document.querySelector("#tesoro").addEventListener("model-loaded", function (e) {
        let entity = e.target;
        let model = entity.getObject3D("mesh");

        if (model && model.animations && model.animations.length > 0) {
          console.log("Animaciones disponibles:", model.animations.map(a => a.name));

          let mixer = new THREE.AnimationMixer(model);
          let action = mixer.clipAction(model.animations.find(a => a.name === "Take 001"));
          
          if (action) {
            action.setLoop(THREE.LoopRepeat);
            action.play();
            console.log("Animación activada:", action._clip.name);
          } else {
            console.error("No se encontró la animación especificada.");
          }

          // Añadir el mixer a la escena para que actualice la animación en cada frame
          AFRAME.registerComponent("animate-model", {
            tick: function (time, delta) {
              mixer.update(delta / 1000);
            }
          });
          entity.setAttribute("animate-model", "");
        } else {
          console.error("No se encontraron animaciones en el modelo.");
        }
      });
    </script>
  </body>
</html>


<!-- ######################################### Nuevas funcionalidades ################## -->
window.onload = () => {
  let testEntityAdded = false;
  let cofresRecolectados = 0;
  
  // Crear el marcador de puntos en la pantalla
  const marcador = document.createElement('div');
  marcador.style.position = 'absolute';
  marcador.style.top = '10px';
  marcador.style.left = '10px';
  marcador.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  marcador.style.color = 'white';
  marcador.style.padding = '10px';
  marcador.style.fontSize = '20px';
  marcador.style.borderRadius = '5px';
  marcador.innerHTML = `Cofres recolectados: ${cofresRecolectados}`;
  document.body.appendChild(marcador);

  const el = document.querySelector("[gps-new-camera]");
  
  el.addEventListener("gps-camera-update-position", e => {
      if(!testEntityAdded) {
          alert(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);
          
          const cofre = document.createElement('a-entity');
          cofre.setAttribute("scale", "0.50 0.50 0.50");
          cofre.setAttribute('position', "0 -2 -8");
          cofre.setAttribute('gltf-model', './assets/cofre_zelda/scene.gltf');
          cofre.setAttribute('rotation', '40 0 0');
          cofre.setAttribute('animation-mixer', '');
          cofre.setAttribute('gps-new-entity-place', `latitude: ${e.detail.position.latitude + 0.001}; longitude: ${e.detail.position.longitude}`);
          
          // Añadir sonido al cofre
          cofre.setAttribute('sound', 'src: #cofre-sonido; autoplay: false');
          
          // Evento de interacción con el cofre
          cofre.addEventListener('click', () => {
              cofre.setAttribute('visible', 'false');
              congratulations.setAttribute('visible', 'true');
              congratulations.components.sound.playSound();
              cofresRecolectados++;
              marcador.innerHTML = `Cofres recolectados: ${cofresRecolectados}`;
          });

          document.querySelector("a-scene").appendChild(cofre);
          
          const congratulations = document.createElement('a-entity');
          congratulations.setAttribute('id', 'objeto-capturado');
          congratulations.setAttribute("scale", "0.90 0.90 0.90");
          congratulations.setAttribute('position', "0 -10 -8");
          congratulations.setAttribute('gltf-model', './assets/popmii/scene.gltf');
          congratulations.setAttribute('animation-mixer', '');
          congratulations.setAttribute('visible', 'false');
          congratulations.setAttribute('gps-new-entity-place', `latitude: ${e.detail.position.latitude + 0.001}; longitude: ${e.detail.position.longitude}`);
          
          // Añadir sonido a la recompensa
          congratulations.setAttribute('sound', 'src: #recompensa-sonido; autoplay: false');
          
          document.querySelector("a-scene").appendChild(congratulations);
      }
      testEntityAdded = true;
  });
};
