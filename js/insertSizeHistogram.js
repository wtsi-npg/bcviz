function insertSizeHistogram (data, divID, title, width, height) {
    var w = 700;
    var h = 500;
    if(width && height){
      w = width;
      h = height;
    }
    var padding = {top: 25, right: 50, bottom: 50, left: 50};

    divID = checkDivSelection(divID);
    var svg = d3.select(divID).append("svg")
        .attr("width", w)
        .attr("height", h);

    if(title){
        padding.top = 50;
        svg.append('text')
            .attr('x', padding.left)
            .attr('y', padding.top / 2)
            .attr('font-size', '10px')
            .text(title);
    }

    var xMin = data.min_isize;
    var xMax = (data.bins.length * data.bin_width) + data.min_isize;
    var yMin = 0;
    var yMax = d3.max(data.bins);
    var nodeWidth = (w-padding.left-padding.right) / data.bins.length;

    //create scale functions
    var xScale = d3.scale.linear()
             .nice()
             .range([padding.left, w - (padding.right)])
             .domain([xMin,xMax]);

    var yScale = d3.scale.linear()
             .nice()
             .range([h - padding.bottom, padding.top])
             .domain([yMin, yMax]);

    //Define X axis
    var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom")
          .ticks(10);

    //define Y axis
    var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left")
          .ticks(10);

    //Create Y axis
    svg.append("g")
       .attr("class", "axis")
       .attr("id", "yAxis" + chartIndex)
       .attr("transform", "translate(" + padding.left + ", 0)")
       .call(yAxis);

    //Create X axis
    svg.append("g")
        .attr("class", "axis")
        .attr("id", "xAxis" + chartIndex)
        .attr("transform", "translate(0," + (h-padding.bottom) + ")")
        .call(xAxis);

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

    var bars = svg.append('g');

    bars.selectAll('rect')
            .data(data.bins)
            .enter()
            .append('rect')
            .attr('x', function (d, i) { return xScale((i * data.bin_width) + data.min_isize); })
            .attr('y', function (d) { return yScale(d); })
            .attr('width', nodeWidth)
            .attr('height', function (d) { return h - padding.bottom - yScale(d); })
            .attr('fill', 'blue')
            .attr('opacity', 0.6)
            .attr('stroke-width', '1px')
            .attr('stroke', 'white');

    var q1 = svg.append("line")
        .attr("x1", xScale(data.quartile1))
        .attr("y1", padding.top)
        .attr("x2", xScale(data.quartile1))
        .attr("y2", h - padding.bottom)
        .attr("stroke-width", "2px")
        .style("stroke", "red");

    svg.append('text')
        .attr("transform", "translate(" + xScale(data.quartile1) + "," + (padding.top - 5) + ")rotate(-45)")
        .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
        .attr("text-anchor", "middle")
        .attr("fill", "red")
        .text(data.quartile1);

    var q3 = svg.append("line")
        .attr("x1", xScale(data.quartile3))
        .attr("y1", padding.top)
        .attr("x2", xScale(data.quartile3))
        .attr("y2", h - padding.bottom)
        .attr("stroke-width", "2px")
        .style("stroke", "red");

    svg.append('text')
        .attr("transform", "translate(" + xScale(data.quartile3) + "," + (padding.top - 5) + ")rotate(-45)")
        .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
        .attr("text-anchor", "middle")
        .attr("fill", "red")
        .text(data.quartile3);

    var median = svg.append("line")
        .attr("x1", xScale(data.median))
        .attr("y1", padding.top)
        .attr("x2", xScale(data.median))
        .attr("y2", h - padding.bottom)
        .attr("stroke-width", "2px")
        .style("stroke", "red");

    svg.append('text')
        .attr("transform", "translate(" + xScale(data.median) + "," + (padding.top - 5) + ")rotate(-45)")
        .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
        .attr("text-anchor", "middle")
        .attr("fill", "red")
        .text(data.median);

    var expectedSize = svg.append('rect')
        .attr('x', xScale(data.expected_size[0]))
        .attr('y', padding.top)
        .attr('width', xScale(data.expected_size[1]) - xScale(data.expected_size[0]))
        .attr('height',  h - padding.bottom - padding.top)
        .attr('fill', 'blue')
        .attr('opacity', 0.2);
}