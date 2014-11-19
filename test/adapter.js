"use strict";
define(
    ['../js/src/adapter'],
    function(adapter) {
        var run = function() {
            QUnit.test('adapter graph tests', function() {
				var aJSON = {"forward_contaminated_read_count":1039,"forward_fasta_read_count":11981100,"forward_start_counts":{"1":829,"14":2,"15":23,"16":1,"17":1,"18":1,"19":2,"2":8,"20":91,"21":2,"23":1,"24":1,"25":1,"26":3,"27":3,"28":1,"29":8,"30":4,"31":3,"32":1,"33":3,"34":1,"36":1,"37":3,"38":5,"39":3,"40":6,"41":3,"42":3,"43":9,"44":4,"45":2,"46":8,"9":1},"id_run":"demo","position":"1","reverse_contaminated_read_count":345,"reverse_fasta_read_count":11981100,"reverse_start_counts":{"1":226,"14":1,"15":23,"16":1,"18":1,"19":1,"20":5,"21":1,"23":2,"24":1,"25":1,"26":3,"27":2,"28":2,"29":4,"30":2,"31":2,"32":3,"33":3,"34":3,"36":1,"37":2,"38":8,"39":2,"4":14,"40":4,"41":3,"42":1,"43":6,"44":8,"45":1,"46":9},"tag_index":"13"};
				var h;
				jQuery('.adapter').each(function(i) { jQuery(this).attr('data-check', JSON.stringify(aJSON)); h=adapter(this); });
				QUnit.ok(h,"Created adapter ok");
//				d3.select('svg').remove();
            });
        };
        return {run: run}
    }
);
