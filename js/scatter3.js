var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = 1060 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var customTimeFormat = d3.time.format.multi([
    ["%B", function(d) { return d.getMonth(); }],
    ["%Y", function() { return true; }]
]);

var timeFormat =  d3.time.format("%Y-%m-%d %H:%M:%S");

var x = d3.time.scale()
    .domain([timeFormat.parse("2014-10-30 00:00:00"), timeFormat.parse("2015-05-25 16:00:00")])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0,2000])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(customTimeFormat)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5);



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




