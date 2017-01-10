define(['d3'], function (d3) {
    var padding = {
      top: 5,
      right: 10,
      bottom: 50,
      left: 50
    };
    var dir = 1;

  drawChart = function (config) {
    var data = config.data;
    var width = config.width || 350;
    var height = config.height || 250;
    var title = config.title || 'Quality';
    var results = {
      svg: null,
      svg_fwd: null,
      svg_rev: null,
      legend: null,
    };


    if (data && data.cycle && data.cycle.length !== 0) {
      if (data.qual_first && data.qual_first.length != 0) {
        results.svg_fwd = qualityChart(makeQualPoints(data.cycle,data.qual_first), title+' (Fwd)', width, height);
      }
      dir=2;    // *very* hacky :-(
      if (data.qual_last && data.qual_last.length != 0) {
        results.svg_rev = qualityChart(makeQualPoints(data.cycle,data.qual_last), title+' (Rev)', width, height);
      }
      if (results.svg_fwd || results.svg_rev) {
        results.legend = makeLegend(height, padding);
      }
    }
    return results;
  };

  function qualityChart(data, title, w, h) {
    var xLabel = 'Cycle Number';
    var yLabel = 'Quality';

    // Create SVG element
    var bare_svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
    var svg = d3.select(bare_svg).attr("width", w).attr("height", h);

    if (title) {
      padding.top = 50;
      //append title
      svg.append('text')
        .attr('x', padding.left)
        .attr('y', padding.top / 2)
        .attr('font-size', h / 25 + 'px')
        .text(title);
    }

    var xMin = 1;
    var xMax = data.length + 1;

    var yMin = 0;
    var yMax = data[0].yVar.length;

    var nodeWidth = (w - padding.left - padding.right) / xMax;
    var nodeHeight = (h - padding.top - padding.bottom) / 50;

    var colours = d3.scale.linear()
      .domain([1, 5, 10, 15, 20])
      .range(['lime', 'blue', 'yellow', 'red', 'black']);

    //create scale functions
    var xScale = d3.scale.linear()
      .nice()
      .range([padding.left, w - (padding.right)])
      .domain([xMin, xMax - 1]);

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

    svg.append("clipPath")
      .append("rect")
      .attr("x", padding.left)
      .attr("y", padding.top)
      .attr("width", w - (padding.right + padding.left))
      .attr("height", h - (padding.top + padding.bottom));

    //Create X axis
    svg.append("g")
      .attr("class", "axis")
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
      .attr("transform", "translate(" + padding.left + ", 0)")
      .call(yAxis)
      .append("text")
      .attr("dy", -padding.left / 1.5)
      .attr("transform", "translate(0," + h / 2 + ")rotate(-90)")
      .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
      .style("text-anchor", "middle")
      .text(yLabel);

    // have object in higher scope and change it when drawing.
    // must be set to the percents for each rect. 
    var gradiantData;

    function clearGradiantArray() {
      var returnVal = [];
      for (var i = 1; i <= 20; i++) {
        var aColor = colours(i);
        returnVal.push({
          offset: '0%',
          color: aColor
        });
        returnVal.push({
          offset: '0%',
          color: aColor
        });
      }
      return returnVal;
    }

    function setGradiantData(point, count) {
      gradiantData = clearGradiantArray();
      var i = 0;
      //find the first value over a percentage in yVars and find its percentage out of yMax and change gradientData[i].offset to match the new percentage.
      while (i < yMax) {
        var change = 0;
        var x = point.yVar[i];
        if (x <= 0.05 && x >= 0) {
          change = (i / yMax) * 100 + "%";
          gradiantData[1].offset = change;
          gradiantData[2].offset = change;
        }
        if (x <= 0.1 && x > 0.05) {
          change = (i / yMax) * 100 + "%";
          gradiantData[3].offset = change;
          gradiantData[4].offset = change;
        }
        if (x <= 0.15 && x > 0.1) {
          change = (i / yMax) * 100 + "%";
          gradiantData[5].offset = change;
          gradiantData[6].offset = change;
        }
        if (x <= 0.2 && x > 0.15) {
          change = (i / yMax) * 100 + "%";
          gradiantData[7].offset = change;
          gradiantData[8].offset = change;
        }
        if (x <= 0.25 && x > 0.2) {
          change = (i / yMax) * 100 + "%";
          gradiantData[9].offset = change;
          gradiantData[10].offset = change;
        }
        if (x <= 0.3 && x > 0.25) {
          change = (i / yMax) * 100 + "%";
          gradiantData[11].offset = change;
          gradiantData[12].offset = change;
        }
        if (x <= 0.35 && x > 0.3) {
          change = (i / yMax) * 100 + "%";
          gradiantData[13].offset = change;
          gradiantData[14].offset = change;
        }
        if (x <= 0.4 && x > 0.35) {
          change = (i / yMax) * 100 + "%";
          gradiantData[15].offset = change;
          gradiantData[16].offset = change;
        }
        if (x <= 0.45 && x > 0.4) {
          change = (i / yMax) * 100 + "%";
          gradiantData[17].offset = change;
          gradiantData[18].offset = change;
        }
        if (x <= 0.5 && x > 0.45) {
          change = (i / yMax) * 100 + "%";
          gradiantData[19].offset = change;
          gradiantData[20].offset = change;
        }
        if (x <= 0.55 && x > 0.5) {
          change = (i / yMax) * 100 + "%";
          gradiantData[21].offset = change;
          gradiantData[22].offset = change;
        }
        if (x <= 0.6 && x > 0.55) {
          change = (i / yMax) * 100 + "%";
          gradiantData[23].offset = change;
          gradiantData[24].offset = change;
        }
        if (x <= 0.65 && x > 0.6) {
          change = (i / yMax) * 100 + "%";
          gradiantData[25].offset = change;
          gradiantData[26].offset = change;
        }
        if (x <= 0.7 && x > 0.65) {
          change = (i / yMax) * 100 + "%";
          gradiantData[27].offset = change;
          gradiantData[28].offset = change;
        }
        if (x <= 0.75 && x > 0.7) {
          change = (i / yMax) * 100 + "%";
          gradiantData[29].offset = change;
          gradiantData[30].offset = change;
        }
        if (x <= 0.8 && x > 0.75) {
          change = (i / yMax) * 100 + "%";
          gradiantData[31].offset = change;
          gradiantData[32].offset = change;
        }
        if (x <= 0.85 && x > 0.8) {
          change = (i / yMax) * 100 + "%";
          gradiantData[33].offset = change;
          gradiantData[34].offset = change;
        }
        if (x <= 0.9 && x > 0.85) {
          change = (i / yMax) * 100 + "%";
          gradiantData[35].offset = change;
          gradiantData[36].offset = change;
        }
        if (x <= 0.95 && x > 0.9) {
          change = (i / yMax) * 100 + "%";
          gradiantData[37].offset = change;
          gradiantData[38].offset = change;
        }
        if (x <= 1 && x > 0.95) {
          change = (i / yMax) * 100 + "%";
          gradiantData[39].offset = change;
        }
        i++;
      }

      //create new gradient with individual ID
      svg.append("linearGradient")
        .attr("id", "temperature-gradient" + dir + "-" + count)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", h - padding.bottom)
        .attr("x2", 0).attr("y2", padding.top)
        .selectAll("stop")
        .data(gradiantData)
        .enter().append("stop")
        .attr("offset", function (d) {
          return d.offset;
        })
        .attr("stop-color", function (d) {
          return d.color;
        });
    }

    var grid = svg.selectAll(".qualLine")
      .data(data).enter().append('rect')
      .attr("x", function (d, i) {
        setGradiantData(d, i);
        return xScale(d.xVar);
      })
      .attr("y", yScale(yMax))
      .attr("width", nodeWidth)
      .attr("height", (h - padding.top - padding.bottom))
      .attr("class", "qualLine")
      .attr("fill", function (d, i) {
        return "url(#temperature-gradient" + dir + "-" + i + ")";
      })
      .attr("stroke", function (d, i) {
        return "url(#temperature-gradient" + dir + "-" + i + ")";
      })
      .attr("clip-path", "url(#chart-area" + 1 + ")")
      .append('title').text(function (d) {
        return "cycle " + d.xVar;
      });

/*
    this.resize = function (height, width) {
      h = 350;
      w = (window.innerWidth - 100) / 2;
      if (height && width) {
        this.height = height;
        this.width = width;
      }
      nodeWidth = (w - padding.left - padding.right) / xMax;

      svg.attr("width", w);

      var clipPath = svg.select("#chart-area" + thisChartIndex + " rect");
      clipPath.transition().duration(1000).attr("width", w - (padding.right + padding.left));

      xScale.range([padding.left, w - padding.right]);
      yScale.range([h - padding.bottom, padding.top]);

      xAxis.scale(xScale);

      var background = svg.select("#background" + thisChartIndex);

      background.transition().duration(1000)
        .attr("width", w);

      var updatedRect = svg.selectAll('.qualLine')
        .data(data[1].values);

      updatedRect.transition().duration(1000)
        .attr("x", function (d) {
          return xScale(d.xVar);
        })
        .attr("y", yScale(yMax))
        .attr("width", nodeWidth)
        .attr("clip-path", "url(#chart-area" + thisChartIndex + ")");

      var t = svg.transition().duration(1000);

      t.select("#xAxis" + thisChartIndex)
        .call(xAxis);

      svg.select("#xAxisText" + thisChartIndex).transition().duration(1000)
        .attr("transform", "translate(" + (w / 2) + "," + padding.bottom / 2 + ")");

    };
*/
    return svg;
  }

  function makeLegend(h, padding) {
    var gradiantData = [];
    var w = 50;

    var colours = d3.scale.linear()
      .domain([1, 5, 10, 15, 20])
      .range(['lime', 'blue', 'yellow', 'red', 'black']);

    for (var i = 1; i <= 20; i++) {
      aColor = colours(i);
      gradiantData.push({
        offset: (5 * i) - 5 + '%',
        color: aColor
      });
      gradiantData.push({
        offset: 5 * i + '%',
        color: aColor
      });
    }

    // Create SVG element
    var bare_svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
    var svg = d3.select(bare_svg).attr("width", w).attr("height", h);

    svg.append("linearGradient")
      .attr("id", "temperature-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", h - padding.bottom)
      .attr("x2", 0).attr("y2", padding.top)
      .selectAll("stop")
      .data(gradiantData)
      .enter().append("stop")
      .attr("offset", function (d) {
        return d.offset;
      })
      .attr("stop-color", function (d) {
        return d.color;
      });

    var legendScale = d3.scale.linear()
      .nice()
      .range([h - padding.bottom, padding.top])
      .domain([100, 0]);

    var legendAxis = d3.svg.axis()
      .scale(legendScale)
      .orient("left")
      .ticks(10);

    var legend = svg.append('g').attr('class', 'legend');
    var legendWidth = 20;

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (w - legendWidth) + ",0)")
      .call(legendAxis);

    legend.append('rect')
      .attr('x', w - legendWidth)
      .attr('y', padding.top)
      .attr('width', legendWidth)
      .attr('height', h - (padding.top + padding.bottom))
      .attr('fill', "url(#temperature-gradient)");

    return svg;
  }

  function makeQualPoints(a1, a2) {
    var points = [];
    for (n = 0; n < a1.length; n++) {
      points.push({xVar: a1[n], yVar: makeQualValues(a2[n])});
    }
    return points;
  }

  function makeQualValues(data) {
    var returnValue = [];
    var fragments = 0;
    for (var j = 2; j < data.length; j++) {
      returnValue.push(+data[j]);
      fragments = fragments + (+data[j]);
    }
    var lineTotal = 0;
    for (var i = 0; i < returnValue.length; i++) {
      lineTotal = lineTotal + returnValue[i];
      returnValue[i] = (lineTotal / fragments);
    }
    return returnValue;
  }


  return {
    drawChart: drawChart,
  };

});
