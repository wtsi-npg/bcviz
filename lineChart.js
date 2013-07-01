function lineChart(data, divID, graphKeys) {
	var w = 700;
	var h = 500;
	var padding = {top: 50, right: 25, bottom: 50, left: 65};
	var xLabel = data[0].xLabel;
	var yLabel = data[0].yLabel;

	//Create SVG element
	var svg = d3.select(divID)
		.attr("width", w)
		.attr("height", h);

	//create scale functions
	var xScale = d3.scale.linear()
			 .nice()
			 .range([padding.left, w - (padding.right)]);
	
	var yScale = d3.scale.linear()
  			 .nice()
			 .range([h - padding.bottom, padding.top]);

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

	var color = d3.scale.category10();

	var line = d3.svg.line()
		.interpolate("basis")
		.x(function (d) {return xScale(d.xVar);})
		.y(function (d) {return yScale(d.yVar);});

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
	   .attr("height", h - (padding.top + padding.bottom))
	   .call(d3.behavior.zoom().on("zoom", zoom));


	//background colour
	svg.append("rect")
	   .attr("x", 0)
	   .attr("y", 0)
	   .attr("width", w)
	   .attr("height", h)
	   .attr("fill", "#F2F2F2");

	var points = [];

	for(i in data){
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

	xScale.domain([xMin, xMax]);

	//set yScale domain
	yScale.domain([yMin,yMax]);

	//append title
    //var title = svg.append('text')
    //	.attr('x', padding.left * 2)
    //	.attr('y', padding.top / 2)
    //	.attr('font-size', '15px')
    //	.text(fileName);

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
          .text(function(d){ return d.name });

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

	    svg.call(d3.behavior.zoom().x(xScale).y(yScale).on("zoom", zoom));

	function zoom() {
		svg.select("#xAxis").call(xAxis);
	  	svg.select("#yAxis").call(yAxis);
  		svg.select("#xGrid").call(make_x_grid().tickSize(-h+(padding.top + padding.bottom), 0, 0).tickFormat(""));
	  	svg.select("#yGrid").call(make_y_grid().tickSize(-w+(padding.left + padding.right), 0,0).tickFormat(""));
		svg.selectAll("path.line1").attr("d", function (d) {
			return line(d.values);
		});
	}

}
function splitGraphs (data, divID, graphKeys1, graphKeys2) {
	var w = 1400;
	var h = 500;
	var padding = {top: 50, right: 25, bottom: 50, left: 65};
	var xLabel = data[0].xLabel;
	var yLabel = data[0].yLabel;

	//Create SVG element
	var svg = d3.select(divID)
		.attr("width", w)
		.attr("height", h);

	//create scale functions
	var xScale = d3.scale.linear()
			 .nice()
			 .range([padding.left, w/2 - (padding.right)]);
	
	var yScale = d3.scale.linear()
  			 .nice()
			 .range([h - padding.bottom, padding.top]);

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

	var color = d3.scale.category10();

	var line1 = d3.svg.line()
		.interpolate("basis")
		.x(function (d) {return xScale(d.xVar);})
		.y(function (d) {return yScale(d.yVar);});

	var line2 = d3.svg.line()
		.interpolate("basis")
		.x(function (d) {return w/2 + xScale(d.xVar);})
		.y(function (d) {return yScale(d.yVar);});

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
	   .attr("id", "chart-area1")
	   .append("rect")
	   .attr("x", padding.left)
	   .attr("y", padding.top)
	   .attr("width", (w / 2) - (padding.right + padding.left))
	   .attr("height", h - (padding.top + padding.bottom))
	   .call(d3.behavior.zoom().on("zoom", zoom));

	svg.append("clipPath")
	   .attr("id", "chart-area2")
	   .append("rect")
	   .attr("x", padding.left + w / 2)
	   .attr("y", padding.top)
	   .attr("width", (w / 2) - (padding.right + padding.left))
	   .attr("height", h - (padding.top + padding.bottom))
	   .call(d3.behavior.zoom().on("zoom", zoom));

	//background colour
	svg.append("rect")
	   .attr("x", 0)
	   .attr("y", 0)
	   .attr("width", w)
	   .attr("height", h)
	   .attr("fill", "#F2F2F2");

	var points1 = [];
	var points2 = [];

	for(i in data){
		if ($.inArray(data[i].name, graphKeys1) !== -1){
			points1.push(data[i]);
		}
		if($.inArray(data[i].name, graphKeys2) !== -1){
			points2.push(data[i]);
		}
	}

	var points = points1.concat(points2);

	//set keys on colour scale
	color.domain(graphKeys1.concat(graphKeys2));

	var xMin = d3.min(points, function(p) { return d3.min(p.values, function(v) { return v.xVar; }); });
	var xMax = d3.max(points, function(p) { return d3.max(p.values, function(v) { return v.xVar; }); });

	var yMin = d3.min(points, function(p) { return d3.min(p.values, function(v) { return v.yVar; }); });
	var yMax = d3.max(points, function(p) { return d3.max(p.values, function(v) { return v.yVar; }); });

	xScale.domain([xMin, xMax]);

	//set yScale domain
	yScale.domain([yMin,yMax]);

	//append title
    //var title = svg.append('text')
    //	.attr('x', padding.left * 2)
    //	.attr('y', padding.top / 2)
    //	.attr('font-size', '15px')
    //	.text(fileName);

	//create the legend
	var legend1 = svg.selectAll('g')
        .data(points1).enter()
      	.append('g')
        .attr('class', 'legend');

    //draw colours in legend	
	legend1.append('rect')
  	      .attr('x', function(d, i){ if(i <= 1){
         								return (w/2) - (padding.right * 3 + 15);
      								}else{
      									return (w/2) - ((padding.right * 3) * 3 + 15);
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
    legend1.append('text')
          .attr('x', function(d, i){ if(i <= 1){
          								return (w / 2) - (padding.right * 3);
      								}else{
      									return (w / 2) - ((padding.right * 3) * 3);
      								}})
          .attr('y', function(d, i){ if(i <= 1){
          								return (i * 20) + 9;
      								}else{
      									return ((i - 2) * 20) + 9;
      								}})
          .text(function(d){ return d.name });

    var legend2 = svg.selectAll()
        .data(points2).enter()
      	.append('g')
        .attr('class', 'legend');

   	legend2.append('rect')
  	      .attr('x', function(d, i){ if(i <= 1){
         								return (w) - (padding.right * 3 + 15);
      								}else{
      									return (w) - ((padding.right * 3) * 3 + 15);
      								}})
   	      .attr('y', function(d, i){ if(i <= 1){
          								return i *  20;
      								}else{
      									return ((i - 2) * 20);
      								}})
   	      .attr('width', 10)
   	      .attr('height', 10)
   	      .style('fill', function(d) {return color(d.name);});

    legend2.append('text')
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
          .text(function(d){ return d.name });

	//Create X axis
	svg.append("g")
	   .attr("class", "axis")
	   .attr("id", "xAxis1")
	   .attr("transform", "translate(0," + (h-padding.bottom) + ")")
	   .call(xAxis)
	  .append("text")
	   .attr("dy", ".71em")
	   .attr("text-anchor", "middle")
	   .attr("transform", "translate(" + (w / 4 - padding.left) + "," + padding.bottom / 2 + ")")
	   .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
	   .text(xLabel);

	svg.append("g")
	   .attr("class", "axis")
	   .attr("id", "xAxis2")
	   .attr("transform", "translate(" + (w/2) + "," + (h-padding.bottom) + ")")
	   .call(xAxis)
	  .append("text")
	   .attr("dy", ".71em")
	   .attr("text-anchor", "middle")
	   .attr("transform", "translate(" + ((w / 4) - padding.left) + "," + padding.bottom / 2 + ")")
	   .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
	   .text(xLabel);

	//Create Y axis
	svg.append("g")
	   .attr("class", "axis")
	   .attr("id", "yAxis1")
	   .attr("transform", "translate(" + padding.left + ", 0)")
	   .call(yAxis)
	  .append("text")
	   .attr("dy", -padding.left/1.5)
	   .attr("transform", "translate(0," + h/2 + ")rotate(-90)")
       .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
       .style("text-anchor", "end")
	   .text(yLabel);

	svg.append("g")
	   .attr("class", "axis")
	   .attr("id", "yAxis2")
	   .attr("transform", "translate(" + ((w / 2) + padding.left) + ", 0)")
	   .call(yAxis)
	  .append("text")
	   .attr("dy", -padding.left/1.5)
	   .attr("transform", "translate(0," + h/2 + ")rotate(-90)")
       .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
       .style("text-anchor", "end")
	   .text(yLabel);

	//make x grid
	svg.append("g")         
	   .attr("class", "grid")
	   .attr("id", "xGrid1")
	   .attr("transform", "translate(0," + (h - padding.bottom) + ")")
	   .call(make_x_grid()
	   		.tickSize(-h+(padding.top + padding.bottom), 0, 0)
	   		.tickFormat("")
	   );

	svg.append("g")         
	   .attr("class", "grid")
	   .attr("id", "xGrid2")
	   .attr("transform", "translate(" + (w / 2) + "," + (h - padding.bottom) + ")")
	   .call(make_x_grid()
	   		.tickSize(-h+(padding.top + padding.bottom), 0, 0)
	   		.tickFormat("")
	   );

	//make y grid
	svg.append("g")         
	   .attr("class", "grid")
	   .attr("id", "yGrid1")
	   .attr("transform", "translate(" + padding.left + ",0)")
	   .call(make_y_grid()
			.tickSize(-(w/2)+(padding.left + padding.right), 0,0)
			.tickFormat("")
	   );

	svg.append("g")         
	   .attr("class", "grid")
	   .attr("id", "yGrid2")
	   .attr("transform", "translate(" + (w / 2 + padding.left) + ",0)")
	   .call(make_y_grid()
			.tickSize(-(w/2)+(padding.left + padding.right), 0,0)
			.tickFormat("")
	   );

	//create graphs for the different data
	var aValue1 = svg.selectAll(".points1")
		.data(points1)
		.enter().append("g")
		.attr("id", "graphs")
		.attr("clip-path", "url(#chart-area1)");

	var aValue2 = svg.selectAll(".points2")
		.data(points2)
		.enter().append("g")
		.attr("id", "graphs")
		.attr("clip-path", "url(#chart-area2)");

	//draw lines in graphs
	aValue1.append("path")
      	.attr("class", "line1")
      	.attr("d", function(d) { return line1(d.values); })
      	.style("stroke", function(d) { return color(d.name); });

    aValue2.append("path")
      	.attr("class", "line2")
      	.attr("d", function(d) { return line2(d.values); })
      	.style("stroke", function(d) { return color(d.name); });

	svg.call(d3.behavior.zoom().x(xScale).y(yScale).on("zoom", zoom));

	function zoom() {
		svg.select("#xAxis1").call(xAxis);
	  	svg.select("#yAxis1").call(yAxis);
  		svg.select("#xGrid1").call(make_x_grid().tickSize(-h+(padding.top + padding.bottom), 0, 0).tickFormat(""));
	  	svg.select("#yGrid1").call(make_y_grid().tickSize(-(w/2)+(padding.left + padding.right), 0,0).tickFormat(""));
		svg.selectAll("path.line1").attr("d", function (d) {
			return line1(d.values);
		});
		svg.select("#xAxis2").call(xAxis);
	  	svg.select("#yAxis2").call(yAxis);
  		svg.select("#xGrid2").call(make_x_grid().tickSize(-h+(padding.top + padding.bottom), 0, 0).tickFormat(""));
	  	svg.select("#yGrid2").call(make_y_grid().tickSize(-(w/2)+(padding.left + padding.right), 0,0).tickFormat(""));
		svg.selectAll("path.line2").attr("d", function (d) {
			return line2(d.values);
		});
	}
}