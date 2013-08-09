function readFile(fileName)
{
	var returnValue;
	//check if file name contians only whitespace
	if(/\S/.test(fileName)){
		jQuery.ajax({
			type: "GET",
			dataType: "text",
			async: false,
			url: fileName,
			crossDomain: true,
			success: function (text) {
				//console.log(text);
				var contentsOfFileAsString = text;
				returnValue = d3.tsv.parseRows(contentsOfFileAsString);
				returnValue.unshift('#' + fileName);
			},
			error: function (x, status, error) {
				window.console.log(status + ": " + error);
				//window.console.log(x);
				returnValue = null;
			}
		});
	}
	return returnValue;
}
function formatData (fileString) {
	var formattedData = null;
	if(fileString && typeof fileString === "object" && fileString.length > 0){
		formattedData = [
			[
				{xLabel: "Cycle",
				yLabel: "Indel"},
				{
					name: "insertions_fwd",
					values: [
					]
				},
				{
					name: "deletions_fwd",
					values: [
					]
				},
				{
					name: "insertions_rev",
					values: [
					]
				},
				{
					name: "deletions_rev",
					values: []
				}
			],
			[
				{xLabel: "Line Number",
				yLabel: "Pairs"},
				{
					name: "totalPairs",
					values: []
				},
				{
					name: "inwardPairs",
					values: [
					]
				},
				{
					name: "outwardPairs",
					values: [
					]
				},
				{
					name: "otherPairs",
					values: [
					]
				}
			],
			[
				{
					xLabel: "Cycle Number(forward read)",
					yLabel: "Quality"
				},
				{
					values:[
					]
				}
			],
			[
				{
					xLabel: "Cycle Number(reverse read)",
					yLabel: "Quality"
				},
				{
					values:[
					]
				}
			],
			[
				{
					xLabel: "GC Content (%)",
					yLabel: "Normailized Frequency"
				},
				{
					name: "First_Fragments",
					values:[
					]
				},
				{
					name: "Last_Fragments",
					values:[
					]
				}
			],
			[
				{xLabel: "Read Cycle",
				yLabel: "Base Content(%)"},
				{
					name: "A",
					values: [
					]
				},
				{
					name: "C",
					values: [
					]
				},
				{
					name: "G",
					values: [
					]
				},
				{
					name: "T",
					values: [
					]
				}
			],
			[
				{xLabel: "Indel Length",
				yLabelLeft: "Indel Count(log)",
				yLabelRight: "Insertions/Deltions Ratio"},
				{
					name: "insertions",
					values: [
					]
				},
				{
					name: "deletions",
					values: [
					]
				}
			],
			[
				{xLabel: "Coverage",
				yLabel: "Nummber of Mapped Bases"},
				{
					name: "Coverage",
					values: [
					]
				}
			],
			[
				{xLabel: "Percentile of Mapped Sequence Ordered By GC Content",
				yLabel: "Mapped Depth"},
				{
					name: "10-90th Percentile",
					values: [
					]
				},
				{
					name: "25-75th Percentile",
					values: [
					]
				},
				{
					name: "50th Percentile",
					values: [
					]
				},
				{
					values: [
					]
				}
			],
			{title: fileString[0].replace('#', '').replace('%23', '#')}
		];
		for (var i = 0; i < fileString.length; i++) {
			switch (fileString[i][0]){
				case "IC":
					formattedData[0][1].values.push({xVar: +fileString[i][1], yVar: +fileString[i][2], name: "insertions_fwd"});
					formattedData[0][3].values.push({xVar: +fileString[i][1], yVar: +fileString[i][3], name: "insertions_rev"});
					formattedData[0][2].values.push({xVar: +fileString[i][1], yVar: +fileString[i][4], name: "deletions_fwd"});
					formattedData[0][4].values.push({xVar: +fileString[i][1], yVar: +fileString[i][5], name: "deletions_rev"});
					break;
				case "IS":
					formattedData[1][1].values.push({xVar: +fileString[i][1], yVar: +fileString[i][2], name: "totalPairs"});
					formattedData[1][2].values.push({xVar: +fileString[i][1], yVar: +fileString[i][3], name: "inwardPairs"});
					formattedData[1][3].values.push({xVar: +fileString[i][1], yVar: +fileString[i][4], name: "outwardPairs"});
					formattedData[1][4].values.push({xVar: +fileString[i][1], yVar: +fileString[i][5], name: "otherPairs"});
					break;
				case "FFQ":
					formattedData[2][1].values.push({xVar: +fileString[i][1], yVar:getQualityVals(fileString[i])});
					break;
				case "LFQ":
					formattedData[3][1].values.push({xVar: +fileString[i][1], yVar:getQualityVals(fileString[i])});
					break;
				case "GCF":
					formattedData[4][1].values.push({xVar: +fileString[i][1], yVar: +fileString[i][2], name: "First_Fragments"});
					break;
				case "GCL":
					formattedData[4][2].values.push({xVar: +fileString[i][1], yVar: +fileString[i][2], name: "Last_Fragments"});
					break;
				case "GCC":
					formattedData[5][1].values.push({xVar: +fileString[i][1], yVar: +fileString[i][2], name: "A"});
					formattedData[5][2].values.push({xVar: +fileString[i][1], yVar: +fileString[i][3], name: "C"});
					formattedData[5][3].values.push({xVar: +fileString[i][1], yVar: +fileString[i][4], name: "G"});
					formattedData[5][4].values.push({xVar: +fileString[i][1], yVar: +fileString[i][5], name: "T"});
					break;
				case "ID":
					formattedData[6][1].values.push({xVar: +fileString[i][1], yVar: +fileString[i][2], name: "insertions"});
					formattedData[6][2].values.push({xVar: +fileString[i][1], yVar: +fileString[i][3], name: "deletions"});
					break;
				case "COV":
					formattedData[7][1].values.push({xVar: +fileString[i][2], yVar: +fileString[i][3], name: "Coverage"});
					break;
				case "GCD":
					formattedData[8][1].values.push({xVar: +fileString[i][2], yVar: +fileString[i][3],yVar0: +fileString[i][7]});
					formattedData[8][2].values.push({xVar: +fileString[i][2], yVar: +fileString[i][4],yVar0: +fileString[i][6]});
					formattedData[8][3].values.push({xVar: +fileString[i][2], yVar: +fileString[i][5]});
					formattedData[8][4].values.push({xVar: +fileString[i][2], yVar: +fileString[i][1], name: "50th Percentile"});
					break;
			}
		}
		var maxGCF = d3.max(formattedData[4][1].values, function (d) {return d.yVar;});
		var maxGCL = d3.max(formattedData[4][2].values, function (d) {return d.yVar;});
		var maxGC;
		if(maxGCL > maxGCF){
			maxGC = maxGCL;
		}else{
			maxGC = maxGCF;
		}
		for (i = 0; i < formattedData[4][1].values.length; i++) {
			formattedData[4][1].values[i].yVar = formattedData[4][1].values[i].yVar / maxGC;
		}
		for (i = 0; i < formattedData[4][2].values.length; i++) {
			formattedData[4][2].values[i].yVar = formattedData[4][2].values[i].yVar / maxGC;
		}
	}
	return formattedData;
}
//get tags from a file
function getFileTags (fileString) {
	tags = [];
	for(var i = 0; i < fileString.length; i++){
		if(($.inArray(fileString[i][0], tags) === -1) && fileString[i][0][0] !== "#"){
			tags.push(fileString[i][0]);
		}
	}
	return tags;
}
function tagsToFunction (tags) {
	var map = {};
	for (var i = 0; i < tags.length; i++) {
		switch(tags[i]){
			case "IC":
				map.IC = icChart;
				break;
			case "IS":
				map.IS = isChart;
				break;
			case "FFQ":
				map.FFQ = firstFragmentQuality;
				break;
			case "LFQ":
				map.LFQ = lastFragmentQuality;
				break;
			case "GCF":
				map.GCF = gcChart;
				break;
			case "GCL":
				map.GCL = gcChart;
				break;
			case "GCC":
				map.GCC = gccChart;
				break;
			case "ID":
				map.ID = indelDist;
				break;
			case "COV":
				map.COV = coverage;
				break;
			case "GCD":
				map.GCD = gcDepth;
				break;
			default:
				console.log('no function for tag: ' + tags[i]);
				break;
		}
	}
	return map;
}
function getQualityVals(data) {
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