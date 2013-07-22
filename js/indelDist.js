var chartIndex = 0;
function indelDist (data, divID, title, width, height) {
    if(data && data[6] && data[6][1] && data[6][1].values && data[6][1].values.length !== 0){
      if(width && height){
        return new indelDistGraph(data[6], divID, title, width, height);
      }else{
        return new indelDistGraph(data[6], divID, title);
      }
    }else{
      window.console.log('data does not exist; chart not created.');
      return null;
    }
}
function indelDistGraph (data, divID, title, width, height) {
    var w = 350;
    var h = 250;
    var padding = {top: 50, right: 25, bottom: 50, left: 65};
    var xLabel = data[0].xLabel;
    var yLabelLeft = data[0].yLabelLeft;
    var yLabelRight = data[0].yLabelRight;

    if(width && height){
      w = width;
      h = height;
    }

    var graphKeys = ["insertions", "deletions"];

    chartIndex++;

    //Create SVG element
    var svg = d3.select('body').append('svg')
        .attr("width", w)
        .attr("height", h);

    //create scale functions
    var xScale = d3.scale.linear()
             .nice()
             .range([padding.left, w - (padding.right)]);

    var yScaleLeft = d3.scale.log()
             .clamp(true)
             .nice()
             .range([h - padding.bottom, padding.top]);

    /*var yScaleRight = d3.scale.log()
             .clamp(true)
             .nice()
             .range([h - padding.bottom, padding.top]);*/

    var color = d3.scale.category10()
            .domain(graphKeys);

    //Define X axis
    var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom")
          .ticks(10);

    //define Y axis
    var yAxisLeft = d3.svg.axis()
          .scale(yScaleLeft)
          .orient("left")
          .ticks(10, function (d) {return d;});

    /*var yAxisRight = d3.svg.axis()
          .scale(yScaleRight)
          .orient("right")
          .ticks(10, function (d) {
            return (d).toFixed(1);
          });*/

    function make_x_grid() {
        return d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(10);
    }

    function make_y_grid() {
        return d3.svg.axis()
                .scale(yScaleLeft)
                .orient("left")
                .ticks(10);
    }

    svg.append("clipPath")
       .attr("id", "chart-area" + chartIndex)
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
    /*
    var ratioData = [{name: "ratio", values: []}];

    for (var i = 0; i < data[1].values.length; i++) {
        ratioData[0].values.push({xVar: data[1].values[i].xVar, yVar: (data[1].values[i].yVar / data[2].values[i].yVar)})
    };

    var rMin = .1;
    var rMax = 10;
    */

    var xMin = 1;
    var xMax = d3.max(points, function (d) { return d3.max(d.values, function (v) { return v.xVar; });});

    var yMin = 0.1;
    var yMax = d3.max(points, function (d) { return d3.max(d.values, function (v) { return v.yVar; });});

    xScale.domain([xMin, xMax]);

    //set yScale domain
    yScaleLeft.domain([yMin,yMax]);

    //yScaleRight.domain([rMin, rMax]);

    //append title
    svg.append('text')
        .attr('x', padding.left)
        .attr('y', padding.top / 2)
        .attr('font-size', h/25 + 'px')
        .text(title);

    var legend = svg.selectAll('g')
        .data(graphKeys).enter()
        .append('g')
        .attr('class', 'legend');

    //draw colours in legend    
    legend.append('rect')
            .attr('x', function(d, i){ if(i <= 1){
                                         return w - (padding.right * 3 + 15);
                                      }else{
                                          return w - (padding.right * 3 * 3 + 15);
                                      }})
             .attr('y', function(d, i){ if(i <= 1){
                                          return i *  20;
                                      }else{
                                          return ((i - 2) * 20);
                                      }})
             .attr('width', 10)
             .attr('height', 10)
             .style('fill', function(d) {return color(d);});

    //draw text in legend
    legend.append('text')
          .attr('x', function(d, i){ if(i <= 1){
                                          return w - padding.right * 3;
                                      }else{
                                          return w - (padding.right * 3) * 3;
                                      }})
          .attr('y', function(d, i){ if(i <= 1){
                                          return (i * 20) + 9;
                                      }else{
                                          return ((i - 2) * 20) + 9;
                                      }})
          .text(function(d){ return d;});

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
       .call(yAxisLeft)
      .append("text")
       .attr("dy", -padding.left/1.5)
       .attr("transform", "translate(0," + h/2 + ")rotate(-90)")
       .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
       .attr("text-anchor", "middle")
       .text(yLabelLeft);

    /*
    //Create Y axis
    svg.append("g")
       .attr("class", "axis")
       .attr("id", "yAxis")
       .attr("transform", "translate(" + (w - padding.right) + ", 0)")
       .call(yAxisRight)
      .append("text")
       .attr("dy", -padding.left/1.5)
       .attr("transform", "translate(" + padding.right * 1.5 + "," + h/2 + ")rotate(-90)")
       .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
       .style("text-anchor", "end")
       .text(yLabelRight);
    */

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

    var line = d3.svg.line()
        .interpolate("linear")
        .x(function (d) {return xScale(d.xVar);})
        .y(function (d) {return yScaleLeft(d.yVar);});

    /*
    var ratioLine = d3.svg.line()
        .interpolate("basis")
        .x(function (d) {return xScale(d.xVar);})
        .y(function (d) {return yScaleRight(d.yVar);});
        */

    //create graphs for the different data
    var aValue = svg.selectAll(".points")
        .data(points)
        .enter().append("g")
        .attr("id", "graphs")
        .attr("clip-path", "url(#chart-area" + chartIndex + ")");

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
          .attr("cy", function(d) { return yScaleLeft(d.yVar); })
          .attr("r", 2 )
          .attr("fill", function(d) { return color(d.name); });

    function cx (d) {
      return xScale(d);
    }
    function cy (d) {
      return yScaleLeft(d);
    }

    /****

    //create graphs for the different data
    var ratio = svg.selectAll("g.ratioData")
        .data(ratioData)
        .enter().append("g")
        .attr("id", "graphs")
        .attr("clip-path", "url(#chart-area)");

    //draw lines in graphs
    ratio.append("path")
          .attr("class", "line2")
          .attr("d", function(d) { return ratioLine(d.values); })
          .style("stroke", function(d) { return color(d.name); });

    */

}