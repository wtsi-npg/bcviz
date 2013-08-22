var chartIndex = 0;
define(['jquery', 'd3', 'src/divSelections'], function(jQuery, d3, checkDivSelection){
    return function (data, divID, legend, title, graphKeys, width, height) {
        var w = 350;
        var h = 250;
        if(width && height){
          w = width;
          h = height;
        }
        var padding = {top: 50, right: 25, bottom: 50, left: 65};
        var xLabel = data[0].xLabel;
        var yLabel = data[0].yLabel;

        if(!title){
          padding.top = 25;
        }

        divID = checkDivSelection(divID);

        chartIndex++;

        //Create SVG element
        var svg = d3.select(divID).append('svg')
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
           .attr("id", "chart-area" + chartIndex)
           .append("rect")
           .attr("x", padding.left)
           .attr("y", padding.top)
           .attr("width", (w - padding.right - padding.left))
           .attr("height", (h - padding.bottom - padding.top));

        var points = [];

        for(var i in data){
            if (jQuery.inArray(data[i].name, graphKeys) !== -1){
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

        //append title
        if(title){
          svg.append('text')
              .attr('x', padding.left)
              .attr('y', padding.top / 2)
              .attr('font-size', '10px')
              .text(title);
        }

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
              .attr("cy", function(d) { return yScale(d.yVar); })
              .attr("r", 2 )
              .attr("fill", function(d) { return color(d.name); });

        function cx (d) {
          return xScale(d);
        }
        function cy (d) {
          return yScale(d);
        }

        if(legend){
          dotPlotLegend(h, padding, points, divID, color);
        }

        //create a new zoom behavior
        var zoomer = d3.behavior.zoom().x(xScale).y(yScale).scaleExtent([1,50]).on("zoom", zoom);

        svg.call(zoomer);

        function zoom() {
            if(zoomer.scale() === 1){
              yScale.domain([yMin, yMax]);
              xScale.domain([xMin, xMax]);
              zoomer.translate([0,0]);
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
          //set min and max values for the new scales
          xMin = xScale.domain()[0];
          xMax = xScale.domain()[1];
          yMin = yScale.domain()[0];
          yMax = yScale.domain()[1];
          //set zoomer to the new scales
          zoomer = d3.behavior.zoom().x(xScale).y(yScale).scaleExtent([1,10]).on("zoom", zoom);
          svg.call(zoomer);
          zoom();
        };

        this.draw = function(){
          zoom();
        };
    };
    function dotPlotLegend (h, padding, points, divID, color) {

        //Create SVG element
        var svg = d3.select(divID).append('svg')
            .attr("width", h * 0.4)
            .attr("height", h);

        //create the legend
        var legend = svg.selectAll('g')
            .data(points).enter()
            .append('g')
            .attr('class', 'legend');

        //draw colours in legend    
        legend.append('rect')
                .attr('x', 1)
                 .attr('y', function(d, i){ return padding.top + i * 20; })
                 .attr('width', 10)
                 .attr('height', 10)
                 .style('fill', function(d) {return color(d.name);});

        //draw text in legend
        legend.append('text')
              .attr('x', 15)
              .attr('y', function(d, i){ return padding.top + (i * 20) + 9;})
              .text(function(d){ return d.name; });
    }
});