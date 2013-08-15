var chartIndex = 0;
function newMismatch (data, divID, title, width, height) {
    var mismatchData = {
      id_run: data.id_run,
      tag_index: data.tag_index,
      position: data.position,
      quality_bin_values: data.quality_bin_values
    };
    //create forward and reverse data objects
    var forwardData = Object.create(mismatchData);
    var reverseData = Object.create(mismatchData);
    //define individual data points for forward and reverse
    forwardData.n_count = data.forward_n_count;
    forwardData.quality_bins = data.forward_quality_bins;
    forwardData.count = data.forward_count;
    reverseData.n_count = data.reverse_n_count;
    reverseData.quality_bins = data.reverse_quality_bins;
    reverseData.count = data.reverse_count;
    //format the data
    var forwardFormattedData = formatMismatch(forwardData);
    forwardData.formattedData = forwardFormattedData.formattedData;
    var reverseFormattedData = formatMismatch(reverseData);
    reverseData.formattedData = reverseFormattedData.formattedData;
    //change the yMax variable to be the larger of the two graphs
    if(forwardFormattedData.yMax > reverseFormattedData.yMax){
      forwardData.yMax = forwardFormattedData.yMax;
      reverseData.yMax = forwardFormattedData.yMax;
    }else{
      forwardData.yMax = reverseFormattedData.yMax;
      reverseData.yMax = reverseFormattedData.yMax;
    }
    //draw new plots
    mismatchPlot(forwardData, divID, false, title, width, height);
    mismatchPlot(reverseData, divID, true, title, width, height);
}
function formatMismatch (data) {
    var barData = data.quality_bins;
    barData.push(data.n_count);

    var formattedData = [];

    var yMax = 0;

    for (var i = 0; i < barData[0].length; i++) {
        var yVar = 0;
        var pushData = [];
        var total = data.count[i];
        for (var j = 0; j < barData.length; j++){
            pushData.push({
                name: data.quality_bin_values[j],
                y0: (yVar / total) * 100,
                y1: ((barData[j][i] + yVar) / total) * 100
            });
            yVar += barData[j][i];
        }
        pushData[barData.length - 1].name = 'N';
        formattedData.push(pushData);
        if(yMax < (yVar / total) * 100){
            yMax = (yVar / total) * 100;
        }
    }
    var returnVal = {
      formattedData: formattedData,
      yMax: yMax
    };
    return returnVal;
}
function mismatchPlot (data, divID, legend, title, width, height) {
    var w = 450;
    var h = 350;
    if(width && height){
      w = width;
      h = height;
    }
    var padding = {top: 25, right: 25, bottom: 25, left: 50};

    chartIndex++;

    divID = checkDivSelection(divID);

    var svg = d3.select(divID).append("svg")
        .attr("width", w)
        .attr("height", h);

    if(title){
        padding.top = 50;
        svg.append('text')
            .attr("transform", "translate(" + padding.left + ", " + padding.top / 2 + ")")
            .style('font-size', padding.top / 4)
            .text('Mismatch percent by cycle, ' + data.id_run + "_" + data.position + "#" + data.tag_index);
    }

    var xMin = 0;
    var xMax = data.quality_bins[0].length;
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
             .domain([yMin, data.yMax]);

    var color = d3.scale.ordinal()
        .range(["rgb(8, 18, 247)", "rgb(49, 246, 19)", "rgb(236, 242, 28)", "rgb(219, 68, 0)"])
        .domain(data.quality_bin_values.concat('N'));

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
       .data(data.formattedData)
       .enter().append("g").attr("transform", function (d, i) { return "translate(" + xScale(i) + ",0)"; });

    barGroup.selectAll('rect')
        .data(function (d) { return d; })
        .enter().append('rect')
        .attr('width', nodeWidth)
        .attr('y', function (d) { return yScale(d.y1); })
        .attr('height', function (d) { return yScale(d.y0) - yScale(d.y1); })
        .attr('stroke-width', 1)
        .attr('stroke', 'white')
        .style("fill", function(d) { return color(d.name); });

    if(legend){
      var legendSVG = d3.select(divID)
        .append('svg')
        .attr('width', w / 4)
        .attr('height', h);

      var legendPoints = legendSVG.selectAll('.legend')
        .data(color.domain().reverse())
        .enter()
        .append('g')
        .attr('class', 'legend');

      legendPoints.append('rect')
        .attr('y', function (d, i) { return i * 15 + (h / 2) - 30; })
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', color);

      legendPoints.append('text')
        .attr('x', 25)
        .attr('y', function (d, i) { return i * 15 + (h / 2) - 30; })
        .attr('dy', '10px')
        .style('text-anchor', 'end')
        .text(function (d) {
          return d;
        });
    }

}