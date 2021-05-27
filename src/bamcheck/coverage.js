/*
 * Author: David Bryson and Jennifer Liddle <js10@sanger.ac.uk>
 *
 * Create a coverage graph
 *
 * Use:
 *
 * chart = coverage.drawChart({data: data, width: 350, height: 250, title: 'coverage chart'});
 *
 * where width, height, and title are optional and have the default values shown above
 *       data   is an object containing two arrays:
 *             bases      array of X values
 *             coverage   array of Y values
 *
 * Returns : an chart object containing svg to be used thus:
 *
 * jQuery("#graph").append( function() { return chart.svg.node(); } );
 *
 */

/* globals define */

'use strict';

define(['jquery', 'd3'], function(jQuery, d3) {
  var drawChart = function(config) {
    var results;
    var data = config.data;
    var width = config.width || 350;
    var height = config.height || 250;
    var title = config.title || 'Coverage';

    if (data && data.bases && data.bases.length) {

      results = new coverageGraph(data, title, width, height);

    } else {
      results = { svg: null };
    }
    return results;
  };

  function coverageGraph(data, title, w, h) {
    var padding = {
      top: 50,
      right: 25,
      bottom: 50,
      left: 65
    };
    var xLabel = 'Coverage (log)';
    var yLabel = 'Mapped bases (x 10⁶)';

    var points = makePoints(data.bases, data.cov);

    var xMin = 1;
    var xMax = d3.max(points, function(p) { return +p.xVar; });
    var yMin = 0;
    var yMax = d3.max(points, function(p) { return +p.yVar; });

    //Create SVG element
    var bare_svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
    var svg = d3.select(bare_svg).attr("width", w).attr("height", h);

    //Create scale functions
    var xScale = d3.scale.log()
      .nice()
      .domain([xMin, xMax])
      .range([padding.left, w - (padding.right)]);

    var yScale = d3.scale.linear()
      .nice()
      .domain([yMin, yMax])
      .range([h - padding.bottom, padding.top]);

    //Define X axis
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .ticks(8, function(d) {
        return d;
      });

    //Define Y axis
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(10)
      .tickFormat(function(d) {
        return d / 1000000;
      });

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
      .append("rect")
      .attr("x", padding.left)
      .attr("y", padding.top)
      .attr("width", w - (padding.right + padding.left))
      .attr("height", h - (padding.top + padding.bottom));

    //Create X axis
    svg.append("g")
      .attr("class", "axis")
      .attr("id", "xAxis")
      .attr("transform", "translate(0," + (h - padding.bottom) + ")")
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
      .attr("dy", -padding.left / 1.5)
      .attr("transform", "translate(0," + h / 2 + ")rotate(-90)")
      .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
      .style("text-anchor", "middle")
      .text(yLabel);

    //Make x grid
    svg.append("g")
      .attr("class", "grid")
      .attr("id", "xGrid")
      .attr("transform", "translate(0," + (h - padding.bottom) + ")")
      .call(make_x_grid()
        .tickSize(-h + (padding.top + padding.bottom), 0, 0)
        .tickFormat("")
      );

    //Make y grid
    svg.append("g")
      .attr("class", "grid")
      .attr("id", "yGrid")
      .attr("transform", "translate(" + padding.left + ",0)")
      .call(make_y_grid()
        .tickSize(-w + (padding.left + padding.right), 0, 0)
        .tickFormat("")
      );

    //Append title
    svg.append('text')
      .attr('x', padding.left)
      .attr('y', padding.top / 2)
      .attr('font-size', h / 25 + 'px')
      .text(title);

    //Draw the lines
    var line = d3.svg.line()
      .interpolate("linear")
      .x(function(d) { return xScale(d.xVar); })
      .y(function(d) { return yScale(d.yVar); });

    svg.append('svg:path')
      .attr('d', line(points))
      .attr('fill', 'none')
      .attr('stroke', '#1f77b4');

    //Add the data points
    svg.selectAll("circles")
      .data(points)
      .enter().append('circle')
      .attr("class", "circles")
      .attr("cx", function(d) {
        return xScale(d.xVar);
      })
      .attr("cy", function(d) {
        return yScale(d.yVar);
      })
      .attr("r", 2)
      .attr("fill", '#1f77b4');

    return { svg: svg };
  }

  function makePoints(a1, a2) {
    var points = [];
    for (var n = 0; n < a1.length; n++) {
      points.push({ xVar: a1[n], yVar: a2[n] });
    }
    return points;
  }

  return {
    drawChart: drawChart,
  };

});
