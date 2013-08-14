function mismatch (data, divID, title, width, height) {
    var w = 700;
    var h = 500;
    if(width && height){
      w = width;
      h = height;
    }
        var padding = {top: 25, right: 25, bottom: 25, left: 50};

    chartIndex++;

    var barData = data.forward_quality_bins;
    barData.push(data.forward_n_count);

    var formattedData = [];

    var yMax = 0;

    for (var i = 0; i < barData[0].length; i++) {
        var yVar = 0;
        var pushData = [];
        var total = data.forward_count[i];
        for (var j = 0; j < barData.length; j++){
            pushData.push({
                name: data.quality_bin_values[j],
                y0: (yVar / total) * 100,
                y1: ((barData[j][i] + yVar) / total) * 100
            });
            yVar += barData[j][i];
        }
        pushData[3].name = 'N';
        formattedData.push(pushData);
        if(yMax < (yVar / total) * 100){
            yMax = (yVar / total) * 100;
        }
    }

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

    var xMin = 0;
    var xMax = data.forward_quality_bins[0].length;
    var yMin = 0;
    //var yMax = d3.max(formattedData, function (d) { return d[4].total ;});
    var nodeWidth = (w-padding.left-padding.right) / xMax;

    //create scale functions
    var xScale = d3.scale.linear()
             .nice()
             .range([padding.left, w - (padding.right)])
             .domain([xMin,xMax]);

    var yScale = d3.scale.linear()
             .nice()
             .range([h - padding.bottom, padding.top])
             .domain([yMin, yMax]);

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#7b6888", "#a05d56", "#ff8c00"])
        .domain(d3.keys(data.quality_bin_values.concat('N')));

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

    var barGroup = svg.selectAll('.g')
       .data(formattedData)
       .enter().append("g").attr("transform", function (d, i) { return "translate(" + xScale(i) + ",0)"; });

    barGroup.selectAll('rect')
        .data(function (d) { return d; })
        .enter().append('rect')
        .attr('width', nodeWidth)
        .attr('y', function (d) { return yScale(d.y1); })
        .attr('height', function (d) { return yScale(d.y0) - yScale(d.y1); })
        .style("fill", function(d) { return color(d.name); });

}