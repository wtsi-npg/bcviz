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
 *             forward_count
 *             forward_n_count
 *             forward_quality_bins
 *             reverse_count
 *             reverse_n_count
 *             reverse_quality_bins
 *             quality_bin_values
 *
 *      width, height     are options width, height in pixels
 *
 *      title             is an optional title for the graphs
 *
 * Returns : an chart object containing svg_fwd, svg_rev, svg_legend for forward graph, reverse graph, and legend.
 * They can be used thus:
 *
 * jQuery("#graph_fwd").append( function() { return chart.svg_fwd.node(); } );
 * jQuery("#graph_rev").append( function() { return chart.svg_rev.node(); } );
 * jQuery("#graph_leg").append( function() { return chart.svg_legend.node(); } );
 *
 */

define(['jquery','d3'], function(jQuery, d3) {

    drawChart = function (config) {
        var svg_fwd;
        var svg_rev;
        var svg_legend;
        var data = config.data;
        var width = config.width || 450;
        var height = config.height || 350;
        var title = config.title || '';
        var colour;

        if (data && typeof data === "object") {
            var mismatchData = {
                quality_bin_values: data.quality_bin_values
            };
            // force to numeric
            data.forward_aligned_read_count = +data.forward_aligned_read_count;
            data.reverse_aligned_read_count = +data.reverse_aligned_read_count;

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

            var xMin = 0;
            var fwd_xMax = forwardData.quality_bins ? forwardData.quality_bins[0].length : 0;
            var rev_xMax = reverseData.quality_bins ? reverseData.quality_bins[0].length : 0;
            var xMax = d3.max([fwd_xMax, rev_xMax]);
            var yMin = 0;
            var yMax = d3.max([forwardFormattedData.yMax, reverseFormattedData.yMax]);
            xMax = xMax || 100;
            yMax = yMax || 50;

            data.quality_bin_values  = data.quality_bin_values || [];
            colour = d3.scale.ordinal()
                .range(["rgb(8, 18, 247)", "rgb(49, 246, 19)", "rgb(236, 242, 28)", "rgb(219, 68, 0)"])
                .domain(data.quality_bin_values.concat('N'));

            //draw new plots
            svg_fwd = mismatchPlot(forwardData, xMin, xMax, yMin, yMax, width, height, 'Forward '+title, colour);
            svg_rev = mismatchPlot(reverseData, xMin, xMax, yMin, yMax, width, height, 'Reverse '+title, colour);

            if (!data.forward_aligned_read_count) { svg_fwd = null; }
            if (!data.reverse_aligned_read_count) { svg_rev = null; }

        }


        if (colour) { 
            // no point having a legend without graphs
            if (svg_fwd == null && svg_rev == null) { svg_legend = null; }
            else                                    { svg_legend = draw_legend(height,colour); }
        }

        return { 'svg_fwd': svg_fwd, 'svg_rev': svg_rev, 'svg_legend': svg_legend };
    };

    function formatMismatch (data) {
        var barData = data.quality_bins;
        var formattedData = [];
        if (!barData) { return { formattedData: formattedData, yMax: 0 }; }

        barData.push(data.n_count);

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
            if (yMax < (yVar / total) * 100) {
                yMax = (yVar / total) * 100;
            }
        }
        var returnVal = {
            formattedData: formattedData,
            yMax: yMax
        };
        return returnVal;
    }

    function mismatchPlot (data, xMin, xMax, yMin, yMax, w, h, title, colour) {
        var padding = {top: 50, right: 25, bottom: 50, left: 65};

        var bare_svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
        var svg = d3.select(bare_svg).attr("width", w).attr("height", h);

        svg.append('text')
            .attr("transform", "translate(" + padding.left + ", " + padding.top / 2 + ")")
            .style('font-size', padding.top / 4)
            .text(title);

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

        if (!data.formattedData) { return svg; }

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
            .style("fill", function(d) { return colour(d.name); });

        return svg;
    }

    function draw_legend(h,colour) {
        var bare_svg = document.createElementNS(d3.ns.prefix.svg, 'svg');

        var legendSVG = d3.select(bare_svg)
            .append('svg')
            .attr('width', 50)
            .attr('height', h);

        var legendPoints = legendSVG.selectAll('.legend')
            .data(colour.domain())
            .enter()
            .append('g')
            .attr('class', 'legend');

        legendPoints.append('rect')
            .attr('y', function (d, i) { return i * 15 + (h / 2) - 30; })
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', colour);

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

        return legendSVG;
    }

    return {
        drawChart: drawChart,
    };
});
