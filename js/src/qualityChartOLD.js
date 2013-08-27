function qualityChartOLD (data, width, height) {
    if(data && data[0] && data[0][1] && data[0][1].values && data[0][1].values.length !== 0){
      if(width && height){
        return new newQualityChartOLD(data[2], data[9].title, width, height);
      }else{
        return new newQualityChartOLD(data[2], data[9].title);
      }
    }else{
      window.console.log('data does not exist; chart not created.');
      return null;
    }
}
function newQualityChartOLD (data, title, width, height) {
    var w = 700;
    var h = 500;
    if(width && height){
      w = width;
      h = height;
    }
    var padding = {top: 50, right: 65, bottom: 50, left: 65};
    var xLabel = data[0].xLabel;
    var yLabel = data[0].yLabel;

    //Create SVG element
    var svg = d3.select('body').append('svg')
        .attr("width", w)
        .attr("height", h);

    var xMin = 0;
    var xMax = data[1].values.length;
    var yMin = 0;
    var yMax = data[1].values[0].yVar.length;

    var nodeWidth = (w-padding.left-padding.right) / xMax;
    var nodeHeight = (h - padding.top-padding.bottom) / yMax;

    //create gradiant
    var rainbow = new Rainbow();
    rainbow.setNumberRange(1, 100);
    rainbow.setSpectrum('lime', 'blue', 'yellow', 'red', 'black');

    //create scale functions
    var xScale = d3.scale.linear()
             .nice()
             .range([padding.left, w - (padding.right)])
             .domain([xMin,xMax - 1]);

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

    //append title
    svg.append('text')
        .attr('x', padding.left)
        .attr('y', padding.top / 2)
        .attr('font-size', h/25 + 'px')
        .text(title);

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
       .style("text-anchor", "end")
       .text(yLabel);

    function getColour(xVar, y){
        return '#' + rainbow.colourAt(data[1].values[xVar].yVar[y] * 100);
    }

    for (var i = 0; i < data[1].values.length - 1; i++) {
        var grid = svg.selectAll('.nothing')
            .data(data[1].values[i].yVar).enter()
            .append('rect')
            .attr('x',  xScale(i))
            .attr('y', function (d, j){return yScale(j);})
            .attr('width', nodeWidth)
            .attr('height', nodeHeight)
            .attr('fill', function (d, j) {return getColour(i, j);})
            .attr('stroke-width', 1)
            .attr('stroke', function (d, j) {return getColour(i, j);})
            .attr("clip-path", "url(#chart-area)");
    }

}