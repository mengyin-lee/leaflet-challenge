// Creat initial map object
// This gets inserted into the div with an id of 'mapid' in index.html
var myMap = L.map("mapid", {
  center: [38.00, -120.00],
  zoom: 5
});

// Create the tile layer that will be the background of the map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

// Add the 'lightmap' tile layer to the map
lightmap.addTo(myMap);


// API endpoint - Select All Earthquakes for the Past 7 Days, all week
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//  Change style based on magnitude - color, radius, opacity
d3.json(queryUrl, function(data) {
  function styleInfo(feature) {
    return {
      opacity: 0.5,
      fillOpacity: 0.5,
      color: "black",
      fillColor: changeColor(feature.properties.mag),
      radius: setRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // set different color from magnitude
    function changeColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "red";
    case magnitude > 4:
      return "organge";
    case magnitude > 3:
      return "yellow";
    case magnitude > 2:
      return "yellowgreen";
    case magnitude > 1:
      return "green";
    default:
      return "aqua";
    }
  }
  // set radiuss from magnitude
    function setRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 5;
  }

  // GeoJSON layer
  L.geoJson(data, {
    // Maken cricles
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // circle style
    style: styleInfo,
    // popup for each marker
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(myMap);

  // an object legend
  var legend = L.control({
    position: "bottomright"
  });

  // details for the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    labels = [];
    scales = [0, 1, 2, 3, 4, 5];


    // Looping through
    for (var i = 0; i < scales.length; i++) {
        div.innerHTML += 
        labels.push(
            `<i style="background:${changeColor(scales[i] + 1)}"></i> ${scales[i]}${scales[i + 1] ? "&ndash;" + scales[i + 1] : "+"}`);

    }
    div.innerHTML = labels.join('<br>');
  
  return div;
  };
  // Add legend to the map.
  legend.addTo(myMap);
});