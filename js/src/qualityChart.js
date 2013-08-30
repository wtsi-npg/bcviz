var chartIndex = 0;
define(['d3', 'src/divSelections'], function(d3, checkDivSelection){
    return function (data, direction, divID, legend, title, width, height) {
        if(direction === "r"){
            direction = 3;
        }else{
            direction = 2;
        }
        if(data && data[direction] && data[direction][1] && data[direction][1].values && data[direction][1].values.length !== 0){
            if(title && data[9]){
                title = data[9].title;
            }
            return new qualityChart(data[direction], divID, legend, title, width, height);
        }else{
            window.console.log('data does not exist; chart not created.');
            return null;
        }
    };
    function qualityChart (data, divID, legend, title, width, height) {
        this.width = 350;
        this.height = 250;
        var w = this.width;
        var h = this.height;
        if(width && height){
            this.width = width;
            this.height = height;
        }
        var padding = {top: 5, right: 10, bottom: 50, left: 50};
        var xLabel = data[0].xLabel;
        var yLabel = data[0].yLabel;

        divID = checkDivSelection(divID);

        chartIndex++;

        var thisChartIndex = chartIndex;

        //Create SVG element
        this.svg = d3.select(divID).append('svg')
            .attr("id", "chart" + chartIndex)
            .attr("width", w)
            .attr("height", h);

        var svg = this.svg;

        if(title){
            padding.top = 50;
            //append title
            svg.append('text')
                .attr('x', padding.left)
                .attr('y', padding.top / 2)
                .attr('font-size', h/25 + 'px')
                .text(title);
        }

        var xMin = 1;
        var xMax = data[1].values.length + 1;

        var yMin = 0;
        var yMax = data[1].values[0].yVar.length;

        var nodeWidth = (w-padding.left-padding.right) / xMax;
        var nodeHeight = (h - padding.top-padding.bottom) / 50;

        //create gradiant
        /*var rainbow = new Rainbow();
        rainbow.setNumberRange(1, 20);
        rainbow.setSpectrum('lime', 'blue', 'yellow', 'red', 'black');*/

        var colours = d3.scale.linear()
            .domain([1, 5, 10, 15, 20])
            .range(['lime', 'blue', 'yellow', 'red', 'black']);

        //create scale functions
        var xScale = d3.scale.linear()
                 .nice()
                 .range([padding.left, w - (padding.right)])
                 .domain([xMin,xMax - 1]);

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
            .attr("id", "chart-area" + chartIndex)
            .append("rect")
            .attr("x", padding.left)
            .attr("y", padding.top)
            .attr("width", w - (padding.right + padding.left))
            .attr("height", h - (padding.top + padding.bottom));

        //Create X axis
        svg.append("g")
            .attr("class", "axis")
            .attr("id", "xAxis" + chartIndex)
            .attr("transform", "translate(0," + (h-padding.bottom) + ")")
            .call(xAxis)
            .append("text")
            .attr("id", "xAxisText" + chartIndex)
            .attr("dy", ".71em")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (w / 2) + "," + padding.bottom / 2 + ")")
            .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
            .text(xLabel);

        //Create Y axis
        svg.append("g")
            .attr("class", "axis")
            .attr("id", "yAxis" + chartIndex)
            .attr("transform", "translate(" + padding.left + ", 0)")
            .call(yAxis)
            .append("text")
            .attr("dy", -padding.left/1.5)
            .attr("transform", "translate(0," + h/2 + ")rotate(-90)")
            .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
            .style("text-anchor", "middle")
            .text(yLabel);

        //have object in higher scope and change it when drawing.
        //must be set to the percents for each rect. 
        var gradiantData;

        function clearGradiantArray(){
            var returnVal = [];
            for (var i = 1; i <= 20; i++) {
                var aColor = colours(i);
                returnVal.push({offset: '0%', color: aColor});
                returnVal.push({offset: '0%', color: aColor});
            }
            return returnVal;
        }

        function setGradiantData (yVars, count) {
            gradiantData = clearGradiantArray();
            var i = 0;
            //find the first value over a percentage in yVars and find its percentage out of yMax and change gradientData[i].offset to match the new percentage.
            while(i < yMax){
                var change = 0;
                var x = yVars.yVar[i];
                if(x <= 0.05 && x >= 0){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[1].offset = change;
                    gradiantData[2].offset = change;
                }
                if(x <= 0.1 && x > 0.05){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[3].offset = change;
                    gradiantData[4].offset = change;
                }
                if(x <= 0.15 && x > 0.1){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[5].offset = change;
                    gradiantData[6].offset = change;
                }
                if(x <= 0.2 && x > 0.15){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[7].offset = change;
                    gradiantData[8].offset = change;
                }
                if(x <= 0.25 && x > 0.2){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[9].offset = change;
                    gradiantData[10].offset = change;
                }
                if(x <= 0.3 && x > 0.25){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[11].offset = change;
                    gradiantData[12].offset = change;
                }
                if(x <= 0.35 && x > 0.3){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[13].offset = change;
                    gradiantData[14].offset = change;
                }
                if(x <= 0.4 && x > 0.35){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[15].offset = change;
                    gradiantData[16].offset = change;
                }
                if(x <= 0.45 && x > 0.4){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[17].offset = change;
                    gradiantData[18].offset = change;
                }
                if(x <= 0.5 && x > 0.45){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[19].offset = change;
                    gradiantData[20].offset = change;
                }
                if(x <= 0.55 && x > 0.5){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[21].offset = change;
                    gradiantData[22].offset = change;
                }
                if(x <= 0.6 && x > 0.55){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[23].offset = change;
                    gradiantData[24].offset = change;
                }
                if(x <= 0.65 && x > 0.6){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[25].offset = change;
                    gradiantData[26].offset = change;
                }
                if(x <= 0.7 && x > 0.65){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[27].offset = change;
                    gradiantData[28].offset = change;
                }
                if(x <= 0.75 && x > 0.7){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[29].offset = change;
                    gradiantData[30].offset = change;
                }
                if(x <= 0.8 && x > 0.75){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[31].offset = change;
                    gradiantData[32].offset = change;
                }
                if(x <= 0.85 && x > 0.8){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[33].offset = change;
                    gradiantData[34].offset = change;
                }
                if(x <= 0.9 && x > 0.85){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[35].offset = change;
                    gradiantData[36].offset = change;
                }
                if(x <= 0.95 && x > 0.9){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[37].offset = change;
                    gradiantData[38].offset = change;
                }
                if(x <= 1 && x > 0.95){
                    change = (i / yMax) * 100 + "%";
                    gradiantData[39].offset = change;
                }
                i++;
            }

            //create new gradient with individual ID
            svg.append("linearGradient")
                .attr("id", "temperature-gradient" + chartIndex + "-" + count)
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("x1", 0).attr("y1", h - padding.bottom)
                .attr("x2", 0).attr("y2", padding.top)
            .selectAll("stop")
                .data(gradiantData)
            .enter().append("stop")
                .attr("offset", function(d) { return d.offset; })
                .attr("stop-color", function(d) { return d.color; });
        }

        var grid = svg.selectAll(".qualLine")
            .data(data[1].values).enter().append('rect')
            .attr("x", function (d, i) { setGradiantData(d, i); return xScale(d.xVar); })
            .attr("y", yScale(yMax))
            .attr("width", nodeWidth)
            .attr("height", (h - padding.top - padding.bottom))
            .attr("class", "qualLine")
            .attr("fill", function (d, i) { return "url(#temperature-gradient" + chartIndex + "-" + i + ")"; })
            .attr("stroke", function (d, i) { return "url(#temperature-gradient" + chartIndex + "-" + i + ")"; })
            .attr("clip-path", "url(#chart-area" + chartIndex + ")")
            .append('title').text(function (d) { return "cycle " + d.xVar; });

        //draw the legend
        if(legend){
            qualityChartLegend(divID, h, padding);
        }

        this.resize = function (height, width) {
            h = 350;
            w = (window.innerWidth - 100) / 2;
            if(height && width){
                this.height = height;
                this.width = width;
            }
            nodeWidth = (w-padding.left-padding.right) / xMax;

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
                .attr("x", function (d) { return xScale(d.xVar); })
                .attr("y", yScale(yMax))
                .attr("width", nodeWidth)
                .attr("clip-path", "url(#chart-area" + thisChartIndex + ")");

            var t = svg.transition().duration(1000);

            t.select("#xAxis" + thisChartIndex)
                .call(xAxis);

            svg.select("#xAxisText" + thisChartIndex).transition().duration(1000)
                .attr("transform", "translate(" + (w / 2) + "," + padding.bottom / 2 + ")");

        };
    }
    function qualityChartLegend (divID, h, padding) {
        var gradiantData = [];
        var w = 50;

        //create gradiant
        /*var rainbow = new Rainbow();
        rainbow.setNumberRange(1, 20);
        rainbow.setSpectrum('lime', 'blue', 'yellow', 'red', 'black');*/

        var colours = d3.scale.linear()
            .domain([1, 5, 10, 15, 20])
            .range(['lime', 'blue', 'yellow', 'red', 'black']);

        for (var i = 1; i <= 20; i++) {
            aColor = colours(i);
            gradiantData.push({offset: (5 * i) - 5 + '%', color: aColor});
            gradiantData.push({offset: 5 * i + '%', color: aColor});
        }

        var svg = d3.select(divID).append('svg')
            .attr("width", w)
            .attr("height", h);

        svg.append("linearGradient")
                .attr("id", "temperature-gradient")
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("x1", 0).attr("y1", h - padding.bottom)
                .attr("x2", 0).attr("y2", padding.top)
            .selectAll("stop")
                .data(gradiantData)
            .enter().append("stop")
                .attr("offset", function(d) { return d.offset; })
                .attr("stop-color", function(d) { return d.color; });

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
            .attr("id", "legendAxis" + chartIndex)
            .attr("transform", "translate(" + (w - legendWidth) + ",0)")
            .call(legendAxis);

        legend.append('rect')
                .attr("id", "legendRect" + chartIndex)
                .attr('x', w - legendWidth)
                .attr('y', padding.top)
                .attr('width', legendWidth)
                .attr('height', h - (padding.top + padding.bottom))
                .attr('fill', "url(#temperature-gradient)");
    }
});