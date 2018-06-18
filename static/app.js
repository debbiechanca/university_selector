
// Map
function buildMap() {

  /* ROUTE for "/univ_map" */
  var url = "/univ_map";

  const mapboxToken = "pk.eyJ1IjoiZGNoYW51YmRhIiwiYSI6ImNqaWVzc2x4YTBwbXkzbHQ0dGdkaTJ0em8ifQ.qy1T9ObL405HiuzbKRk5lA";

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=" + mapboxToken, {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 5
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
    zoom: 3,
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

  // Update the legend's innerHTML with the last updated time and station count
  function updateLegend(acceptanceCount) {
    document.querySelector(".legend").innerHTML = [
      "<p class='q1_acceptance'>0-25% Acceptance Rate Count: " + acceptanceCount.Q1_ACCEPTANCE + "</p>",
      "<p class='q2_acceptance'>25-50% Acceptance Rate Count: " + acceptanceCount.Q2_ACCEPTANCE + "</p>",
      "<p class='q3_acceptance'>50-75% Acceptance Rate Count: " + acceptanceCount.Q3_ACCEPTANCE + "</p>",
      "<p class='q4_acceptance'>75-100% Acceptance Rate Count: " + acceptanceCount.Q4_ACCEPTANCE + "</p>"
    ].join("");
  }

};

// DropDown and list
var stateTableData = [];
var majorTableData = [];
var stateSelected = 'AK';

Array.prototype.contains = function(v) {
  for(var i = 0; i < this.length; i++) {
    if(this[i] === v) return true;
  }
  return false;
};

Array.prototype.unique = function() {
  var arr = [];
  for(var i = 0; i < this.length; i++) {
    if(!arr.includes(this[i])) {
      arr.push(this[i]);
    }
  }
  return arr;
}

function stateTable() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/univ_map", true);
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      myObj = JSON.parse(xhttp.responseText);

      stateTableData.push(myObj)
      console.log(stateTableData);
      var states = [];
      for (var i = 0; i<myObj.length; i++) {
        states.push(myObj[i].state_abbr);
      }
      states = states.unique().sort();

      var myDrop = document.getElementById('selDataset');
      for (var i = 0; i < states.length; i++) {
        var myOption = document.createElement("option");
        myOption.value = states[i];//myObj[i][];
        myOption.text = states[i];//myObj[i];
        myDrop.appendChild(myOption);
      }

      // console.log(JSON.parse(xhttp.responseText));
    }
  };
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
}


function majorTable() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/univ_major", true);
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      myObj = JSON.parse(xhttp.responseText);
      majorTableData.push(myObj)
      console.log(majorTableData);
      var majors = [];
      for (var i = 0; i<myObj.length; i++) {
        majors.push(myObj[i].MajorFieldsDesc);
      }
      majors = majors.unique().sort();

      var radioButtons = document.getElementById('myRadios');
      var myForm = document.createElement('form');
      myForm.id = "formID";
      for (var i = 0; i < majors.length; i++) {
        var myDiv = document.createElement('div');
        myDiv.className = "radio";
        var radioOpt = document.createElement('input');
        radioOpt.type = "radio";
        radioOpt.name = "optRadio";
        radioOpt.value = majors[i];
        if (i == 0){
          radioOpt.checked = true;
        }
        // radioOpt.id = "optRadio";

        var label = document.createElement('label')
        // label.htmlFor = "id";
        label.appendChild(radioOpt);
        label.appendChild(document.createTextNode(majors[i]));

        // myDiv.appendChild(radioOpt);
        myDiv.appendChild(label);
        myForm.appendChild(myDiv);
        // checkBoxes.appendChild(label);
        // myOption.value = states[i];//myObj[i][];
        // myOption.text = states[i];//myObj[i];
        // myDrop.appendChild(myOption);
      }
      radioButtons.appendChild(myForm);
      btnSubmit();
      // console.log(JSON.parse(xhttp.responseText));
    }

  };
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();

}



// function OptionField(){
//
//   var major = [];
//   for ( var i = 1; i<stateTableData.lenght; i++){
//     major.push(stateTableData[i].)
//   }
//
// }

function getRadioVal(form, name) {
  var val;
  // get list of radio buttons with specified name
  var radios = form.elements[name];

  // loop through list of radio buttons
  for (var i=0, len=radios.length; i<len; i++) {
    if ( radios[i].checked ) { // radio checked?
      val = radios[i].value; // if so, hold its value in val
      break; // and break out of for loop
    }
  }
  return val; // return value of checked radio or undefined if none checked
}

function optionChanged(myValue) {
  stateSelected = myValue;


}

function btnSubmit(){
  var majorSelected = getRadioVal(document.getElementById("formID"),"optRadio");
  console.log(majorSelected);
  console.log(stateSelected);
  var filteredStateData = [];
  for (var i=0; i<stateTableData[0].length; i++) {
    if (stateTableData[0][i].state_abbr == stateSelected){
      filteredStateData.push(stateTableData[0][i]);
    }
  }
  var filteredMajorData = [];
  for ( var i=0; i<majorTableData[0].length; i++){
    if (majorTableData[0][i].MajorFieldsDesc == majorSelected) {
      filteredMajorData.push(majorTableData[0][i]);
    }
  }

  var filteredData = []
  for (var i=0; i<filteredStateData.length; i++){
    for (var j=0; j<filteredMajorData.length; j++){
      if (filteredStateData[i].UNITID == filteredMajorData[j].UNITID){
        var myTuple = [filteredStateData[i],filteredMajorData[j]];
        filteredData.push(myTuple);
        break;
      }
    }
  }

  filteredData.sort(function(a,b){
    return b[0].acceptance_rate - a[0].acceptance_rate;
  });

  // console.log(filteredData);
  $(sampleList).empty();
  var myList = document.getElementById('sampleList');
  // var labels=[];
  // var UNITID=[];
  // var acceptance_rate=[];
  // var address=[];
  // var ave_amt_grant_aid=[];
  // var ave_amt_stu_loan=[];
  // var city=[];
  // var in_state_tuition=[];
  // var lat=[];
  // var lon=[];
  var name=[];
  // var out_of_state_tuition=[];
  // var state_abbr=[];
  // var student_faculty_ratio=[];
  // var total_fin_aid=[];
  // var univ_index=[];
  // Second Part

  // var AfricanAmericanMen=[];
  var AfricanAmericanTotal=[];
  // var AfricanAmericanWomen=[];
  // var AmericanIndianAlaskaNativeMen=[];
  var AmericanIndianAlaskaNativeTotal=[];
  // var AmericanIndianAlaskaNativeWomen=[];
  // var AsianMen=[];
  var AsianTotal=[];
  // var AsianWomen=[];
  var GrandTotal=[];
  // var HispanicMen=[];
  var HispanicTotal=[];
  // var HispanicWomen=[];
  // var MajorFieldsDesc=[];
  // var MajorFieldsID=[];
  // var NonresidentAlienMen=[];
  // var NonresidentAlienTotal=[];
  // var NonresidentAlienWomen=[];
  // var PacificIslanderMen=[];
  var PacificIslanderTotal=[];
  // var PacificIslanderWomen=[];
  // var RaceUnknownMen=[];
  var RaceUnknownTotal=[];
  // var RaceUnknownWomen=[];
  var TotalMen=[];
  var TotalWomen=[];
  // var TwoOrMoreRacesMen=[];
  var TwoOrMoreRacesTotal=[];
  // var TwoOrMoreRacesWomen=[];
  // var UNITID=[];
  // var WhiteMen=[];
  var WhiteTotal=[];
  // var WhiteWomen=[];
  // var index=[];

  if (filteredData.length<10) {
    var numberOfBars = filteredData.length;
  }else{
    var numberOfBars = 10;
  }

  for (var i=0; i<numberOfBars; i++) {
    var myElem = document.createElement('li');
    myElem.appendChild(document.createTextNode(filteredData[i][0].name));
    myList.appendChild(myElem);
    name.push(filteredData[i][0].name);
    AfricanAmericanTotal.push(filteredData[i][1].AfricanAmericanTotal);
    AmericanIndianAlaskaNativeTotal.push(filteredData[i][1].AmericanIndianAlaskaNativeTotal);
    AsianTotal.push(filteredData[i][1].AsianTotal);
    GrandTotal.push(filteredData[i][1].GrandTotal);
    HispanicTotal.push(filteredData[i][1].HispanicTotal);
    PacificIslanderTotal.push(filteredData[i][1].PacificIslanderTotal);
    RaceUnknownTotal.push(filteredData[i][1].RaceUnknownTotal);
    TwoOrMoreRacesTotal.push(filteredData[i][1].TwoOrMoreRacesTotal);
    TotalMen.push(filteredData[i][1].TotalMen);
    TotalWomen.push(filteredData[i][1].TotalWomen);
    WhiteTotal.push(filteredData[i][1].WhiteTotal);

    // console.log(AfricanAmericanTotal);

    TuitionChart(filteredData, numberOfBars);

  }
  // Here you can use filteredData to plot different charts
  // chart.js
  $('#DemoChart').remove();
  $('iframe.chartjs-hidden-iframe').remove();
  $('#chartContainer').append('<canvas id="DemoChart"><canvas>');
  // document.getElementById('DemoChart').removeChild;
  var ctx = document.getElementById('DemoChart').getContext('2d');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'horizontalBar',

    // The data for our dataset
    data: {
      labels: name,
      datasets: [
        // {
        // label: "My First dataset",
        // backgroundColor: 'rgb(255, 99, 132)',
        // borderColor: 'rgb(255, 99, 132)',
        // datasets: [
        {
          label: 'African American',
          data: AfricanAmericanTotal ,
          backgroundColor: '#AED6F1'
        },
        {
          label: 'American-Indian/AlaskaNative',
          data: AmericanIndianAlaskaNativeTotal,
          backgroundColor: '#FCF3CF'
        }, {
          label: 'Asian',
          data: AsianTotal,
          backgroundColor: '#3498DB'
        },
        {
          label: 'Hispanic',
          data: HispanicTotal ,
          backgroundColor: '#D6E9C6'
        },
        {
          label: 'Pacific Islander',
          data: PacificIslanderTotal,
          backgroundColor: '#FAEBCC'
        }, {
          label: 'Race Unknown',
          data: RaceUnknownTotal,
          backgroundColor: '#EBCCD1'
        }, {
          label: 'Two or More Races',
          data: TwoOrMoreRacesTotal,
          backgroundColor: '#B7950B'
        }, {
          label: 'White',
          data: WhiteTotal,
          backgroundColor: '#C0392B'
        }]

        // }]
      },

      // Configuration options go here
      options: {
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true


          }
        ]
      }
    }
  });

}


//
function TuitionChart(filteredData, numberOfBars) {

  var data;

  var name_array = [];
  var in_tuition_array = [];
  var out_tuition_array = [];
  var grants_array = [];
  var loans_array = [];

  // Loop through the majors data
  for (var i = 0; i < numberOfBars; i++) {

    data = filteredData[i][0];

    data.in_state_tuition = +data.in_state_tuition;
    data.out_of_state_tuition = +data.out_of_state_tuition;
    data.ave_amt_grant_aid = +data.ave_amt_grant_aid;
    data.ave_amt_stu_loan = +data.ave_amt_stu_loan;

    name_array.push(data.name);
    in_tuition_array.push(data.in_state_tuition);
    out_tuition_array.push(data.out_of_state_tuition);
    grants_array.push(data.ave_amt_grant_aid);
    loans_array.push(data.ave_amt_stu_loan);

  }

  var trace1 = {
    x: name_array,
    y: in_tuition_array,
    name: 'Tuition',
    marker: {
      // color: 'rgb(55, 83, 109)',
      color: 'rgb(106,90,205)',
      opacity: 0.7
    },
    type: 'bar',
    text: in_tuition_array,
    textposition: 'auto',
    hoverinfo: 'none'
  };

  var trace2 = {
    // x: [0, 1, 2, 3, 4, 5],
    x: name_array,
    y: grants_array,
    name: 'Grants',
    marker: {color: 'rgb(50,205,50)'},
    type: 'scatter'
  };

  var trace3 = {
    x: name_array,
    y: loans_array,
    name: 'Loans',
    marker: {color: 'rgb(255,165,0)'},
    type: 'scatter'
  };

  var data = [trace1, trace2, trace3];

  var layout = {
    title: 'Tuition and Financial Aid Comparison by Universities',
    xaxis: {
      title: 'US Universities',
      titlefont: {
        family: 'Helvetica',
        size: 18,
        color: '#000000'
      },
      tickfont: {
        family: 'Old Standard TT, serif',
        size: 9,
        color: 'black'
      },
    },
    yaxis: {
      title: 'Average Tuition vs. Grants and Loans (USD)',
      titlefont: {
        family: 'Helvetica',
        size: 18,
        color: '#000000'
      }
    }
  };

  Plotly.newPlot('tuition_chart', data, layout);

}




var color = "steelblue"
var url = "/univ_map";

// Import Data
d3.json(url, function (err, universityData) {
  if (err) throw err;

  //Parse Data/Cast as numbers
  universityData.forEach(function (univData) {
    univData.name = univData.name;
    univData.acceptance_rate = +univData.acceptance_rate;
    univData.student_faculty_ratio = +univData.student_faculty_ratio;
    univData.in_state_tuition = +univData.in_state_tuition;
    univData.out_of_state_tuition = +univData.out_of_state_tuition;
  });

  var margin = {top: 20, right: 30, bottom: 30, left: 30},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  //Create scale functions
  // var x = d3.scaleLinear()
  // .domain(d3.extent(universityData, d => d.acceptance_rate))
  // .range([0, width]);



  values =  [];
  for (var i = 0; i< universityData.length; i++){
    data = universityData[i];
    value = +data.acceptance_rate;
    values.push(value);
  }
  console.log(values);


  var max = d3.max(values);
  var min = d3.min(values);
  var x = d3.scaleLinear()
  .domain([min, max])
  .range([0, width]);

  console.log("This is x(0):",x(0));


  var formatCount = d3.format(",.0f");
  // Generate a histogram using ten uniformly spaced bins
  var data = d3.histogram()
  .thresholds(10)
  (values);
  console.log('This is data:',data);

  var y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.length)])
  .range([height, 0]);

  console.log('y(0):',y(1),data[0]);
  var xAxis = d3.axisBottom(x);
  // .scale(x)
  // .orient("bottom");

  var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var bar = svg.selectAll(".bar")
  .data(data)
  .enter().append("g")
  .attr("class", "bar")
  .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

// console.log('width:',x(data[0].x0), x(data[0].x1),x(0));

  bar.append("rect")
  .attr("x", 1)
  .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
  // (x(data[1].x1) - x(data[1].x0)) -1)
  .attr("height", function(d) { return height - y(d.length); })
  .attr("fill", color);

  bar.append("text")
  .attr("dy", ".75em")
  .attr("y", -12)
  .attr("x", function(d) { return (x(d.x1) - x(d.x0))/2; })
  // (x(data[0].x1) - x(data[0].x0)) / 2)
  .attr("text-anchor", "middle")
  .text(function(d) { return formatCount(d.length); });

  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

  //     //Create tooltip in the chart
  //     chartGroup.call(toolTip);

  //     //Create event listeners to display and hide the tooltip
  //     barsGroup.on("click", function (data) {
  //     toolTip.show(data);
  //     })

  //     labelGroup.on("click", function(data){
  //     toolTip.show(data);
  //     })

  //   //onmouseout event
  //   .on("mouseout", function (data, index) {
  //     toolTip.hide(data);
  //   });
});











buildMap();
stateTable();
majorTable();
