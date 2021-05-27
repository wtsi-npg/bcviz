/* globals define */

'use strict';

define(['jquery', 'd3'], function(jQuery, d3) {
  var drawChart = function(config) {
    var results;
    var data = config.data;
    var width = config.width || 350;
    var height = config.height || 250;
    var title = config.title || 'Indels';

    if (data && data.len && data.len.length !== 0) {
        results = indelDistGraph(data, title, width, height);
    } else {
      results = { svg: null, legend: null };
    }
    return results;
  };

  function indelDistGraph(data, title, w, h) {
    var padding = {
      top: 50,
      right: 25,
      bottom: 50,
      left: 65
    };
    var xLabel = 'Indel Length';
    var yLabelLeft = 'Indel Count';

    var graphKeys = ["insertions", "deletions"];

    // Create SVG element
    var bare_svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
    var svg = d3.select(bare_svg).attr("width", w).attr("height", h);

    // Create scale functions
    var xScale = d3.scale.linear()
      .nice()
      .range([padding.left, w - (padding.right)]);

    var yScaleLeft = d3.scale.log()
      .clamp(true)
      .nice()
      .range([h - padding.bottom, padding.top]);

    var color = d3.scale.category10()
      .domain(graphKeys);

    //Define X axis
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .ticks(10);

    //Define Y axis
    var yAxisLeft = d3.svg.axis()
      .scale(yScaleLeft)
      .orient("left")
      .ticks(10, function(d) {
        if (d < 1) {} else { // eslint-disable-line no-empty
          return d;
        }
      });

    function make_x_grid() {
      return d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(10);
    }

    function make_y_grid() {
      return d3.svg.axis()
        .scale(yScaleLeft)
        .orient("left")
        .ticks(10);
    }

    svg.append("clipPath")
      .append("rect")
      .attr("x", padding.left)
      .attr("y", padding.top)
      .attr("width", w - (padding.right + padding.left))
      .attr("height", h - (padding.top + padding.bottom));

    var points = [];
    points.push(makePoints(data.len, data.ins));
    points.push(makePoints(data.len, data.del));

    var xMin = 1;
    var xMax = d3.max(points, function(d) {
      return d3.max(d, function(v) {
        return v.xVar;
      });
    });

    var yMin = 0.1;
    var yMax = d3.max(points, function(d) {
      return d3.max(d, function(v) {
        return v.yVar;
      });
    });

    xScale.domain([xMin, xMax]);

    //Set yScale domain
    yScaleLeft.domain([yMin, yMax]);

    //Append title
    svg.append('text')
      .attr('x', padding.left)
      .attr('y', padding.top / 2)
      .attr('font-size', h / 25 + 'px')
      .text(title);

    var legend = svg.selectAll('g')
      .data(graphKeys).enter()
      .append('g')
      .attr('class', 'legend');

    //Draw colours in legend
    legend.append('rect')
      .attr('x', function(d, i) {
        if (i <= 1) {
          return w - (padding.right * 3 + 15);
        } else {
          return w - (padding.right * 3 * 3 + 15);
        }
      })
      .attr('y', function(d, i) {
        if (i <= 1) {
          return i * 20;
        } else {
          return ((i - 2) * 20);
        }
      })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function(d) {
        return color(d);
      });

    //Draw text in legend
    legend.append('text')
      .attr('x', function(d, i) {
        if (i <= 1) {
          return w - padding.right * 3;
        } else {
          return w - (padding.right * 3) * 3;
        }
      })
      .attr('y', function(d, i) {
        if (i <= 1) {
          return (i * 20) + 9;
        } else {
          return ((i - 2) * 20) + 9;
        }
      })
      .text(function(d) {
        return d;
      });

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
      .call(yAxisLeft)
      .append("text")
      .attr("dy", -padding.left / 1.5)
      .attr("transform", "translate(0," + h / 2 + ")rotate(-90)")
      .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
      .attr("text-anchor", "middle")
      .text(yLabelLeft);

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

    var line = d3.svg.line()
      .interpolate("linear")
      .x(function(d) {
        return xScale(d.xVar);
      })
      .y(function(d) {
        return yScaleLeft(d.yVar);
      });

    //Create graphs for the different data
    var aValue = svg.selectAll(".points")
      .data(points)
      .enter().append("g")
      .attr("id", "graphs");

    //Draw lines in graphs
    aValue.append("path")
      .attr("class", "line1")
      .attr("d", function(d) {
        return line(d);
      })
      .style("stroke", function(d, i, j) {
        return color(graphKeys[j]);
      });

    //Draw lines in graphs
    aValue.selectAll("circle")
      .data(function(d) {
        return d;
      }).enter()
      .append("circle")
      .attr("class", "circles")
      .attr("cx", function(d) {
        return xScale(d.xVar);
      })
      .attr("cy", function(d) {
        return yScaleLeft(d.yVar);
      })
      .attr("r", 2)
      .attr("fill", function(d, i, j) {
        return color(graphKeys[j]);
      });

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
