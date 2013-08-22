var chartIndex = 0;
define(['jquery', 'd3', 'src/divSelections'], function(jQuery, d3, checkDivSelection){
    return function (data, divID, width, height) {
        var mismatchData = {
            id_run: data.id_run,
            tag_index: data.tag_index,
            position: data.position
        };
        //create forward and reverse data objects
        var forwardData = Object.create(mismatchData);
        var reverseData = Object.create(mismatchData);
        //define individual data points for forward and reverse
        forwardData.start_counts = data.forward_start_counts;
        reverseData.start_counts = data.reverse_start_counts;
        //format the data
        forwardData.formattedData = format_adapter_chart(forwardData);
        reverseData.formattedData = format_adapter_chart(reverseData);
        //change the yMax variable to be the larger of the two graphs
        forwardData.yMax = roundToPowerOfTen(d3.max(forwardData.formattedData, function (d) { return d.yVar; }));
        reverseData.yMax = roundToPowerOfTen(d3.max(reverseData.formattedData, function (d) { return d.yVar; }));
        if(forwardData.yMax > reverseData.yMax){
            reverseData.yMax = forwardData.yMax;
        }else{
            forwardData.yMax = reverseData.yMax;
        }
        //draw new plots
        adapterChart(forwardData, divID, false, "Forward", width, height);
        adapterChart(reverseData, divID, true, "Reverse", width, height);
    };
        function format_adapter_chart (data) {
            var formattedData = [];
            for(var k in data.start_counts){
                formattedData.push({xVar: parseInt(k, 10), yVar: data.start_counts[k]});
            }
            return formattedData;
        }
        function roundToPowerOfTen (aNumb) {
            return Math.pow(10, Math.ceil(Math.log(aNumb) / Math.LN10));
        }
        function adapterChart (data, divID, legend, title, width, height) {
            var w = 500;
            var h = 250;
            if(width && height){
              w = width;
              h = height;
            }
            var padding = {top: 25, right: 25, bottom: 25, left: 50};

            chartIndex++;

            divID = checkDivSelection(divID);
            var svg = d3.select(divID).append("svg")
                .attr("width", w)
                .attr("height", h);

            if(title){
                padding.top = 50;
                svg.append('text')
                    .attr("transform", "translate(" + padding.left + ", " + padding.top / 4 + ")")
                    .style('font-size', padding.top / 4)
                    .text(title + ' Adapter Start Count: run ' + data.id_run + ", position " + data.position + ", tag " + data.tag_index);
            }

            var xMin = d3.min(data.formattedData, function (d) { return d.xVar; });
            var xMax = d3.max(data.formattedData, function (d) { return d.xVar; }) + 1;
            var yMin = 0.1;
            var nodeWidth = (w-padding.left-padding.right) / xMax;

            //create scale functions
            var xScale = d3.scale.linear()
                     .nice()
                     .range([padding.left, w - (padding.right)])
                     .domain([xMin,xMax]);

            var yScale = d3.scale.log()
                     .clamp(true)
                     .nice()
                     .range([h - padding.bottom, padding.top]);

            //Define X axis
            var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(10);

            //define Y axis
            var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .ticks(10, function (d) {
                        if(d < 1){
                        }else{
                            return d;
                        }
                    });

            //Create X axis
            svg.append("g")
                .attr("class", "axis")
                .attr("id", "xAxis" + chartIndex)
                .attr("transform", "translate(0," + (h-padding.bottom) + ")")
                .call(xAxis);

            //add X axis origin label
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

            yScale.domain([yMin, data.yMax]);

            //Create Y axis
            svg.append("g")
               .attr("class", "axis")
               .attr("id", "yAxis" + chartIndex)
               .attr("transform", "translate(" + padding.left + ", 0)")
               .call(yAxis);

            //make x grid
            svg.append("g")
               .attr("class", "grid")
               .attr("id","xGrid")
               .attr("transform", "translate(0," + (h - padding.bottom) + ")")
               .call(make_x_grid()
                       .tickSize(-h+(padding.top + padding.bottom), 0, 0)
                       .tickFormat("")
               );
            //make y grid
            svg.append("g")
               .attr("class", "grid")
               .attr("id","yGrid")
               .attr("transform", "translate(" + padding.left + ",0)")
               .call(make_y_grid()
                    .tickSize(-w+(padding.left + padding.right), 0,0)
                    .tickFormat("")
               );

            //group for the bars
            var bars = svg.append('g');

            //draw bars in group
            bars.selectAll('rect')
                    .data(data.formattedData)
                    .enter()
                    .append('rect')
                    .attr('x', function (d) { return xScale(d.xVar); })
                    .attr('y', function (d) { return yScale(d.yVar); })
                    .attr('width', nodeWidth)
                    .attr('height', function (d) { return h - padding.bottom - yScale(d.yVar); })
                    .attr('fill', 'blue')
                    .attr('opacity', 0.6)
                    .attr('stroke-width', '1px')
                    .attr('stroke', 'white');
        }
});