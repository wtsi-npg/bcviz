var keysIC = {
        all: ["insertions_fwd","deletions_fwd","insertions_rev","deletions_rev"],
        fwd: ["insertions_fwd","deletions_fwd"],
        reverse: ["insertions_rev","deletions_rev"]
      };
var keysIS = ["totalPairs", "inwardPairs", "outwardPairs", "otherPairs"];
var keysGC = ["First_Fragments", "Last_Fragments"];
var keysGCC = ["A", "C", "G", "T"];
function icChart (data, divID, title, width, height) {
    if(data && data[0] && data[0][1] && data[0][1].values && data[0][1].values.length !== 0){
      if(width && height){
        return new lineChart(data[0], divID, title, keysIC.all, width, height);
      }else{
        return new lineChart(data[0], divID, title, keysIC.all);
      }
    }else{
      window.console.log('data does not exist; chart not created.');
      return null;
    }
}
function splitICchart (data, divID, title) {
  if(data && data[0] && data[0][1] && data[0][1].values && data[0][1].values.length !== 0){
      var returnValue = [new lineChart(data[0], divID, title, keysIC.fwd), new lineChart(data[0], divID, title, keysIC.reverse)];
      if(returnValue[0].y.domain()[1] < returnValue[1].y.domain()[1]){
        returnValue[0].y.domain(returnValue[1].y.domain());
        returnValue[0].resetDomain();
      }else if(returnValue[0].y.domain()[1] > returnValue[1].y.domain()[1]){
        returnValue[1].y.domain(returnValue[0].y.domain());
        returnValue[1].resetDomain();
      }
      return returnValue;
    }else{
      window.console.log('data does not exist; chart not created.');
      return null;
    }
}
function isChart (data, divID, title) {
    if(data && data[1] && data[1][1] && data[1][1].values && data[1][1].values.length !== 0){
      return new lineChart(data[1], divID, title, keysIS);
    }else{
      window.console.log('data does not exist; chart not created.');
      return null;
    }
}
function gcChart (data, divID, title) {
    if(data && data[4] && data[4][1] && data[4][1].values && data[4][1].values.length !== 0){
      return new lineChart(data[4], divID, title, keysGC);
    }else{
      window.console.log('data does not exist; chart not created.');
      return null;
    }
}
function gccChart (data, divID, title) {
    if(data && data[5] && data[5][1] && data[5][1].values && data[5][1].values.length !== 0){
      return new lineChart(data[5], divID, title, keysGCC);
    }else{
      window.console.log('data does not exist; chart not created.');
      return null;
    }
}
function lineChart(data, divID, title, graphKeys, width, height) {
    var w = 350;
    var h = 250;
    if(width && height){
      w = width;
      h = height;
    }
    var padding = {top: 50, right: 25, bottom: 50, left: 65};
    var xLabel = data[0].xLabel;
    var yLabel = data[0].yLabel;

    //Create SVG element
    var svg = d3.select('body').append('svg')
        .attr("width", w)
        .attr("height", h)
        .call(d3.behavior.zoom().on('zoom', zoomer));

    //create scale functions
    this.x = d3.scale.linear()
             .nice()
             .range([padding.left, w - (padding.right)]);

    var xScale = this.x;

    this.y = d3.scale.linear()
               .nice()
             .range([h - padding.bottom, padding.top]);

    var yScale = this.y;

    //Define X axis
    var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom")
          .ticks(5);

    //define Y axis
    var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left")
          .ticks(5);

    var color = d3.scale.category10();

    var line = d3.svg.line()
        .interpolate("linear")
        .x(function (d) {return xScale(d.xVar);})
        .y(function (d) {return yScale(d.yVar);});

    function make_x_grid() {
        return d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(5);
    }

    function make_y_grid() {
        return d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(5);
    }

    svg.append("clipPath")
       .attr("id", "chart-area")
       .append("rect")
       .attr("x", padding.left)
       .attr("y", padding.top)
       .attr("width", (w - padding.right))
       .attr("height", (h - padding.bottom));

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

    //set keys on colour scale
    color.domain(graphKeys);

    var xMin = d3.min(points, function(p) { return d3.min(p.values, function(v) { return v.xVar; }); });
    var xMax = d3.max(points, function(p) { return d3.max(p.values, function(v) { return v.xVar; }); });

    var yMin = d3.min(points, function(p) { return d3.min(p.values, function(v) { return v.yVar; }); });
    var yMax = d3.max(points, function(p) { return d3.max(p.values, function(v) { return v.yVar; }); });

    if(xMin === xMax){
      xMax++;
      xMin--;
      xAxis.ticks(2);
    }

    if(yMax - yMin === 1){
      yAxis.ticks(1);
    }

    xScale.domain([xMin, xMax]);

    //set yScale domain
    yScale.domain([yMin,yMax]);

    //create the legend
    var legend = svg.selectAll('g')
        .data(points).enter()
        .append('g')
        .attr('class', 'legend');

    //draw colours in legend    
    legend.append('rect')
            .attr('x', function(d, i){ if(i <= 1){
                                         return w - (padding.right * 3 + 15);
                                      }else{
                                          return w - ((padding.right * 3) * 3 + 15);
                                      }})
             .attr('y', function(d, i){ if(i <= 1){
                                          return i *  20;
                                      }else{
                                          return ((i - 2) * 20);
                                      }})
             .attr('width', 10)
             .attr('height', 10)
             .style('fill', function(d) {return color(d.name);});

    //draw text in legend
    legend.append('text')
          .attr('x', function(d, i){ if(i <= 1){
                                          return w - (padding.right * 3);
                                      }else{
                                          return w - ((padding.right * 3) * 3);
                                      }})
          .attr('y', function(d, i){ if(i <= 1){
                                          return (i * 20) + 9;
                                      }else{
                                          return ((i - 2) * 20) + 9;
                                      }})
          .text(function(d){ return d.name; });

    //append title
    svg.append('text')
        .attr('x', padding.left)
        .attr('y', padding.top / 2)
        .attr('font-size', h/25 + 'px')
        .text(title);

    //Create X axis
    svg.append("g")
       .attr("class", "axis")
       .attr("id","xAxis")
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
       .attr("id","yAxis")
       .attr("transform", "translate(" + padding.left + ", 0)")
       .call(yAxis)
      .append("text")
       .attr("dy", -padding.left/1.5)
       .attr("transform", "translate(0," + h/2 + ")rotate(-90)")
       .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
       .attr("text-anchor", "middle")
       .text(yLabel);

    //make x grid
    svg.append("g")
       .attr("class", "grid")
       .attr("id","xGrid")
       .attr("transform", "translate(0," + (h - padding.bottom) + ")")
       .call(make_x_grid()
               .tickSize(-h+(padding.top + padding.bottom), 0, 0)
               .tickFormat("")
       );

    //make y grid
    svg.append("g")
       .attr("class", "grid")
       .attr("id","yGrid")
       .attr("transform", "translate(" + padding.left + ",0)")
       .call(make_y_grid()
            .tickSize(-w+(padding.left + padding.right), 0,0)
            .tickFormat("")
       );

    //create graphs for the different data
    var aValue = svg.selectAll(".points")
        .data(points)
        .enter().append("g").attr("title", function (d) { return d.name; })
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

    //create a new zoom behavior
    var zoomer = d3.behavior.zoom().x(xScale).y(yScale).scaleExtent([1,50]).on("zoom", zoom);

    svg.call(zoomer);

    function zoom() {
        if(zoomer.scale() === 1){
          yScale.domain([yMin, yMax]);
          xScale.domain([xMin, xMax]);
        }
        svg.select("#xAxis").call(xAxis);
        svg.select("#yAxis").call(yAxis);
        svg.select("#xGrid").call(make_x_grid().tickSize(-h+(padding.top + padding.bottom), 0, 0).tickFormat(""));
        svg.select("#yGrid").call(make_y_grid().tickSize(-w+(padding.left + padding.right), 0,0).tickFormat(""));
        svg.selectAll(".line1").attr("d", function (d) {
            return line(d.values);
        });
        svg.selectAll(".circles").attr("cx", function (d) {
            return cx(d.xVar);
        }).attr("cy", function (d) {
          return cy(d.yVar);
        });
    }

    this.resetDomain = function () {
      //set min and max values for the new scales
      yMin = yScale.domain()[0];
      yMax = yScale.domain()[1];
      //set zoomer to the new scales
      zoomer = d3.behavior.zoom().x(xScale).y(yScale).scaleExtent([1,10]).on("zoom", zoom);
      svg.call(zoomer);
      zoom();
    };

    this.draw = zoom();


}