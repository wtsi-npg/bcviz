/*
 * Author: David Bryson and Jennifer Liddle <js10@sanger.ac.uk>
 *
 * Created: 3rd November 2014
 *
 * Display a 'Mismatch' chart
 *
 * Use:
 *
 * <div class='bcviz_mismatch' data-direction='forward' data-check='data' data-width=500 data-height=200></div>
 *
 * where width and height are optional and have the default values shown above
 *       direction        is either 'forward' or 'reverse' and defaults to 'forward'
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

define(['jquery','d3'], function(jQuery, d3){
    return function (divID, width, height) {
		if (!width) { width = jQuery(divID).data("width"); }
		if (!width) { width = 450; }
		if (!height) { height = jQuery(divID).data("height"); }
		if (!height) { height = 350; }

		var legend = jQuery(divID).data("legend");
		var data = jQuery(divID).data("check");
		var direction = jQuery(divID).data("direction");
		if (!direction) { direction = 'forward'; }

        if(data && typeof data === "object" && (data.forward_count.length !=0 || data.reverse_count.length != 0)){
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
			if (forwardFormattedData) {
            	forwardData.formattedData = forwardFormattedData.formattedData;
            	forwardData.yMax = forwardFormattedData.yMax;
			}
            var reverseFormattedData = formatMismatch(reverseData);
			if (reverseFormattedData) {
	            reverseData.formattedData = reverseFormattedData.formattedData;
	            reverseData.yMax = reverseFormattedData.yMax;
			}
            //change the yMax variable to be the larger of the two graphs
			if (forwardFormattedData && reverseFormattedData) {
				if (forwardFormattedData.yMax > reverseFormattedData.yMax){
					forwardData.yMax = forwardFormattedData.yMax;
					reverseData.yMax = forwardFormattedData.yMax;
				} else {
					forwardData.yMax = reverseFormattedData.yMax;
					reverseData.yMax = reverseFormattedData.yMax;
				}
			}
            //draw new plots
			if (direction == 'forward') {
				return new mismatchPlot(forwardData, divID, 'Forward', width, height, legend);
			} else {
				return new mismatchPlot(reverseData, divID, 'Reverse', width, height, legend);
			}
            return {forward: forward, reverse: reverse};
        }else{
            return null;
        }
    };

    function formatMismatch (data) {
        var barData = data.quality_bins;
		if (!barData) {
			return null;
		}
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

    function mismatchPlot (data, divID, title, width, height, legend) {
		if (!data.formattedData) { return null; }
        var w = 450;
        var h = 350;
        if(width && height){
          w = width;
          h = height;
        }
        var padding = {top: 50, right: 25, bottom: 50, left: 65};

        var svg = d3.select(divID).append("svg")
            .attr("width", w)
            .attr("height", h);

        if (title) {
            padding.top = 50;
			txt = 'Mismatch percent by cycle: run ' + data.id_run + ", position " + data.position;
			if (data.tag_index) {
				txt = txt + ", tag " + data.tag_index;
			}
            svg.append('text')
                .attr("transform", "translate(" + padding.left + ", " + padding.top / 2 + ")")
                .style('font-size', padding.top / 4)
				.text(txt);
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
           .attr("transform", "translate(" + padding.left + ", 0)")
           .call(yAxis);

        //Create X axis
        svg.append("g")
            .attr("class", "axis")
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

		if (legend) {
          var legendSVG = d3.select(divID)
            .append('svg')
            .attr('width', 50)
            .attr('height', h);

          var legendPoints = legendSVG.selectAll('.legend')
            .data(color.domain())
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
            .style('text-anchor', 'middle')
            .text(function (d,i) {
              if (i==0) { return ">=" + d; }
			  if (i==1) { return "=<" + d; }
			  if (i==2) { return "=<" + d; }
			  return d;
            });
		}

    }
});
