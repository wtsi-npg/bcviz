"use strict";
define(
    ['../../src/qcjson/insertSizeHistogram'],
    function(insertSizeHistogram) {
        var run = function() {
            QUnit.test('insertSizeHistogram tests', function() {
				var aJSON = {
                    "bin_width":6,
                    "bins":[4,1,1,7,4,3,2,7,3,6,7,5,5,11,4,18,14,16,17,38,57,65,109,125,175,221,276,375,412,509,508,452,454,401,332,314,236,192,124,111,74,41,35,29,22,20,21,24,21,23,22,24,20,15,12,19,17,15,22,15,21,16,15,39,7,7,1,6,5,5,4,7,1,2,2,4,4,3,7,4,4,6,7,2,6,4,6,8,5,4],
                    "mean":274,
                    "min_isize":76,
                    "num_well_aligned_reads":6324,
                    "num_well_aligned_reads_opp_dir":109,
                    "paired_reads_direction_in":"1",
                    "std":38,
                    "norm_fit_modes":[100,100,100],
                };
				var hist;
                hist=insertSizeHistogram.drawChart({'data': aJSON}); 
                jQuery("#insert_size").append( function(){return hist.svg.node();} );
				QUnit.ok(hist,"Created histogram ok");
            });

            QUnit.test('insertSizeHistogram tests', function() {
				var aJSON = {
                    "bin_width":8,
                    "bins":[4,1,1,7,4,3,2,7,3,6,7,5,5,11,4,18,14,16,17,38,57,65,109,125,175,221,276,375,412,509,508,452,454,401,332,314,236,192,124,111,74,41,35,29,22,20,21,24,21,23,22,24,20,15,12,19,17,15,22,15,21,16,15,39,7,7,1,6,5,5,4,7,1,2,2,4,4,3,7,4,4,6,7,2,6,4,6,8,5,4],
                    "mean":274,
                    "min_isize":76,
                    "num_well_aligned_reads":6324,
                    "num_well_aligned_reads_opp_dir":109,
                    "paired_reads_direction_in":0,
                    "std":30,
//                    "norm_fit_modes":[100,100,100],
                };
				var hist;
                hist=insertSizeHistogram.drawChart({'data': aJSON}); 
                jQuery("#insert_size2").append( function(){return hist.svg.node();} );
				QUnit.ok(hist,"Created histogram ok");
            });

        };
        return {run: run}
    }
);

