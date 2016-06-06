
    //setup margin object
    var margin = {top: 50, right: 20, bottom: 30, left: 100},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    // setup Multi format (Year/Month) for x axis ticks
    var customTimeFormat = d3.time.format.multi([
    ["%B", function(d) { return d.getMonth(); }],
    ["%Y", function() { return true; }]
    ]);

    //time format for parsing csv dates
    var timeFormat =  d3.time.format("%Y-%m-%d %H:%M:%S");

    //setup X scale, axis and plotting helper functions
    var xScale = d3.time.scale()
    .domain([timeFormat.parse("2014-10-26 00:00:00"), timeFormat.parse("2015-05-25 16:00:00")])
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


    // Draw svg with x and y Axis
    var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Time (Month)");

    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Performance (KPI)");;

    //define lines
    var threshold_line = d3.svg.line()
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return yScale(d.threshold); });

    var trendline = d3.svg.line()
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return yScale(d.trend); });

    var forecast_trendline = d3.svg.line()
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return yScale(d.forecast_trend); });

    var forecast_low = d3.svg.line()
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return yScale(d.forecast_low); });

    var forecast_high = d3.svg.line()
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return yScale(d.forecast_high); });

    //load past_kpi csv data
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
    .on("mouseover", function(d) { // add tooltip on hover
          
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          
          tooltip.html("KPI: " + d.kpi)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(800)
               .style("opacity", 0);
      });

    //KPI label
    svg.append("text")
       .attr("x", 120    )
       .attr("y", 240)
       .attr("dy", ".75em")
       .style("fill", "green")
       .text("KPI");


    // Add threshold line
    svg.append("path")
      .datum(data)
      .attr("class", "threshold_line")
      .attr("d", threshold_line)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width","6px");




    // Add trend line
    svg.append("path")
        .datum(data)
        .attr("class", "trendline")
        .attr("d", trendline)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width","3px");

       svg.append("text")
          .attr("x", width-50 )
          .attr("y", 110)
          .attr("dy", ".75em")
          .style("fill", "red")
          .text("c max");
    });


    //Load forecast data
    d3.csv('forecast_kpi.csv',  function(err, data) {

    data.forEach(function(d){
    d.time = timeFormat.parse(d.time);
    d.forecast_trend = +d.forecast_trend;
    d.forecast_low = +d.forecast_low;
    d.forecast_high = +d.forecast_high;
    d.threshold = +d.threshold;
    });

    // Add threshold line
    svg.append("path")
      .datum(data)
      .attr("class", "threshold_line")
      .attr("d", threshold_line)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width","6px");

    // Threshold label
    svg.append("text")
     .attr("x", width-50 )
     .attr("y", 110)
     .attr("dy", ".75em")
     .style("fill", "red")
     .text("c max");

    // Add line for forecast_trend
    svg.append("path")
        .datum(data)
        .attr("class", "forecast_trendline")
        .attr("d", forecast_trendline)
        .attr("fill", "none")
        .attr("stroke", "black")
        .style("stroke-dasharray", ("3, 3"))
        .attr("stroke-width","3px");

    // Trend label
    svg.append("text")
       .attr("x", width-50 )
       .attr("y", 240)
       .attr("dy", ".75em")
       .text("Trend");

    // Add line for forecast_low
    svg.append("path")
        .datum(data)
        .attr("class", "forecast_low")
        .attr("d", forecast_low)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .style("stroke-dasharray", ("3, 3"))
        .attr("stroke-width","3px");

    // forecast_low label
    svg.append("text")
       .attr("x", width-50 )
       .attr("y", 440)
       .attr("dy", ".75em")
       .style("fill", "blue")
       .text("c low");

    // Add line for forecast_high
    svg.append("path")
        .datum(data)
        .attr("class", "forecast_high")
        .attr("d", forecast_high)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .style("stroke-dasharray", ("3, 3"))
        .attr("stroke-width","3px");

    // forecast_high label
    svg.append("text")
       .attr("x", width-50 )
       .attr("y", 80)
       .attr("dy", ".75em")
       .style("fill", "blue")
       .text("c high");


    });







