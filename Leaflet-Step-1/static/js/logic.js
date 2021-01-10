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
      opacity: 1,
      fillOpacity: 1,
      color: "#000000",
      fillColor: changeColor(feature.properties.mag),
      radius: setRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // set different color from magnitude
    function changeColor(magnitude) {
    // switch (true) {
    // case magnitude > 5:
    //   return "#ea2c2c";
    // case magnitude > 4:
    //   return "#ea822c";
    // case magnitude > 3:
    //   return "#ee9c00";
    // case magnitude > 2:
    //   return "#eecc00";
    // case magnitude > 1:
    //   return "#d4ee00";
    // default:
    //   return "#98ee00";
    // }
    switch (true) {
      case magnitude > 4:
        return "red";
      case magnitude > 3:
        return "orange";
      case magnitude > 2:
        return "yellow";
      default:
        return "green";
      }
  }
  // set radiuss from magnitude
    function setRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 5;
  }
  // change opacity based on magnitude
// function setOpacity(magnitude) {
  // if (magnitude > 6) {
  //   return .99
  // } else if (magnitude > 5) {
  //   return .80
  // } else if (magnitude > 4) {
  //   return .70
  // } else if (magnitude > 3) {
  //   return .60
  // } else if (magnitude > 2) {
  //   return .50
  // } else if (magnitude > 1) {
  //   return .40
  // } else {
  //   return .30
  // }
//   switch (true) {
//     case magnitude > 5:
//       return 2;
//     case magnitude > 4:
//       return 1.8;
//     case magnitude > 3:
//       return 1.6;
//     case magnitude > 2:
//       return 1.4;
//     case magnitude > 1:
//       return 1.2;
//     default:
//       return 1;
//     }
// }

  // GeoJSON layer
  L.geoJson(data, {
    // Maken cricles
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // cirecle style
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

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    // Looping through
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(myMap);
});