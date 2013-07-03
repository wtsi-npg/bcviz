function indelDist (data, divID) {
    var w = 700;
    var h = 500;
    var padding = {top: 50, right: 65, bottom: 50, left: 65};
    var xLabel = data[0].xLabel;
    var yLabelLeft = data[0].yLabelLeft;
    var yLabelRight = data[0].yLabelRight;

    //Create SVG element
    var svg = d3.select(divID)
        .attr("width", w)
        .attr("height", h);

    //create scale functions
    var xScale = d3.scale.linear()
             .nice()
             .range([padding.left, w - (padding.right)]);
    
    yScaleLeft = d3.scale.log()
             .nice()
             .range([h - padding.bottom, padding.top]);

    var yScaleRight = d3.scale.log()
             .nice()
             .range([h - padding.bottom, padding.top]);

    //Define X axis
    var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom")
          .ticks(10);

    //define Y axis
    var yAxisLeft = d3.svg.axis()
          .scale(yScaleLeft)
          .orient("left")
          .ticks(10, function (d) {
          		return d;
          });

    var yAxisRight = d3.svg.axis()
          .scale(yScaleRight)
          .orient("right")
          .ticks(10, function (d) {
          	return d;
          });

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

    var xMin = 0;
    var xMax = data[2].values.length;

    var yMin = 0.1;
    var yMax = 1000000;

    xScale.domain([xMin, xMax]);

    //set yScale domain
    yScaleLeft.domain([yMin,yMax]);

    //Create X axis
    svg.append("g")
       .attr("class", "axis")
       .attr("id", "xAxis")
       .attr("transform", "translate(0," + (h-padding.bottom) + ")")
       .call(xAxis)
      .append("text")
       .attr("dy", ".71em")
       .attr("text-anchor", "middle")
       .attr("transform", "translate(" + (w / 2 - padding.left) + "," + padding.bottom / 2 + ")")
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
       .style("text-anchor", "end")
       .text(yLabelLeft);

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

}