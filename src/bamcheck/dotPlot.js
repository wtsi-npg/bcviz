/* globals define */

'use strict';

define(['jquery', 'd3'], function(jQuery, d3) {
  return function(points, xLabel, yLabel, legend, title, graphKeys, w, h, direction) {
    var padding = {
      top: 50,
      right: 25,
      bottom: 50,
      left: 65
    };

    if (!title) {
      padding.top = 25;
    }

    //Create SVG element
    var bare_svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
    var svg = d3.select(bare_svg).attr("width", w).attr("height", h);

    //Create scale functions
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
      .ticks(5);

    //Define Y axis
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(5);

    var color = d3.scale.category10();

    var line = d3.svg.line()
      .interpolate("linear")
      .x(function(d) {
        return xScale(d.xVar);
      })
      .y(function(d) {
        return yScale(d.yVar);
      });

    function make_x_grid() {
      return d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(5);
    }

    function make_y_grid() {
      return d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);
    }

    svg.append("clipPath")
      .append("rect")
      .attr("x", padding.left)
      .attr("y", padding.top)
      .attr("width", (w - padding.right - padding.left))
      .attr("height", (h - padding.bottom - padding.top));

    svg.append("rect")
      .attr("opacity", 0)
      .attr("x", padding.left)
      .attr("y", padding.top)
      .attr("width", (w - padding.right - padding.left))
      .attr("height", (h - padding.bottom - padding.top));

    //Set keys on colour scale
    color.domain(graphKeys);

    var xMin = d3.min(points, function(p) {
      return d3.min(p, function(v) {
        return v.xVar;
      });
    });
    var xMax = d3.max(points, function(p) {
      return d3.max(p, function(v) {
        return v.xVar;
      });
    });
    var yMin = d3.min(points, function(p) {
      return d3.min(p, function(v) {
        return v.yVar;
      });
    });
    var yMax = d3.max(points, function(p) {
      return d3.max(p, function(v) {
        return v.yVar;
      });
    });

    if (xMin === xMax) {
      xMax++;
      xMin--;
    }

    xScale.domain([xMin, xMax]);

    //Set yScale domain
    yScale.domain([yMin, yMax]);

    //Append title
    if (title) {
      svg.append('text')
        .attr('x', padding.left)
        .attr('y', padding.top / 2)
        .attr('font-size', '10px')
        .text(title);
    }

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
      .attr("text-anchor", "middle")
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

    //Create graphs for the different data
    var aValue = svg.selectAll(".points")
      .data(points)
      .enter().append("g").attr("title", function(d, i) {
        return graphKeys[i];
      })
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

    //Draw data points on graphs
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
        return yScale(d.yVar);
      })
      .attr("r", 2)
      .attr("fill", function(d, i, j) {
        return color(graphKeys[j]);
      });

    var svg_legend = null;
    if (legend) {
      svg_legend = dotPlotLegend(h, padding, graphKeys, color, direction);
    }

    return {
      svg: svg,
      legend: svg_legend,
    };

/**
    //create a new zoom behavior
    var zoomer = d3.behavior.zoom().x(xScale).y(yScale).scaleExtent([1, 50]).on("zoom", zoom);

    rect.call(zoomer);

    function zoom() {
      if (zoomer.scale() === 1) {
        yScale.domain([yMin, yMax]);
        xScale.domain([xMin, xMax]);
        zoomer.translate([0, 0]);
      }
      svg.select("#xAxis").call(xAxis);
      svg.select("#yAxis").call(yAxis);
      svg.select("#xGrid").call(make_x_grid().tickSize(-h + (padding.top + padding.bottom), 0, 0).tickFormat(""));
      svg.select("#yGrid").call(make_y_grid().tickSize(-w + (padding.left + padding.right), 0, 0).tickFormat(""));
      svg.selectAll(".line1").attr("d", function (d) {
        return line(d.values);
      });
      svg.selectAll(".circles").attr("cx", function (d) {
        return cx(d.xVar);
      }).attr("cy", function (d) {
        return cy(d.yVar);
      });
    }

    this.resetDomain = function () {
      //set min and max values for the new scales
      //set min and max values for the new scales
      xMin = xScale.domain()[0];
      xMax = xScale.domain()[1];
      yMin = yScale.domain()[0];
      yMax = yScale.domain()[1];
      //set zoomer to the new scales
      zoomer = d3.behavior.zoom().x(xScale).y(yScale).scaleExtent([1, 10]).on("zoom", zoom);
      svg.call(zoomer);
      zoom();
    };

    this.draw = function () {
      zoom();
    };
*/

  };

  function dotPlotLegend(h, padding, graphKeys, color, direction) {

    if (!direction) {
      direction = "";
    }

    //Create SVG element
    var bare_svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
    var svg = d3.select(bare_svg).attr("width", h * 0.4).attr("height", h);

    //Create the legend
    var legend = svg.selectAll('g')
      .data(graphKeys).enter()
      .append('g')
      .attr('class', 'legend');

    //Draw colours in legend
    legend.append('rect')
      .attr('x', 1)
      .attr('y', function(d, i) {
        return padding.top + i * 20;
      })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function(d) {
        return color(d);
      });

    //Draw text in legend
    legend.append('text')
      .attr('x', 15)
      .attr('y', function(d, i) {
        return padding.top + (i * 20) + 9;
      })
      .text(function(d) {
        return d.substring(0, d.lastIndexOf(direction));
      });

    return svg;
  }

});
