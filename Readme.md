# Implementacion Realidad Aumentada 

En este proyecto se implementa la RA desde la web, tiene como objetivo implementar 
WebGL y WebXR con geolocalizacion, para el desarrollo final de juego tipo "Busqueda del tesoro", y su aplicacion sera vista al momento de llegar a unas coordenadas o ubicacion.
En este momento se abre la aplicacion pidiendo permisos de ubicacion y uso de camara y se buscara el objeto en la ubicacion este se mostrara en realidad Aumentada con una animacion.

## Introduccion

"AR.js V2 introdujo la realidad aumentada basada en la ubicacion en la web. Esto permite nuevas experiencias en la realidad aumentada"


## Metodologia 

### Librerias:
  
  Librerias urilizadas para el desarrollo de este proyecto y versiones

  - A-Frame => <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
  - AR.js - GeoAR.js :
    - <script type='text/javascript' src='https://raw.githack.com/AR-js-org/AR.js/3.4.5/three.js/build/ar-threex-location-only.js'></script>

    - <script type='text/javascript' src='https://raw.githack.com/AR-js-org/AR.js/3.4.5/aframe/build/aframe-ar.js'></script>

  - Animation Model => <script src="https://cdn.jsdelivr.net/gh/c-frame/aframe-extras@v7.5.0/dist/aframe-extras.loaders.min.js"></script>
   


### Mock URL Params 

  URL:

  - /?lat=4.8029365/&lng=-75.7342656/&usr=OscardzWnzQ4fkQnVPJj2UfEt/&uuid=2ece92d1a7e54dd3b5a2dc2620afd6af

  Paramas: 

  - lat = "Your latitude"
  - lng = "Your longitude"
  - usr = " Your user name or Name"
  - uuid = "Your user id"

  URLs de Pruebas:

  - Ukumary: 
    /?lat=4.801498/&lng=-75.811316/&usr=OfficeGinadzWnzQ4fkQnVPJj2UfEt/&uuid=2ece92d1a7e54dd3b5a2dc2620afd6af

  - Oscar's Home: 
    /?lat=4.8029365/&lng=-75.7342656/&usr=OscardzWnzQ4fkQnVPJj2UfEt/&uuid=2ece92d1a7e54dd3b5a2dc2620afd6af

## Notas y/o Consideraciones.


### Api

 https://itssoluciones.co/cda/controller/categoria.php?op=CatchPoint
 this.usr = {
      user: this.usuario.id,
      uuid: this.gestionSvc.capturando.uuid
    }
 https://itssoluciones.co/tesoro/?lat=4.811822/&lng=-75.692388/&usr=dzWnzQ4fkQnVPJj2UfEt/&uuid=0c1677ac8c774911a077c1cde2b488cd

    