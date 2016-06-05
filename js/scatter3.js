var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = 1060 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var customTimeFormat = d3.time.format.multi([
    ["%B", function(d) { return d.getMonth(); }],
    ["%Y", function() { return true; }]
]);

var timeFormat =  d3.time.format("%Y-%m-%d %H:%M:%S");

//setup X scale, axis and plotting helper functions

var xScale = d3.time.scale()
    .domain([timeFormat.parse("2014-10-30 00:00:00"), timeFormat.parse("2015-05-25 16:00:00")])
    .range([0, width]);

var xValue = function(d) { return d.time;},
    xMap = function(d) { return xScale(xValue(d))};

var xAxis = d3.svg.axis()
    .scale(xScale)
    .tickFormat(customTimeFormat)
    .orient("bottom");

//setup Y scale, axis and plotting helper functions

var yScale = d3.scale.linear()
    .domain([0,2500])
    .range([height, 0]);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5);

var yValue = function(d) { return d.kpi;},
    yMap = function(d) { return yScale(yValue(d))};

// setup tooltip for kpi

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)");

var thresholdLine = d3.svg.line()
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return yScale(d.threshold); });

var trendline = d3.svg.line()
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return yScale(d.trend); });


d3.csv('past_kpi.csv',  function(err, data) {
  
  //format time,kpi,trend,threshold
  data.forEach(function(d){
    d.time = timeFormat.parse(d.time);
    d.kpi = +d.kpi;
    d.trend = +d.trend;
    d.threshold = +d.threshold;
  });

  //add the dots
  svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class","dot" )
    .attr("r", 2) //circle radius
    .attr("cx", xMap ) //circle x
    .attr("cy", yMap) //circle y
    .attr("fill", "black")
    .on("mouseover", function(d) {
          
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          
          tooltip.html("kpi: " + d.kpi)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

      svg.append("path")
          .datum(data)
          .attr("class", "thresholdLine")
          .attr("d", thresholdLine)
          .attr("fill", "none")
          .attr("stroke", "red")
          .attr("stroke-width","6px");

    svg.append("path")
        .datum(data)
        .attr("class", "trendline")
        .attr("d", trendline)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width","3px");


});






