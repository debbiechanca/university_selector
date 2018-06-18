function acceptance_chart(filteredData){
  var color = "lightgreen"
  console.log(filteredData);    

  var margin = {top: 20, right: 30, bottom: 30, left: 50},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  var svg = d3.select(".acceptance_chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  values =  [];
  for (var i = 0; i < filteredData.length; i++){
    data = filteredData[i][0];
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

  var univ_names = []; 
  for (var i = 0; i < filteredData.length; i++){
    data = filteredData[i][0];
    univ_name = +data.name;
    univ_names.push(univ_name);
  }

  var y = d3.scaleLinear()
  .domain([0, d3.max(univ_names, d => d.length)])
  .range([height, 0]);

  console.log('y(0):',y(1),data[0]);
  var xAxis = d3.axisBottom(x);
   
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
  
//   // Create the event listeners with transitions
//   bar.on("mouseover", function () {
//     d3.select(this)
//       .transition()
//       .duration(500)
//       .attr("fill", "green");
// })
// bar.on("mouseout", function () {
//   d3.select(this)
//       .transition()
//       .duration(500)
//       .attr("fill", color);
// })


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

  svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px")   
        .text("University Count based on Acceptance Rate");
  
  
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

};
