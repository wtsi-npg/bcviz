"use strict"
function qualityChart (data, divID) {
	var w = 700;
	var h = 500;
	var padding = {top: 50, right: 25, bottom: 50, left: 65};
	var xLabel = data[0].xLabel;
	var yLabel = data[0].yLabel;

	//Create SVG element
	var svg = d3.select(divID)
		.attr("width", w)
		.attr("height", h);

	var xMin = 0;
	var xMax = data[1].values.length;

	var nodeWidth = (w-padding.left-padding.right) / xMax;
	var nodeHeight = (h - padding.top-padding.bottom) / 50;

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
			 .domain([0, 50]);

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
	   .call(yAxis)
	  .append("text")
	   .attr("dy", -padding.left/1.5)
	   .attr("transform", "translate(0," + h/2 + ")rotate(-90)")
       .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
       .style("text-anchor", "end")
	   .text(yLabel);

	var fragments = 0;

	for (var i = 0; i < data[1].values[0].yVar.length; i++) {
		fragments = fragments + data[1].values[0].yVar[i];
	};

	var nodes = [1, 2];

	for (var i = 0; i < data[1].values.length - 1; i++) {
		var lineTotal = 0;
		for (var j = 0; j < data[1].values[i].yVar.length; j++) {
			lineTotal = lineTotal + data[1].values[i].yVar[j];
			nodes.push({
				xPos: i,
				yPos: j + 1,
				fill: '#' + rainbow.colourAt((lineTotal / fragments) * 100)
			})
		};
	};

	var grid = svg.selectAll('rect')
		.data(nodes).enter()
		.append('rect')
		.attr('x', function (d){return xScale(d.xPos);})
		.attr('y', function (d){return yScale(d.yPos);})
		.attr('width', nodeWidth)
		.attr('height', nodeHeight)
		.attr('fill', function (d) {return d.fill;})
		.attr('stroke-width', 1)
		.attr('stroke', function (d) {return d.fill;})
		.attr("clip-path", "url(#chart-area)");

}