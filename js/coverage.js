function coverage (data, divID, title) {
    if(data && data[7] && data[7][1] && data[7][1].values && data[7][1].values.length !== 0){
      return new coverageGraph(data[7], divID, title);
    }else{
      window.console.log('data does not exist; chart not created.');
      return null;
    }
}

function coverageGraph (data, divID, title) {
    var w = 350;
    var h = 250;
    var padding = {top: 50, right: 25, bottom: 50, left: 65};
    var xLabel = data[0].xLabel + " (log)";
    var yLabel = data[0].yLabel + " (x1000)";

    var graphKeys = ["Coverage"];

    //Create SVG element
    var svg = d3.select('body').append('svg')
        .attr("width", w)
        .attr("height", h);

    //create scale functions
    var xScale = d3.scale.log()
             .nice()
             .range([padding.left, w - (padding.right)]);

    var yScale = d3.scale.linear()
             .nice()
             .range([h - padding.bottom, padding.top]);

    var color = d3.scale.category10()
            .domain(graphKeys);

    //Define X axis
    var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom")
          .ticks(10, function (d) {
              return d;
          });

    //define Y axis
    var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left")
          .ticks(10)
          .tickFormat(function (d) {
            return d / 1000;
          });

    function make_x_grid() {
        return d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(10);
    }

    function make_y_grid() {
        return d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(10);
    }

    svg.append("clipPath")
       .attr("id", "chart-area")
       .append("rect")
       .attr("x", padding.left)
       .attr("y", padding.top)
       .attr("width", w - (padding.right + padding.left))
       .attr("height", h - (padding.top + padding.bottom));

    //background colour
    svg.append("rect")
       .attr("x", 0)
       .attr("y", 0)
       .attr("width", w)
       .attr("height", h)
       .attr("fill", "#F2F2F2");

    var points = [];

    for(var i in data){
        if ($.inArray(data[i].name, graphKeys) !== -1){
            points.push(data[i]);
        }

    }

    var xMin = 1;
    var xMax = d3.max(points, function (d) { return d3.max(d.values, function (v) { return v.xVar; });});

    var yMin = 0;
    var yMax = d3.max(points, function (d) { return d3.max(d.values, function (v) { return v.yVar; });});

    xScale.domain([xMin, xMax]);

    //set yScale domain
    yScale.domain([yMin,yMax]);

    //Create X axis
    svg.append("g")
       .attr("class", "axis")
       .attr("id", "xAxis")
       .attr("transform", "translate(0," + (h-padding.bottom) + ")")
       .call(xAxis)
      .append("text")
       .attr("dy", ".71em")
       .attr("text-anchor", "middle")
       .attr("transform", "translate(" + (w / 2) + "," + padding.bottom / 2 + ")")
       .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
       .text(xLabel);

    //Create Y axis
    svg.append("g")
       .attr("class", "axis")
       .attr("id", "yAxis")
       .attr("transform", "translate(" + padding.left + ", 0)")
       .call(yAxis)
      .append("text")
       .attr("dy", -padding.left/1.5)
       .attr("transform", "translate(0," + h/2 + ")rotate(-90)")
       .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
       .style("text-anchor", "middle")
       .text(yLabel);

    //make x grid
    svg.append("g")
       .attr("class", "grid")
       .attr("id", "xGrid")
       .attr("transform", "translate(0," + (h - padding.bottom) + ")")
       .call(make_x_grid()
               .tickSize(-h+(padding.top + padding.bottom), 0, 0)
               .tickFormat("")
       );

    //make y grid
    svg.append("g")
       .attr("class", "grid")
       .attr("id", "yGrid")
       .attr("transform", "translate(" + padding.left + ",0)")
       .call(make_y_grid()
            .tickSize(-w+(padding.left + padding.right), 0,0)
            .tickFormat("")
       );

    //append title
    svg.append('text')
        .attr('x', padding.left)
        .attr('y', padding.top / 2)
        .attr('font-size', h/25 + 'px')
        .text(title);

    var line = d3.svg.line()
        .interpolate("linear")
        .x(function (d) {return xScale(d.xVar);})
        .y(function (d) {return yScale(d.yVar);});

    //create graphs for the different data
    var aValue = svg.selectAll(".points")
        .data(points)
        .enter().append("g")
        .attr("id", "graphs")
        .attr("clip-path", "url(#chart-area)");

    //draw lines in graphs
    aValue.append("path")
          .attr("class", "line1")
          .attr("d", function(d) { return line(d.values); })
          .style("stroke", function(d) { return color(d.name); });

    //draw lines in graphs
    aValue.selectAll("circle")
          .data(function (d) { return d.values; }).enter()
          .append("circle")
          .attr("class", "circles")
          .attr("cx", function(d) { return xScale(d.xVar); })
          .attr("cy", function(d) { return yScale(d.yVar); })
          .attr("r", 2 )
          .attr("fill", function(d) { return color(d.name); });

    function cx (d) {
      return xScale(d);
    }
    function cy (d) {
      return yScale(d);
    }

}