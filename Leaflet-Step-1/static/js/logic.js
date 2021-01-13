// Creat myMap object
// The object gets inserted into the div with an id of 'mapid' in index.html
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


// API endpoint - Select the dataset that has all Earthquakes for the past 7 Days - all week
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//  Set style based on magnitude, depth
d3.json(queryUrl, function(data) {
  function styleInf(feature) {
    return {
      opacity: 0.5,
      fillOpacity: 0.5,
      color: "black",
      fillColor: changeColor(feature.geometry.coordinates[2]),//depth
      radius: setRadius(feature.properties.mag),//magnitude
      stroke: true,
      weight: 0.5
    };
  }

  // change different color from depth
    function changeColor(depth) {
    switch (true) {
    case depth > 5:
      return "red";
    case depth > 4:
      return "orange";
    case depth > 3:
      return "yellow";
    case depth > 2:
      return "yellowgreen";
    case depth > 1:
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
    style: styleInf,
    // Bind popup for each marker
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " 
                    + feature.geometry.coordinates[2]);
    }
  }).addTo(myMap);

  // set legend color based on predefined grades from 1 to 5
  function getColor(d) {
    if (d === '5') {
        return 'red'
    } else if (d === '4') {
        return 'orange'
    } else if (d === '3') {
        return 'yellow'
    } else if (d === '2') {
        return 'yellowgreen'
    } else if (d === '1') {
        return 'green'
    } else {
        return 'aqua'
    }
  };

  // Set up the Legend
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    labels = ['<strong>Depth</strong>'],
    grades = ['0', '1', '2', '3', '4', '5'];
  
    // Looping through
    for (var i = 0; i < grades.length; i++) {
  
        div.innerHTML += 
        labels.push(
          '<i class = "circle" style="background:' + getColor(grades[i]) + '"></i> '+
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1]: '+'));

    }
    div.innerHTML = labels.join('<br>');
  
  return div;
  };
  // Add legend to the map.
  legend.addTo(myMap);
});