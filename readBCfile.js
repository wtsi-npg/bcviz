
			function readFile(fileName)
			{
				var contentsOfFileAsString = FileHelper.readStringFromFileAtPath(fileName);
				return d3.tsv.parseRows(contentsOfFileAsString);
			}

			function FileHelper()
			{}
			{
				FileHelper.readStringFromFileAtPath = function(fileName)
				{
					var request = new XMLHttpRequest();
					request.open("GET", fileName, false);
					request.send(null);
					var returnValue = request.responseText;

					return returnValue;
				};
			}
			function formatData (fileString) {
				var formattedData = [
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
							xLabel: "Cycle",
							yLabel: "Quality"
						},
						{
							values:[

							]
						}
					],
					[
						{
							xLabel: "Cycle",
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
					]
				];
				for (var i = 0; i < fileString.length; i++) {
					switch (fileString[i][0]){
						case "IC":
							formattedData[0][1].values.push({xVar: +fileString[i][1],yVar: +fileString[i][2]});
							formattedData[0][3].values.push({xVar: +fileString[i][1],yVar: +fileString[i][3]});
							formattedData[0][2].values.push({xVar: +fileString[i][1],yVar: +fileString[i][4]});
							formattedData[0][4].values.push({xVar: +fileString[i][1],yVar: +fileString[i][5]});
							break;
						case "IS":
							formattedData[1][1].values.push({xVar: +fileString[i][1],yVar: +fileString[i][2]});
							formattedData[1][2].values.push({xVar: +fileString[i][1],yVar: +fileString[i][3]});
							formattedData[1][3].values.push({xVar: +fileString[i][1],yVar: +fileString[i][4]});
							formattedData[1][4].values.push({xVar: +fileString[i][1],yVar: +fileString[i][5]});
							break;
						case "FFQ":
							formattedData[2][1].values.push({xVar: +fileString[i][1], yVar:getQualityVals(fileString[i])});
							break;
						case "LFQ":
							formattedData[3][1].values.push({xVar: +fileString[i][1], yVar:getQualityVals(fileString[i])});
							break;
						case "GCF":
							formattedData[4][1].values.push({xVar: +fileString[i][1], yVar: +fileString[i][2]});
							break;
						case "GCL":
							formattedData[4][2].values.push({xVar: +fileString[i][1], yVar: +fileString[i][2]});
							break;
						case "GCC":
							formattedData[5][1].values.push({xVar: +fileString[i][1],yVar: +fileString[i][2]});
							formattedData[5][2].values.push({xVar: +fileString[i][1],yVar: +fileString[i][3]});
							formattedData[5][3].values.push({xVar: +fileString[i][1],yVar: +fileString[i][4]});
							formattedData[5][4].values.push({xVar: +fileString[i][1],yVar: +fileString[i][5]});
							break;
						case "ID":
							formattedData[6][1].values.push({xVar: +fileString[i][1],yVar: +fileString[i][2]});
							formattedData[6][2].values.push({xVar: +fileString[i][1],yVar: +fileString[i][3]});
							break;
						case "COV":
							formattedData[7][1].values.push({xVar: +fileString[i][2], yVar: +fileString[i][3]});
							break;
						case "GCD":
							formattedData[8][1].values.push({xVar: +fileString[i][2],yVar: +fileString[i][3],yVar0: +fileString[i][7]});
							formattedData[8][2].values.push({xVar: +fileString[i][2],yVar: +fileString[i][4],yVar0: +fileString[i][6]});
							formattedData[8][3].values.push({xVar: +fileString[i][2],yVar: +fileString[i][5]});
							formattedData[8][4].values.push({xVar: +fileString[i][2],yVar: +fileString[i][1]});
							break;
					}


				}
				var maxGC = d3.max(formattedData[4][1].values, function (d) {return d.yVar;});
				for (i = 0; i < formattedData[4][1].values.length; i++) {
					formattedData[4][1].values[i].yVar = formattedData[4][1].values[i].yVar / maxGC;
				}
				for (i = 0; i < formattedData[4][2].values.length; i++) {
					formattedData[4][2].values[i].yVar = formattedData[4][2].values[i].yVar / maxGC;
				}
				return formattedData;
			}
			function getQualityVals(data) {
				var returnValue = [];
				for (var j = 2; j < data.length ; j++) {
					returnValue.push(+data[j]);
				}
				return returnValue;
			}