var keysIC = {
	all: ["insertions(fwd)","insertions(rev)","deletions(fwd)","deletions(rev)"],
	fwd: ["insertions(fwd)","deletions(fwd)"],
	reverse: ["insertions(rev)","deletions(rev)"]
};
var files = [
	{
		data: "7843_2-1_IC_bc.csv",
		xVar: "Cycle",
		yVar: "Indel"
	},
	{
		data: "7843_2-2_IC_bc.csv",
		xVar: "Cycle",
		yVar: "Indel"
	},
	{
		data: "7843_2-3_IC_bc.csv",
		xVar: "Cycle",
		yVar: "Indel"
	},
	{
		data: "7843_2-4_IC_bc.csv",
		xVar: "Cycle",
		yVar: "Indel"
	}
];
var w = 700;
var h = 500;
var padding = {top: 50, right: 25, bottom: 50, left: 65};
var graphCount = 0;
var split = false;
$(window).keydown(function (e) {
	if(e.which == 188){
		graphCount--
		drawGraph();
	}
	if(e.which == 190){
		graphCount++
		drawGraph();
	}
	if(e.which == 13){
		toggleSplit();
		drawGraph();
	}
})
function toggleSplit () {
	if(split === true){
		split = false;
	}else{
		split = true;
	}
}
function newGraph () {
	lineChart(files[graphCount].data, files[graphCount].xVar, files[graphCount].yVar, '#aSvg', keysIC.all);
}
function drawGraph () {
	$("#aSvg").empty();
	$("#svg2").empty();
	if(graphCount >= files.length){
		graphCount = 0;
	}
	if(graphCount < 0){
		graphCount = files.length - 1;
	}
	if(split === true){
		splitGraphs();
	}else{
		newGraph();
	}
}
function splitGraphs () {
	lineChart(files[graphCount].data, files[graphCount].xVar, files[graphCount].yVar, '#svg2', keysIC.fwd);
	lineChart(files[graphCount].data, files[graphCount].xVar, files[graphCount].yVar, '#aSvg', keysIC.reverse);
}
var masterScale = d3.scale.linear()
			 .nice()
			 .range([padding.left, w - (padding.right)])
			 .domain([0, 1]);
function lineChart(fileName, xLabel, yLabel, divID, graphKeys) {
	//Create SVG element
	var svg = d3.select(divID)
		.attr("width", w)
		.attr("height", h)
		.call(d3.behavior.zoom().on("zoom", zoom));

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
		.x(function (d) {return xScale(d.xVal);})
		.y(function (d) {return yScale(d.numb);});

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
	   .attr("height", h - (padding.top + padding.bottom));

	d3.csv(fileName,function(csv) {

		//background colour
		svg.append("rect")
		   .attr("x", 0)
		   .attr("y", 0)
		   .attr("width", w)
		   .attr("height", h)
		   .attr("fill", "#F2F2F2");

		//set keys on colour scale   
		color.domain(d3.keys(csv[0]).filter(function(key) {if($.inArray(key, graphKeys) !== -1){
																	return true;
																}else{
																	return false;
																}; }));

		var points = formatData(csv[1].dataLabel);

		function formatData(d) {
			switch (d){
				case "IS":
					//parse data to ints
					csv.forEach(function(d) {
	    				d.lineNumber = parseInt(d.lineNumber);
	    				d.totalPairs = parseInt(d.totalPairs);
    					d.inwardPairs = parseInt(d.inwardPairs);
    					d.outwardPairs = parseInt(d.outwardPairs);
    					d.otherPairs = parseInt(d.otherPairs);
	  				});

	  				//set xScale domain
					xScale.domain(d3.extent(csv, function (d) {return d.lineNumber;}));

					//format data
					return color.domain().map(function (name) {
						return{
							name: name,
							values: csv.map(function(d) {
								return {xVal: +d.lineNumber, numb: +d[name]};
							})
						};
					});
				break;
				case "IC":
					//parse data to ints
					csv.forEach(function(d) {
	    				d.cycle = parseInt(d.cycle);
	  				});

					//set xScale domain
					xScale.domain(d3.extent(csv, function (d) {return d.cycle;}));

					//format data
					return color.domain().map(function (name) {
						return{
							name: name,
							values: csv.map(function(d) {
								return {xVal: d.cycle, numb: +d[name]};
							})
						};

					});
				break;
			default:
				alert("not working");
				break;
			}

		}

		var yMin = d3.min(points, function(p) { return d3.min(p.values, function(v) { return v.numb; }); });
		var yMax = d3.max(points, function(p) { return d3.max(p.values, function(v) { return v.numb; }); });

		var absoluteMin = masterScale.domain()[0];
		var absoluteMax = masterScale.domain()[1];

		//set yScale domain
		yScale.domain([yMin, yMax]);

		//append title
	    var title = svg.append('text')
	    	.attr('x', padding.left * 2)
	    	.attr('y', padding.top / 2)
	    	.attr('font-size', '15px')
	    	.text(fileName);

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
		   .attr("transform", "translate(" + (w / 2 - padding.left) + "," + padding.left / 2 + ")")
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
	      	.attr("class", "line")
	      	.attr("d", function(d) { return line(d.values); })
	      	.style("stroke", function(d) { return color(d.name); });

	    svg.call(d3.behavior.zoom().x(xScale).y(yScale).on("zoom", zoom));

	    if(yMin > absoluteMin || yMax < absoluteMax){
			yScale.domain([absoluteMin, absoluteMax]);
			draw();
		}else{
			masterScale.domain([yMin, yMax]);
		}	

	});
	
	function draw() {
		svg.select("#xAxis").call(xAxis);
	  	svg.select("#yAxis").call(yAxis);
  		svg.select("#xGrid").call(make_x_grid().tickSize(-h+(padding.top + padding.bottom), 0, 0).tickFormat(""));
	  	svg.select("#yGrid").call(make_y_grid().tickSize(-w+(padding.left + padding.right), 0,0).tickFormat(""));
		svg.selectAll("path.line").attr("d", function (d) {
			return line(d.values);
		});
	}

	function zoom() {
			draw();
	}
}