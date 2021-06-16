// Mapa Leaflet
var mapa = L.map('mapid').setView([9.5, -84.10], 8);


// Definición de capas base
var capas_base = {
	
  // Capa base agregada mediante L.tileLayer
  "OSM": L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
    {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  ),


 // Capa base agregada mediante L.tileLayer
  "OSM": L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
    {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  ),

 // Capa base agregada mediante L.tileLayer y leaflet-providers
  "Stamen.Watercolor": L.tileLayer.provider('Stamen.Watercolor'),	
  
  // capa extra 1
  
  "Esri_NatGeoWorldMap": L.tileLayer.provider('Esri.NatGeoWorldMap'),
  
 // capa extra 2
  "CartoDB.DarkMatter":L.tileLayer.provider('CartoDB.DarkMatter'),
  
// capa extra 3
    "USGS.USImagery":L.tileLayer.provider('USGS.USImagery'),

  
}


// Se agregan todas las capas base al mapa
control_capas = L.control.layers(capas_base).addTo(mapa);

// Se activa una capa base del control
capas_base['CartoDB.DarkMatter'].addTo(mapa);	

// Control de escala
L.control.scale().addTo(mapa);


//////////////////////////////////////////////////////////

// Capa vectorial de Paises en formato GeoJSON
$.getJSON("https://johancordoba78.github.io/datos/AC_corr.geojson", function(geodata) {
  var paises = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#ff6600", 'weight': 1.5, 'fillOpacity': 0.0}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Países</strong>: " + feature.properties.NAME_01+ "<br>" + "<strong>País</strong>: " + feature.properties.NAME_01;
      layer.bindPopup(popupText);
    }			
  }).addTo(mapa);

  control_capas.addOverlay(paises, 'América Central');
});  


// Capa vectorial de Paises en formato GeoJSON
$.getJSON("https://johancordoba78.github.io/datos/AmerCentra.geojson", function(geodata) {
  var paises_1 = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#ff6600", 'weight': 1.5, 'fillOpacity': 0.0}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Departamentos & Provincias</strong>: " + feature.properties.NAME_12 + "<br>" + "<strong>País</strong>: " + feature.properties.NAME_01;
      layer.bindPopup(popupText);
    }			
  }).addTo(mapa);

  control_capas.addOverlay(paises_1, 'División político - administrativa');
});  



///////////////////////////////////

// Ícono personalizado para bovinos
const iconobovino = L.divIcon({
  html: '<i class="fas fa-hat-cowboy-side fa-2x"></i>',
  className: 'estiloIconos'
});

//////////////////////////////////////////////////////

// Capa vectorial de registros agrupados de bovinos
$.getJSON("https://johancordoba78.github.io/datos/bovinos.geojson", function(geodata) {
  // Registros individuales
  var capa_bovina = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#013220", 'weight': 3}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Región</strong>: " + feature.properties.region + "<br>" + 
                      "<strong>Actividad</strong>: " + feature.properties.ActividadP + "<br>" + 
                      "<strong>Población</strong>: " + feature.properties.Poblacion + "<br>" + 
                      "<strong>código</strong>: " + feature.properties.codigo + "<br>" + 
                      "<br>";
      layer.bindPopup(popupText);
    },
    pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng, {icon: iconobovino});
    }
  });


/////////////////////////////////////////

// Capa vectorial capitales en formato GeoJSON
$.getJSON("https://johancordoba78.github.io/datos/Capitales.geojson" , function(geodata) {
  var capitales = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#212F3D ", 'weight': 2.5, 'fillOpacity': 0.0}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Capital</strong>: " + feature.properties.CIUDAD + "<br>";
      layer.bindPopup(popupText);
    }			
  }).addTo(mapa);

  control_capas.addOverlay(capitales, 'Capitales');
 });   

  // Capa de calor (heatmap)
  coordenadas = geodata.features.map(feat => feat.geometry.coordinates.reverse());
  var capa_bovino_calor = L.heatLayer(coordenadas, {radius: 30, blur: 1});


  // Capa de puntos agrupados
  var capa_bovino1_agrupados = L.markerClusterGroup({spiderfyOnMaxZoom: true});
  capa_bovino1_agrupados.addLayer(capa_bovina);

// Se añade la capa al mapa y al control de capas
   capa_bovino_calor.addTo(mapa);
  control_capas.addOverlay(capa_bovino_calor, 'Mapa de calor');  
  capa_bovino1_agrupados.addTo(mapa);
  control_capas.addOverlay(capa_bovino1_agrupados, 'Registros agrupados de bovinos');
  control_capas.addOverlay(capa_bovina, 'Registros individuales de bovinos');
});



//////////////////////////




