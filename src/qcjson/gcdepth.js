/*
 * Author: David Bryson and Jennifer Liddle <js10@sanger.ac.uk>
 *
 * Create a GC Depth chart
 *
 * Use:
 *
 * <div class='bcviz_gcdepth' data-check='data' data-width=500 data-height=200 data-title='GC Depth'></div>
 *
 * where width, height, and title are optional and have the default values shown above
 *       data             is a json formatted string which containing a set of arrays:
 *             gcpercent    GC%
 *             pc_us        unique sequence percentiles
 *             pc_10        10th depth percentile
 *             pc_25        25th depth percentile
 *             pc_50        50th depth percentile
 *             pc_75        75th depth percentile
 *             pc_90        90th depth percentile
 *
 *
 * Returns : an chart object containing svg to be used thus:
 *
 * jQuery("#graph").append( function() { return chart.svg.node(); } );
 *
 */

define(['jquery', 'd3'], function (jQuery, d3) {
  var drawChart = function(config) {
    var results;
    var legend;
    var data = config.data;
    var width = config.width || 350;
    var height = config.height || 250;
    var title = config.title || 'GC Depth';

    if (data && data.gcpercent && data.gcpercent.length) {
      results = new gcDepthGraph(data, title, width, height);
    } else {
      results = { 'svg': null, 'legend': null };
    }
    return results;
  };

  function gcDepthGraph(data, title, w, h) {
    var padding = {
      top: 40,
      right: 25,
      bottom: 50,
      left: 65
    };
    var xLabel = 'Percentile of Mapped Sequence Ordered By GC Content';
    var yLabel = 'Mapped Depth';

    if (title) {
      padding.top = 60;
    }

    //Create SVG element
    var bare_svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
    var svg = d3.select(bare_svg).attr("width", w).attr("height", h);

    //create scale functions
    var xScale = d3.scale.linear()
      .nice()
      .range([padding.left, w - (padding.right)]);

    var yScale = d3.scale.linear()
      .nice()
      .range([h - padding.bottom, padding.top]);

    var gcContentScale = d3.scale.threshold()
      .domain(data.pc_us)
      .range(data.gcpercent);

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

    var color = d3.scale.ordinal()
      .domain([1,2,3])
      .range(["#dedede","#bbdeff","#0084ff"]);


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
//      .attr("id", "chart-area" + chartIndex)
      .append("rect")
      .attr("x", padding.left)
      .attr("y", padding.top)
      .attr("width", w - (padding.right + padding.left))
      .attr("height", h - (padding.top + padding.bottom));

    var points = [];


    points.push(makePoints(data.pc_us, data.pc_10, data.pc_90));
    points.push(makePoints(data.pc_us, data.pc_25, data.pc_75));
    points.push(makePoints(data.pc_us, data.pc_50));
    points.push(makePoints(data.pc_us, data.gcpercent));

    //set keys on colour scale
    var graphKeys = ["10-90th Percentile", "25-75th Percentile", "50th Percentile"];
    color.domain(graphKeys);

    var xMin = d3.min(points, function (p) {
      return d3.min(p, function (v) {
        return v.xVar;
      });
    });
    var xMax = d3.max(points, function (p) {
      return d3.max(p, function (v) {
        return v.xVar;
      });
    });

    var yMin = 0;
    var yMax = d3.max(points, function (p) {
      return d3.max(p, function (v) {
        return v.yVar0;
      });
    });

    xScale.domain([xMin, xMax]);

    //set yScale domain
    yScale.domain([yMin, yMax]);

    //create top axis and labels
    var topAxis = svg.append('g').style("font-size", "10px");

    topAxis.append("rect")
      .attr("x", padding.left)
      .attr("y", padding.top)
      .attr("width", w - padding.left - padding.right + 1)
      .attr("height", 1);

    topAxis.append("rect")
      .attr("x", w - padding.right)
      .attr("y", padding.top - 5)
      .attr("width", 1)
      .attr("height", 5);

    topAxis.append("rect")
      .attr("x", padding.left)
      .attr("y", padding.top - 5)
      .attr("width", 1)
      .attr("height", 5);

    topAxis.append("text")
      .attr("x", w / 2)
      .attr("y", padding.top - 20)
      .attr("text-anchor", "middle")
      .text("GC Content (%)");

    topAxis.append("text")
      .attr("x", xScale(1))
      .attr("y", padding.top - 5)
      .attr("text-anchor", "middle")
      .text(gcContentScale(1));

    topAxis.append("text")
      .attr("x", xScale(25))
      .attr("y", padding.top - 5)
      .attr("text-anchor", "middle")
      .text(gcContentScale(25));

    topAxis.append("text")
      .attr("x", xScale(50))
      .attr("y", padding.top - 5)
      .attr("text-anchor", "middle")
      .text(gcContentScale(50));

    topAxis.append("text")
      .attr("x", xScale(75))
      .attr("y", padding.top - 5)
      .attr("text-anchor", "middle")
      .text(gcContentScale(75));

    topAxis.append("text")
      .attr("x", xScale(100))
      .attr("y", padding.top - 5)
      .attr("text-anchor", "middle")
      .text(gcContentScale(100));

    if (title) {
      //append title
      svg.append('text')
        .attr('x', padding.left)
        .attr('y', padding.top / 4)
        .style('font-size', '12px')
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

    //make x grid
    svg.append("g")
      .attr("class", "grid")
      .attr("id", "xGrid")
      .attr("transform", "translate(0," + (h - padding.bottom) + ")")
      .call(make_x_grid()
        .tickSize(-h + (padding.top + padding.bottom), 0, 0)
        .tickFormat("")
      );

    //make y grid
    svg.append("g")
      .attr("class", "grid")
      .attr("id", "yGrid")
      .attr("transform", "translate(" + padding.left + ",0)")
      .call(make_y_grid()
        .tickSize(-w + (padding.left + padding.right), 0, 0)
        .tickFormat("")
      );

    //seperate the areas
    var layers0 = [points[0]];

    var layers1 = [points[1]];

    var median = [points[2]];

    //draw the areas
    var area = d3.svg.area()
      .x(function (d) {
        return xScale(d.xVar);
      })
      .y0(function (d, i) {
        return yScale(d.yVar0);
      })
      .y1(function (d, i) {
        return yScale(d.yVar);
      });

    //draw the first area
    svg.selectAll(".layers0")
      .data(layers0)
      .enter().append("path")
      .attr("d", function (d) {
        return area(d);
      })
      .style("fill", function (d) {
        return color(graphKeys[0]);
      });

    //draw the second area
    svg.selectAll(".layers1")
      .data(layers1)
      .enter().append("path")
      .attr("d", function (d) {
        return area(d);
      })
      .style("fill", function (d) {
        return color(graphKeys[1]);
      });

    //line generator
    var line = d3.svg.line()
      .interpolate("linear")
      .x(function (d) {
        return xScale(d.xVar);
      })
      .y(function (d) {
        return yScale(d.yVar);
      });

    //create graphs for the median data
    var aValue = svg.selectAll(".median")
      .data(median)
      .enter().append("g")
      .attr("id", "graphs");
//      .attr("clip-path", "url(#chart-area" + chartIndex + ")");

    //draw lines in graphs
    aValue.append("path")
      .attr("class", "line1")
      .attr("d", function (d) {
        return line(d);
      })
      .style("stroke", function (d) {
        return color(graphKeys[2]);
      });

    var legend = null;
    if (svg) {
      legend = gcLegend(h, padding, [layers0, layers1, median], color, graphKeys);
    }
    return { 'svg': svg, 'legend': legend };
  }

  function gcLegend(h, padding, points, color, graphKeys) {
    var bare_svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
    var svg = d3.select(bare_svg).attr("width", h * 0.4).attr("height", h);

    //create the legend
    var legend = svg.selectAll('g')
      .data(points).enter()
      .append('g')
      .attr('class', 'legend');

    //draw colours in legend  
    legend.append('rect')
      .attr('x', 1)
      .attr('y', function (d, i) {
        return padding.top + i * 20;
      })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function (d,i) {
        return color(graphKeys[i]);
      });

    //draw text in legend
    legend.append('text')
      .attr('x', 15)
      .attr('y', function (d, i) {
        return padding.top + i * 20 + 9;
      })
      .style('font-size', '10px')
      .text(function (d,i) {
        return graphKeys[i];
      });

    return svg;
  }

  function makePoints(a1, a2, a3) {
    var points = [];
    for (n = 0; n < a1.length; n++) {
      if (a1[n] > 0.1 && a1[n] < 99.9) {
        points.push({xVar: a1[n], yVar: a2[n], yVar0: a3 ? a3[n] : 0});
      }
    }
    return points;
  }

  return {
    drawChart: drawChart,
  };

});
