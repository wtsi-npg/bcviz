require.config({
    paths: {
        jquery: 'jquery-2.0.3'
    },
    shim: {
        d3: {
            exports: 'd3'
        }
    }
});
require(['lib/adapter'], function (a) {
    jQuery.getJSON("demo/10514_1%2313.adapter.json", function (data) {
        a(data, false, true);
    });
});
require(['lib/insertSizeHistogram'], function (i) {
    jQuery.getJSON("demo/10514_1%2314.insert_size.json", function (data) {
        i(data, false, true);
    });
});
require(['lib/mismatch'], function (m) {
    jQuery.getJSON("demo/10514_2%2316.sequence_error.json", function (data) {
        m(data, false, true);
    });
});
require(['lib/readBCfile', 'lib/ICCharts'], function (b, ic) {
    var files = ["demo/sample_1.bc","demo/sample_2.bc","demo/sample_3.bc","demo/sample_4.bc"];
    var points = [];
    for (var i = files.length - 1; i >= 0; i--) {
        points.push(b(files[i]));
    }
    for (i = points.length - 1; i >= 0; i--) {
        ic(points[i], true, false, true);
        //splitICchart(points[i]);
        //firstFragmentQuality(points[i], "      ", false, true);
        //lastFragmentQuality(points[i], " ", true, true);
        //isChart(points[i]);
        //gcChart(points[i]);
        //gccChart(points[i]);
        //indelDist(points[i]);
        //gcDepth(points[i], false, false);
        //coverage(points[i]);
    }
});