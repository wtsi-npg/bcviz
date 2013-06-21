var points = [];
var color = d3.scale.category10();

function readIC(fileName){
	d3.csv(fileName,function(csv) {
		//set keys on colour scale   
		color.domain(d3.keys(csv[0]).filter(function(key) { return key !== "cycle" && key !== "label"; }));

		//parse data to ints
		csv.forEach(function(d) {
	    	d.cycle = parseInt(d.cycle);
	    	d.numInsertFwd = parseInt(d.numInsertFwd);
	    	d.numInsertRev = parseInt(d.numInsertRev);
	    	d.numDeletionsFwd = parseInt(d.numDeletionsFwd);
	    	d.numDeletionsRev = parseInt(d.numDeletionsRev);
	  	});

		//format data
		points = color.domain().map(function (name) {
			return{
				name: name,
				values: csv.map(function(d) {
					return {xVar: d.cycle, numb: +d[name]};
				})
			};
		});
	})
	return points;
}
