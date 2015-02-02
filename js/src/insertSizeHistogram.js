/*
 * Author: David Bryson and Jennifer Liddle <js10@sanger.ac.uk>
 *
 * Created: 29 October 2014
 *
 * Display an 'insert size' histogram and overlay a normal distribution curve
 *
 * Use:
 *
 * <div class='insert_size_histogram' data-check='data' data-width=650 data-height=700></div>
 *
 * where width and height are option and have the default values shown above
 *       data             is a json formatted string which contains:
 *             bins
 *             id_run
 *             position
 *             tag_index
 *             bin_width
 *             min_isize
 *             mean
 *             std
 *             norm_fit_modes
 *
 */

define(['jquery', 'd3'], function(jQuery, d3){
	var xScale;
	var yScale;

	drawChart = function(divID) {
		var data = jQuery(divID).data("check");
		var width = jQuery(divID).data("width");
		var height = jQuery(divID).data("height");
        if(data && typeof data === "object" && data.bins != null && data.bins.length > 1){
            return new histogram(data, divID, width, height);
        }else{
            return null;
        }
    };

    function histogram(data, divID, width, height) {
		if (!width) { width = 650; }
		if (!height) { height = 300; }
        var padding = {top: 25, right: 25, bottom: 25, left: 50};

		var svg = d3.select(divID).append("svg")
            .attr("width", width)
            .attr("height", height);

		padding.top = 50;
		var txt = 'Insert Sizes: run ' + data.id_run + ", position " + data.position;
		if (data.tag_index) {
                txt = txt + ", tag " + data.tag_index;
            }
		svg.append('text')
			.attr("transform", "translate(" + padding.left + ", " + padding.top / 4 + ")")
			.style('font-size', padding.top / 4)
			.text(txt);

		// every value is a string. Force to numeric.
		data.bin_width = +data.bin_width;
		data.min_isize = +data.min_isize;
		data.mean = +data.mean;
		data.std = +data.std;
		data.paired_reads_direction_in = +data.paired_reads_direction_in;
		data.num_well_aligned_reads_opp_dir = +data.num_well_aligned_reads_opp_dir;
		data.num_well_aligned_reads = +data.num_well_aligned_reads;
		data.bins.forEach(function(v,i,a) { a[i]=+v; });

        var xMin = data.min_isize;
        var xMax = (data.bins.length * data.bin_width) + data.min_isize;
        var yMin = 0;
        var yMax = d3.max(data.bins);
        var nodeWidth = (width-padding.left-padding.right) / data.bins.length;

        //create scale functions
         xScale = d3.scale.linear()
                 .nice()
                 .range([padding.left, width - (padding.right)])
                 .domain([xMin,xMax]);

         yScale = d3.scale.linear()
                 .nice()
                 .range([height - padding.bottom, padding.top])
                 .domain([yMin, yMax]);

        //Define X axis
        var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom")
              .ticks(10)
		      .tickFormat(function(d) { if (d==100 && xMin > 50) { return '' } else { return d; } });

        //define Y axis
        var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left")
              .ticks(10);

        //Create Y axis
        svg.append("g")
           .attr("class", "axis")
           .attr("transform", "translate(" + padding.left + ", 0)")
           .call(yAxis);

        //Create X axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (height-padding.bottom) + ")")
            .call(xAxis);

        //add X axis origin label
        svg.append("text")
          .attr("transform", "translate(" + (padding.left - 5) + "," + (height - padding.bottom + 17) + ")")
          .text(data.min_isize);

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
           .attr("transform", "translate(0," + (height - padding.bottom) + ")")
           .call(make_x_grid()
                   .tickSize(-height+(padding.top + padding.bottom), 0, 0)
                   .tickFormat("")
           );
        //make y grid
        svg.append("g")
           .attr("class", "grid")
           .attr("id","yGrid")
           .attr("transform", "translate(" + padding.left + ",0)")
           .call(make_y_grid()
                .tickSize(-width+(padding.left + padding.right), 0,0)
                .tickFormat("")
           );

        //group for the bars
        var bars = svg.append('g');

        //draw bars in group
        bars.selectAll('rect')
                .data(data.bins)
                .enter()
                .append('rect')
                .attr('x', function (d, i) { return xScale((i * data.bin_width) + data.min_isize); })
                .attr('y', function (d) { return yScale(d); })
                .attr('width', nodeWidth)
                .attr('height', function (d) { return height - padding.bottom - yScale(d); })
                .attr('fill', data.paired_reads_direction_in ? "blue" : "orange")
                .attr('opacity', 0.6)
                .attr('stroke-width', '1px')
                .attr('stroke', 'white');



		if (data.norm_fit_modes) { drawStandardDistribution(data,svg); }
	}

	function drawStandardDistribution(data, svg) {
		//
		// overlay a normal distribution curve
		//

		// first, look up the mean and standard deviation
		var mean = data.mean;
		var std = data.std;
		data.norm_fit_modes.forEach(function(d) {
			if (d.length == 3) {
				mean = d[1];
				std = d[2];
			}
		});

		// Calculate the normal distribution curve
		var norm = [];
		data.bins.forEach(function(v,i) {
			// standard deviation is data.std
			// mu is data.mean
			var m = (std * Math.sqrt(2*Math.PI));
			var x = (i * data.bin_width) + data.min_isize;
			var e = Math.exp(-(x-mean)*(x-mean) / (2 * std * std));
			var n = e/m;
			var point = {x:i, y:n};
			norm.push(point);
		});

		// scale the normal distribution to fit the graph
		var max_norm = 0;
		norm.forEach(function(v,i) { 
			if (max_norm < v.y) { 
				max_norm = v.y; 
			} 
		});
		var max_height = Math.max.apply(null,data.bins);
		var scale = max_height / max_norm;

		// overlay it on the bar chart
		var lineFunc = d3.svg.line()
			.x(function(d) { return xScale((d.x * data.bin_width) + data.min_isize); })
			.y(function(d) { return yScale(d.y * scale); })
			.interpolate('basis');

		svg.append('svg:path')
			.attr('d', lineFunc(norm))
			.attr('stroke', 'black')
			.attr('stroke-width', 2)
			.attr('fill', 'none');

    }

	return {
		drawChart: drawChart,
	};

});
