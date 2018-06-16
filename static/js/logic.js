function buildMap() {

  /* ROUTE for "/univ_map" */
  var url = "/univ_map";

const mapboxToken = "pk.eyJ1IjoiZGNoYW51YmRhIiwiYSI6ImNqaWVzc2x4YTBwbXkzbHQ0dGdkaTJ0em8ifQ.qy1T9ObL405HiuzbKRk5lA";

// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=" + mapboxToken, {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18
});

// Initialize all of the LayerGroups being used
var layers = {
  Q1_ACCEPTANCE: new L.LayerGroup(),
  Q2_ACCEPTANCE: new L.LayerGroup(),
  Q3_ACCEPTANCE: new L.LayerGroup(),
  Q4_ACCEPTANCE: new L.LayerGroup()
};

// Create the map with defined layers
var map = L.map("map-id", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [
    layers.Q1_ACCEPTANCE,
    layers.Q2_ACCEPTANCE,
    layers.Q3_ACCEPTANCE,
    layers.Q4_ACCEPTANCE
  ]
});

// Add 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "0-25% Acceptance Rate": layers.Q1_ACCEPTANCE,
  "25-50% Acceptance Rate": layers.Q2_ACCEPTANCE,
  "50-75% Acceptance Rate": layers.Q3_ACCEPTANCE,
  "75-100% Acceptane Rate": layers.Q4_ACCEPTANCE
};

// Create a control for each layer, add overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about the map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);

// Initialize an object containing icons for each layer group
var icons = {
  Q1_ACCEPTANCE: L.ExtraMarkers.icon({
    icon: "ion-star",
    iconColor: "white",
    markerColor: "yellow",
    shape: "star"
  }),
  Q2_ACCEPTANCE: L.ExtraMarkers.icon({
    icon: "ion-star-half",
    iconColor: "white",
    markerColor: "red",
    shape: "penta"
  }),
  Q3_ACCEPTANCE: L.ExtraMarkers.icon({
    icon: "ion-star-outline",
    iconColor: "white",
    markerColor: "blue-dark",
    shape: "circle"
  }),
  Q4_ACCEPTANCE: L.ExtraMarkers.icon({
    icon: "ion-star-outline",
    iconColor: "white",
    markerColor: "green",
    shape: "circle"
  })
};

  // Create an object to keep of the number of markers in each layer
  var acceptanceCount = {
    Q1_ACCEPTANCE: 0,
    Q2_ACCEPTANCE: 0,
    Q3_ACCEPTANCE: 0,
    Q4_ACCEPTANCE: 0
  };

  d3.json(url, function (err, universityData) {
      if (err) throw err;
    
    // Initialize a acceptanceCode, which will be used as a key to access the appropriate layers, icons, and acceptance count for layer group
    var acceptanceCode;
    
    function markerOpacity(acceptance) {
      if ( acceptance >= 0 & acceptance< 25 ) {
        opacity_level = 1;
      }
      else {
        opacity_level = 0.5;
      }
      return opacity_level;
    }

    // Loop through the main university data 
    for (var i = 0; i < universityData.length; i++) {
 
      var data = universityData[i];

      // If acceptance rate is between 0 and 25, set as first quarter of acceptance
      if (data.acceptance_rate >= 0 & data.acceptance_rate <25) {
        acceptanceCode = "Q1_ACCEPTANCE";
      }
      // If acceptance rate is between 0 and 25, set as second quarter of acceptance
      else if (data.acceptance_rate >= 25 & data.acceptance_rate <50) {
        acceptanceCode = "Q2_ACCEPTANCE";
      }
      // If acceptance rate is between 0 and 25, set as third quarter of acceptance
      else if (data.acceptance_rate >= 50 & data.acceptance_rate <75) {
        acceptanceCode = "Q3_ACCEPTANCE";
      }
      // If acceptance rate is between 0 and 25, set as final quarter of acceptance
      else if (data.acceptance_rate >= 75 & data.acceptance_rate <= 100) {
        acceptanceCode = "Q4_ACCEPTANCE";
      }

      // Update the acceptance count
      acceptanceCount[acceptanceCode]++;
      // Create a new marker with the appropriate icon and coordinates
      var newMarker = L.marker([data.lat, data.lon], {
        opacity: markerOpacity(data.acceptance_rate),
        icon: icons[acceptanceCode]
      });

      // Add the new marker to the appropriate layer
      newMarker.addTo(layers[acceptanceCode]);

      // Bind a popup to the marker that will  display on click. This will be rendered as HTML
      newMarker.bindPopup(data.name + "<br> Acceptance Rate: " + data.acceptance_rate + "<br> Student Faculty Ratio: " + data.student_faculty_ratio + ":1" + "<br> In-State Tuition: " + data.in_state_tuition);
    }

    // Call the updateLegend function, which will... update the legend!
    updateLegend(acceptanceCount);
  // });
});

// Update the legend's innerHTML with number of universities in each acceptance rate bucket.
function updateLegend(acceptanceCount) {
  document.querySelector(".legend").innerHTML = [
    "<p class='q1_acceptance'>0-25% Acceptance Rate Count: " + acceptanceCount.Q1_ACCEPTANCE + "</p>",
    "<p class='q2_acceptance'>25-50% Acceptance Rate Count: " + acceptanceCount.Q2_ACCEPTANCE + "</p>",
    "<p class='q3_acceptance'>50-75% Acceptance Rate Count: " + acceptanceCount.Q3_ACCEPTANCE + "</p>",
    "<p class='q4_acceptance'>75-100% Acceptance Rate Count: " + acceptanceCount.Q4_ACCEPTANCE + "</p>"
  ].join("");
}

}

buildMap();