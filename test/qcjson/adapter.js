"use strict";
define(
  ['../../src/qcjson/adapter'],
  function(adapter) {
    var run = function() {
      QUnit.test('adapter graph tests', function() {
        var aJSON = {
          "forward_fasta_read_count": 1,
          "forward_start_counts":{"1":829,"14":2,"15":23,"16":1,"17":1,"18":1,
            "19":2,"2":8,"20":91,"21":2,"23":1,"24":1,"25":1,"26":3,"27":3,
            "28":1,"29":8,"30":4,"31":3,"32":1,"33":3,"34":1,"36":1,"37":3,
            "38":5,"39":3,"40":6,"41":3,"42":3,"43":9,"44":4,"45":2,"46":8,
            "9":1},
          "reverse_fasta_read_count": 1,
          "reverse_start_counts":{"1":226,"14":1,"15":23,"16":1,"18":1,"19":1,
            "20":5,"21":1,"23":2,"24":1,"25":1,"26":3,"27":2,"28":2,"29":4,
            "30":2,"31":2,"32":3,"33":3,"34":3,"36":1,"37":2,"38":8,"39":2,
            "4":14,"40":4,"41":3,"42":1,"43":6,"44":8,"45":1,"46":9},
        };
        var chart;
        chart=adapter.drawChart({'data': aJSON, 'width': 600, 'height': 300, 'title': 'Adapter Start Count'}); 
        jQuery('#bcviz_adapter_fwd').append( function(){return chart.svg_fwd.node();} );
        jQuery('#bcviz_adapter_rev').append( function(){return chart.svg_rev.node();} );
        QUnit.ok(chart,"Created adapter ok");
        QUnit.equal(adapter._roundToPowerOfTen(0),0,"Rounding is ok");
        QUnit.equal(adapter._roundToPowerOfTen(1),1,"Rounding is ok");
        QUnit.equal(adapter._roundToPowerOfTen(999),1000,"Rounding is ok");
        QUnit.equal(adapter._roundToPowerOfTen(1001),10000,"Rounding is ok");
      });

      QUnit.test('empty adapter graph tests', function() {
        var aJSON = {
          "forward_fasta_read_count": 1,
          "forward_start_counts":{"1":829,"14":2,"15":23,"16":1,"17":1,"18":1,
            "19":2,"2":8,"20":91,"21":2,"23":1,"24":1,"25":1,"26":3,"27":3,
            "28":1,"29":8,"30":4,"31":3,"32":1,"33":3,"34":1,"36":1,"37":3,
            "38":5,"39":3,"40":6,"41":3,"42":3,"43":9,"44":4,"45":2,"46":8,
            "9":1},
          "reverse_start_counts":{},
        };
        var chart;
        chart=adapter.drawChart({'data': aJSON, 'width': 600, 'height': 300, 'title': 'Empty Adapter Start Count'}); 
        jQuery('#bcviz_adapter_fwd_empty').append( function(){return chart.svg_fwd.node();} );
        QUnit.ok(chart,"Created adapter ok");
        QUnit.equal(chart.svg_rev,null,'reverse chart is null');
      });

    };
    return {run: run}
  }
);

