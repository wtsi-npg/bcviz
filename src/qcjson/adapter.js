/*
 * Author: David Bryson and Jennifer Liddle <js10@sanger.ac.uk>
 *
 * Created: Halloween 2014
 *
 * Display an 'adapter' histogram
 *
 * Use:
 *
 * var chart = adapter.drawChart({'data': aJSON, 'width': w, 'height': h, 'title': t});
 *
 * Where :     data             is a json formatted string which contains:
 *                forward_start_counts
 *                reverse_start_counts
 *
 *             width, height    are options, and specify width, height in pixels
 *
 *             title            is an option title for the graphs
 *
 * Returns : an chart object containing a SVGs svg_fwdm svg_rev for the forward
 * and reverse graphs, which can be used thus:
 *
 * jQuery("#graph_fwd").append( function() { return chart.svg_fwd.node(); } );
 * jQuery("#graph_rev").append( function() { return chart.svg_rev.node(); } );
 *
 */
/* globals document: false, define: false */
define(['jquery', 'd3'], function(jQuery, d3) {
  'use strict';
  var drawChart = function(config) {
    var svg_fwd;
    var svg_rev;
    var data = config.data;
    var width = config.width;
    var height = config.height;
    var title = config.title || '';

    if (data && typeof data === "object") {
      var mismatchData = {};

      // Force to numeric
      data.forward_fasta_read_count = +data.forward_fasta_read_count;
      data.reverse_fasta_read_count = +data.reverse_fasta_read_count;

      // Create forward and reverse data objects
      var forwardData = Object.create(mismatchData);
      var reverseData = Object.create(mismatchData);

      // Define individual data points for forward and reverse
      forwardData.start_counts = data.forward_start_counts;
      reverseData.start_counts = data.reverse_start_counts;

      // Format the data
      forwardData.formattedData = format_adapter_chart(forwardData);
      reverseData.formattedData = format_adapter_chart(reverseData);

      forwardData.yMax = roundToPowerOfTen(d3.max(forwardData.formattedData, function(d) {
        return d.yVar;
      }));
      if (isNaN(forwardData.yMax)) {
        forwardData.yMax = 0;
      }
      reverseData.yMax = roundToPowerOfTen(d3.max(reverseData.formattedData, function(d) {
        return d.yVar;
      }));
      if (isNaN(reverseData.yMax)) {
        reverseData.yMax = 0;
      }

      // Set xMin and xMax to be the same for the two graphs
      var xMin = d3.min(forwardData.formattedData.concat(reverseData.formattedData), function(d) {
        return d.xVar;
      });
      var xMax = d3.max(forwardData.formattedData.concat(reverseData.formattedData), function(d) {
        return d.xVar;
      });
      var yMin = 0.1;
      var yMax = d3.max(forwardData.formattedData.concat(reverseData.formattedData), function(d) {
        return d.yVar;
      });
      yMax = roundToPowerOfTen(yMax);

      // Draw new plots
      svg_fwd = adapterChart(forwardData, xMin, xMax, yMin, yMax, width, height, 'Forward ' + title);
      svg_rev = adapterChart(reverseData, xMin, xMax, yMin, yMax, width, height, 'Reverse ' + title);
      if (!data.forward_fasta_read_count) {
        svg_fwd = null;
      }
      if (!data.reverse_fasta_read_count) {
        svg_rev = null;
      }

    }
    return {
      'svg_fwd': svg_fwd,
      'svg_rev': svg_rev
    };
  };

  function format_adapter_chart(data) {
    var formattedData = [];
    for (var k in data.start_counts) {
      formattedData.push({
        xVar: parseInt(k, 10),
        yVar: data.start_counts[k]
      });
    }
    return formattedData;
  }

  function roundToPowerOfTen(aNumb) {
    return Math.pow(10, Math.ceil(Math.log(aNumb) / Math.LN10));
  }

  function adapterChart(data, xMin, xMax, yMin, yMax, width, height, title) {
    var w = width || 500;
    var h = height || 250;
    var padding = {
      top: 36,
      right: 25,
      bottom: 25,
      left: 50
    };

    var bare_svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
    var svg = d3.select(bare_svg).attr("width", w).attr("height", h);

    if (title) {
      svg.append('text')
        .attr("transform", "translate(" + padding.left + ", " + padding.top / 4 + ")")
        .style('font-size', padding.top / 4)
        .text(title);
    }

    var nodeWidth = (w - padding.left - padding.right) / xMax;

    // Create scale functions
    var xScale = d3.scale.linear()
      .nice()
      .range([padding.left, w - (padding.right)])
      .domain([xMin, xMax]);

    var yScale = d3.scale.log()
      .clamp(true)
      .nice()
      .range([h - padding.bottom, padding.top]);

    // Define X axis
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .ticks(10);

    // Define Y axis
    var superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹";
    var vArray = [];
    var n;
    for (n = 0; n < Math.log(yMax) / Math.LN10; n++) {
      vArray.push(Math.pow(10, n));
    }
    vArray.push(Math.pow(10, n));

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .tickValues(vArray)
      .ticks(5, function(d) {
        if (d >= 1) {
          return "10" + superscript[Math.round(Math.log(d) / Math.LN10)];
        }
      });

    // Create X axis
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (h - padding.bottom) + ")")
      .call(xAxis);

    // Add X axis origin label
    svg.append("text")
      .attr("transform", "translate(" + (padding.left - 5) + "," + (h - padding.bottom + 17) + ")")
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

    yScale.domain([yMin, yMax]);

    // Create Y axis
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding.left + ", 0)")
      .call(yAxis);

    // Make x grid
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + (h - padding.bottom) + ")")
      .call(make_x_grid()
        .tickSize(-h + (padding.top + padding.bottom), 0, 0)
        .tickFormat("")
      );

    // Make y grid
    svg.append("g")
      .attr("class", "grid")
      .attr("id", "yGrid")
      .attr("transform", "translate(" + padding.left + ",0)")
      .call(make_y_grid()
        .tickSize(-w + (padding.left + padding.right), 0, 0)
        .tickFormat("")
      );

    // Group for the bars
    var bars = svg.append('g');

    // Draw bars in group
    bars.selectAll('rect')
      .data(data.formattedData)
      .enter()
      .append('rect')
      .attr('x', function(d) {
        return xScale(d.xVar);
      })
      .attr('y', function(d) {
        return yScale(d.yVar);
      })
      .attr('width', nodeWidth)
      .attr('height', function(d) {
        return h - padding.bottom - yScale(d.yVar);
      })
      .attr('fill', 'blue')
      .attr('opacity', 0.6)
      .attr('stroke-width', '1px')
      .attr('stroke', 'white');

    return svg;
  }

  return {
    drawChart: drawChart,
    _formatChart: format_adapter_chart,
    _roundToPowerOfTen: roundToPowerOfTen,
  };
});
