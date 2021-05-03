/*
 * Drawing with d3 library
 */
"use strict";

/* 
	------------------------------------------------
	Declared Global Scope Variables
	------------------------------------------------
*/

// Set the dimensions and margins of the graph
const margin = {top: 6, right: 17, bottom: 38, left: 58},
	width = 508 - margin.left - margin.right,
	height = 229 - margin.top - margin.bottom;

// Set the axies and ranges for LINE GRAPH
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// Set the axies and ranges for BAR GRAPG
const xBar = d3.scaleBand().range([0, width]).padding(0.2).paddingOuter(0.2);
const yBar = d3.scaleLinear().range([height, 0]);

// Set the line for LINE GRAPH
const valueline = d3.line()
	.x(function(d) { return x(d.name); })
	.y(function(d) { return y(d.value); });

// Set gridlines in x axis
function make_x_gridlines() {		
	return d3.axisBottom(x).ticks(5)
}
// Set gridlines in y axis
function make_y_gridlines() {		
	return d3.axisLeft(y).ticks(5)
}

// Append the SVG object to each box
// Sensor for left-side box
const svgSensor_L = d3.select("#graph-sensorLeft")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");

// Sensor for right-side box
const svgSensor_R = d3.select("#graph-sensorRight")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");

// History - Cooler
const svgHisCooler = d3.select("#graph-history-cooler")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");
// History - Valve
const svgHisValve = d3.select("#graph-history-valve")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");
// History - Pump
const svgHisPump = d3.select("#graph-history-pump")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");
// History - Acc
const svgHisAcc = d3.select("#graph-history-acc")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");

// Feature Weights
const svgFeat = d3.select("#graph-bar")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");



/* 
	------------------------------------------------
	Name : drawSensorL
	Desc : Draw line graphs on the left-side box
	------------------------------------------------
*/
function drawSVG(newData, xLabel, yLabel) {
	newData.forEach(function(d, i) {
		d.name = +d.name;
		d.value = +d.value;
	});

	x.domain(d3.extent(newData, function(d) { return d.name; })).nice();
	y.domain([
		d3.min(newData, function(d) { return Math.min(d.value); }), 
		d3.max(newData, function(d) { return Math.max(d.value); })]).nice();

	svgSensor_L.append("g")
		.attr("class", "grid")
		.attr("transform", "translate(0," + height + ")")
		.call(make_x_gridlines()
			.tickSize(-height)
			.tickFormat(""));
	svgSensor_L.append("g")
		.attr("class", "grid")
		.call(make_y_gridlines()
			.tickSize(-width)
			.tickFormat(""));

	let tipSensorL = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<strong>" + d.name + "</strong><br><span>" + d.value + "</span>";
		});
	svgSensor_L.call(tipSensorL);
	
	svgSensor_L.append("g")
		.attr("transform", "translate(0," + height + ")")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Q")));
	svgSensor_L.append("g")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		.call(d3.axisLeft(y));
	svgSensor_L.append("text")
		.attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 28) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "13px")
		.text(xLabel);
	svgSensor_L.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", "-53px")
		.attr("x",0 - (height / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-size", "13px")
		.text(yLabel);

	svgSensor_L.append("path")
		.data([newData])
		.attr("class", "line")
		.attr("d", valueline);
	svgSensor_L.selectAll("dot")
		.data(newData)
		.enter()
		.append("circle")
		.attr("r", 5)
		.attr("fill", "transparent")
		.attr("class", "circle-point")
		.attr("cy", function(d) { return y(d.value); })
		.attr("cx", function(d) { return x(d.name); })
		.on('mouseover', function(d) { tipSensorL.show(d); })
		.on('mouseout', tipSensorL.hide);
		
	// Draw right-side box at the same time
	svgSensor_R.append("g")			
		.attr("class", "grid")
		.attr("transform", "translate(0," + height + ")")
		.call(make_x_gridlines()
			.tickSize(-height)
			.tickFormat(""))
	svgSensor_R.append("g")			
		.attr("class", "grid")
		.call(make_y_gridlines()
			.tickSize(-width)
			.tickFormat(""))

	svgSensor_R.append("path")
		.data([newData])
		.attr("class", "lineLight")
		.attr("d", valueline);

	svgSensor_R.append("g")
		.attr("transform", "translate(0," + height + ")")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Q")));
	svgSensor_R.append("g")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		.call(d3.axisLeft(y));
	svgSensor_R.append("text")
		.attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 28) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "13px")
		.text(xLabel);
	svgSensor_R.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", "-40px")
		.attr("x",0 - (height / 2))
		.style("text-anchor", "middle")
		.style("font-size", "13px")
		.text(yLabel);

	// Add animation
	var curtain = svgSensor_L.append('rect')
		.attr('x', -1 * width -1)
		.attr('y', -1 * height)
		.attr('height', height)
		.attr('width', width+1)
		.attr('class', 'curtain')
		.attr('transform', 'rotate(180)')
		.style('fill', '#fafafa');
	let curtainR = svgSensor_R.append('rect')
		.attr('x', -1 * width)
		.attr('y', -1 * height)
		.attr('height', height)
		.attr('width', width)
		.attr('class', 'curtain')
		.attr('transform', 'rotate(180)')
		.style('fill', '#fafafa');
	let t = d3.transition()
		.duration(2000) // NOW: 2s / faster 1000 / slower 5000
		.ease(d3.easeLinear);
	d3.selectAll(".curtain").transition(t)
		.attr('width', 0);
}



/* 
	------------------------------------------------
	Name : drawSensorR
	Desc : Draw line graphs on the right-side box next to left sensor box

	Drawing only line with different colour for a selected correlation sensor
	------------------------------------------------
*/
function drawSensorR(originData, correlationData, xLabelCorrelation, yLabelCorrelation) {
	
	originData.forEach(function(d, i) {
		d.name = +d.name;
		d.value = +d.value;
	});
	correlationData.forEach(function(d, i) {
		d.name = +d.name;
		d.value = +d.value;
	});

	let y_min, y_max;
	let originData_min = d3.min(originData, function(d) { return Math.min(d.value); });
	let correlationData_min = d3.min(correlationData, function(d) { return Math.min(d.value); });
	let originData_max = d3.max(originData, function(d) { return Math.max(d.value); });
	let correlationData_max = d3.max(correlationData, function(d) { return Math.max(d.value); });

	originData_min > correlationData_min ? y_min = correlationData : y_min = originData;
	originData_max < correlationData_max ? y_max = correlationData : y_max = originData;

	let xRight = d3.scaleTime().range([0, width]);
	let yRight = d3.scaleLinear().range([height, 0]);

	xRight.domain(d3.extent(correlationData, function(d) { return d.name; })).nice();
	yRight.domain([
		d3.min(y_min, function(d) { return Math.min(d.value); }), 
		d3.max(y_max, function(d) { return Math.max(d.value); })
	]).nice();

	let valuelineRight = d3.line()
		.x(function(d) { return xRight(d.name); })
		.y(function(d) { return yRight(d.value); });
	
	svgSensor_R.append("g")
		.attr("class", "grid")
		.attr("transform", "translate(0," + height + ")")
		.call(make_x_gridlines()
			.tickSize(-height)
			.tickFormat(""));
	svgSensor_R.append("g")
		.attr("class", "grid")
		.call(make_y_gridlines()
			.tickSize(-width)
			.tickFormat(""));

	let tipSensorR = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<strong>" + d.name + "</strong><br><span>" + d.value + "</span>";
		});
	svgSensor_R.call(tipSensorR);

	svgSensor_R.append("path")
		.data([originData])
		.attr("class", "lineLight")
		.attr("d", valuelineRight);
	svgSensor_R.append("path")
		.data([correlationData])
		.attr("class", "lineContr")
		.attr("d", valuelineRight);

	svgSensor_R.selectAll("dot")
		.data(originData)
		.enter()
		.append("circle")
		.attr("r", 5)
		.attr("fill", "transparent")
		.attr("cy", function(d) { return yRight(d.value); })
		.attr("cx", function(d) { return xRight(d.name); })
		.on('mouseover', function(d) { tipSensorR.show(d); })
		.on('mouseout', tipSensorR.hide);
	svgSensor_R.selectAll("dot")
		.data(correlationData)
		.enter()
		.append("circle")
		.attr("r", 5)
		.attr("fill", "transparent")
		.attr("cy", function(d) { return yRight(d.value); })
		.attr("cx", function(d) { return xRight(d.name); })
		.on('mouseover', function(d) { tipSensorR.show(d); })
		.on('mouseout', tipSensorR.hide);

	svgSensor_R.append("g")
		.attr("transform", "translate(0," + height + ")")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		.call(d3.axisBottom(xRight).tickFormat(d3.timeFormat("%Q")));
	svgSensor_R.append("g")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		.call(d3.axisLeft(yRight));
	svgSensor_R.append("text")
		.attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 28) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "13px")
		.text(xLabelCorrelation);
	svgSensor_R.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", "-40px")
		.attr("x",0 - (height / 2))
		.style("text-anchor", "middle")
		.style("font-size", "13px")
		.text(yLabelCorrelation);

	let curtain = svgSensor_R.append('rect')
		.attr('x', -1 * width -1)
		.attr('y', -1 * height)
		.attr('height', height)
		.attr('width', width)
		.attr('class', 'curtain')
		.attr('transform', 'rotate(180)')
		.style('fill', '#fafafa');
	let t = d3.transition()
		.duration(2000)
		.ease(d3.easeLinear);
	d3.selectAll(".curtain").transition(t)
		.attr('width', 0);
}


function drawSensorRTwoAxes(originData, correlationData, xLabelCorrelation, yLabelCorrelation){
	originData.forEach(function(d, i) {
		d.name = +d.name;
		d.value = +d.value;
	});
	correlationData.forEach(function(d, i) {
		d.name = +d.name;
		d.value = +d.value;
	});
	x.domain(d3.extent(originData, function(d) { return d.name; })).nice();
	y.domain([
		d3.min(originData, function(d) { return Math.min(d.value); }), 
		d3.max(originData, function(d) { return Math.max(d.value); })]).nice();

	let xCorrelation = d3.scaleTime().range([0, width]);
	let yCorrelation = d3.scaleLinear().range([height, 0]);
	xCorrelation.domain(d3.extent(correlationData, function(d) { return d.name; })).nice();
	yCorrelation.domain([
		d3.min(correlationData, function(d) { return Math.min(d.value); }), 
		d3.max(correlationData, function(d) { return Math.max(d.value); })]).nice();
	
	let valuelineCorrelation = d3.line()
		.x(function(d) { return xCorrelation(d.name); })
		.y(function(d) { return yCorrelation(d.value); });

	svgSensor_R.append("g")
		.attr("class", "grid")
		.attr("transform", "translate(0," + height + ")")
		.call(make_x_gridlines()
			.tickSize(-height)
			.tickFormat(""));
	svgSensor_R.append("g")
		.attr("class", "grid")
		.call(make_y_gridlines()
			.tickSize(-width)
			.tickFormat(""));

	let tipSensorR = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<strong>" + d.name + "</strong><br><span>" + d.value + "</span>";
		});
	svgSensor_R.call(tipSensorR);
	
	svgSensor_R.append("path")
		.data([originData])
		.attr("class", "lineLight")
		.attr("d", valueline);
	svgSensor_R.append("path")
		.data([correlationData])
		.attr("class", "lineContr") // control line colour with class here, if you want to change colour, go to CSS file
		.attr("d", valuelineCorrelation);

	svgSensor_R.selectAll("dot")
		.data(originData)
		.enter()
		.append("circle")
		.attr("r", 5)
		.attr("fill", "transparent")
		.attr("cy", function(d) { return y(d.value); })
		.attr("cx", function(d) { return x(d.name); })
		.on('mouseover', function(d) { tipSensorR.show(d); })
		.on('mouseout', tipSensorR.hide);
	svgSensor_R.selectAll("dot")
		.data(correlationData)
		.enter()
		.append("circle")
		.attr("r", 5)
		.attr("fill", "transparent")
		.attr("cy", function(d) { return yCorrelation(d.value); })
		.attr("cx", function(d) { return xCorrelation(d.name); })
		.on('mouseover', function(d) { tipSensorR.show(d); })
		.on('mouseout', tipSensorR.hide);

	svgSensor_R.append("g")
		.attr("transform", "translate(0," + height + ")")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Q")));
	svgSensor_R.append("g")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		.call(d3.axisLeft(y));
	svgSensor_R.append("text")
		.attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 28) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "13px")
		.text(xLabelCorrelation);
	svgSensor_R.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", "-40px")
		.attr("x",0 - (height / 2))
		.style("text-anchor", "middle")
		.style("font-size", "13px")
		.text(yLabelCorrelation);

	let curtain = svgSensor_R.append('rect')
		.attr('x', -1 * width -1)
		.attr('y', -1 * height)
		.attr('height', height)
		.attr('width', width)
		.attr('class', 'curtain')
		.attr('transform', 'rotate(180)')
		.style('fill', '#fafafa');
	let t = d3.transition()
		.duration(2000)
		.ease(d3.easeLinear);
	d3.selectAll(".curtain").transition(t)
		.attr('width', 0);

	svgSensor_R.append("g")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		// .style("stroke", "#ff6384")
		.attr("class", "yCorrelation")
		.attr("transform", "translate(449, 0)")
		.call(d3.axisLeft(yCorrelation));
}





// History graph tooltip
let tipHistory = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
		let months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
		let date = d.name;
		let formatted_date = months[date.getMonth()] + "-" + date.getDate() + "-" + date.getFullYear();
		return "<strong>" + formatted_date + "</strong><br><span>"+ d.value +"</span>";
	});

/* 
	------------------------------------------------
	Name : drawHistoryCooler
	Desc : History - Cooler
	------------------------------------------------
*/
function drawHistoryCooler(newData) {
	var parseTime = d3.timeParse("%m-%d-%Y");
	newData.forEach(function(d, i) {
		d.name = parseTime(d.name);
		d.value = +d.value;
	});
	x.domain(d3.extent(newData, function(d) { return d.name; })).nice();
	y.domain([0, d3.max(newData, function(d) {
		return Math.max(d.value); })]).nice();

	svgHisCooler.call(tipHistory);
  
	svgHisCooler.append("g")			
		.attr("class", "grid")
		.attr("transform", "translate(0," + height + ")")
		.call(make_x_gridlines()
			.tickSize(-height)
			.tickFormat(""));
	svgHisCooler.append("g")			
		.attr("class", "grid")
		.call(make_y_gridlines()
			.tickSize(-width)
			.tickFormat(""));
	// Add alert light lines
	svgHisCooler.append("line")
		.style("stroke", "#42c77b")
		.attr("x1", 0).attr("y1", 0)
		.attr("x2", width).attr("y2", 0);
	svgHisCooler.append("line")
		.style("stroke", "#fbdd38")
		.attr("x1", 0).attr("y1", 148)
		.attr("x2", width).attr("y2", 148);
	svgHisCooler.append("line")
		.style("stroke", "#fb4f38")
		.attr("x1", 0).attr("y1", 180)
		.attr("x2", width).attr("y2", 180);
	// Add alert light texts
	svgHisCooler.append("text")
		.attr("transform", "translate(8 , 14)")
		.style("font-size", "12px")
		.style("fill", "#42c77b")
		.text("Full efficiency");
	svgHisCooler.append("text")
		.attr("transform", "translate(8 , 144)")
		.style("font-size", "12px")
		.style("fill", "#fbdd38")
		.text("Reduced efficiency");
	svgHisCooler.append("text")
		.attr("transform", "translate(8 , 176)")
		.style("font-size", "12px")
		.style("fill", "#fb4f38")
		.text("Close to total failure");
	// Add the valueline path.
	svgHisCooler.append("path")
		.data([newData])
		.attr("class", "line-history")
		.attr("d", valueline);
	// Add point to each data
	svgHisCooler.selectAll("dot")
		.data(newData)
		.enter()
		.append("circle")
		.attr("class", "line-circle")
		.attr("r", 4)
		.attr("cy", function(d) { return y(d.value); })
		.attr("cx", function(d) { return x(d.name); })
		.on('mouseover', tipHistory.show)
		.on('mouseout', tipHistory.hide);

	// Add the X Axis
	svgHisCooler.append("g")
		.attr("transform", "translate(0," + height + ")")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%d")));
	// text label for the x axis
	svgHisCooler.append("text")
		.attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 28) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "13px")
		.text("Time");
	// Add the Y Axis
	svgHisCooler.append("g")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		.call(d3.axisLeft(y).ticks(6));
	// text label for the y axis
	svgHisCooler.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", "-46px")
		.attr("x",0 - (height / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-size", "13px")
		.text("Condition");
}

/* 
	------------------------------------------------
	Name : drawHistoryValve
	Desc : History - Valve
	------------------------------------------------
*/
function drawHistoryValve(newData) {
	var parseTime = d3.timeParse("%m-%d-%Y");
	newData.forEach(function(d, i) {
		d.name = parseTime(d.name);
		d.value = +d.value;
	});
	x.domain(d3.extent(newData, function(d) { return d.name; })).nice();
	y.domain([70, d3.max(newData, function(d) {
		return Math.max(d.value); })]).nice();
	svgHisValve.call(tipHistory);
	svgHisValve.append("g")			
		.attr("class", "grid")
		.attr("transform", "translate(0," + height + ")")
		.call(make_x_gridlines()
			.tickSize(-height)
			.tickFormat(""))
	svgHisValve.append("g")			
		.attr("class", "grid")
		.call(make_y_gridlines()
			.tickSize(-width)
			.tickFormat(""))
	svgHisValve.append("line")
		.style("stroke", "#42c77b")
		.attr("x1", 0).attr("y1", 0)
		.attr("x2", width).attr("y2", 0);
	svgHisValve.append("line")
		.style("stroke", "#fbdd38")
		.attr("x1", 0).attr("y1", 62)
		.attr("x2", width).attr("y2", 62);
	svgHisValve.append("line")
		.style("stroke", "#fb8638")
		.attr("x1", 0).attr("y1", 123)
		.attr("x2", width).attr("y2", 123);
	svgHisValve.append("line")
		.style("stroke", "#fb4f38")
		.attr("x1", 0).attr("y1", 167)
		.attr("x2", width).attr("y2", 167);
	svgHisValve.append("text")
		.attr("transform", "translate(8 , 14)")
		.style("font-size", "12px")
		.style("fill", "#42c77b")
		.text("Optimal switching");
	svgHisValve.append("text")
		.attr("transform", "translate(8 , 58)")
		.style("font-size", "12px")
		.style("fill", "#fbdd38")
		.text("Small lag");
	svgHisValve.append("text")
		.attr("transform", "translate(8 , 119)")
		.style("font-size", "12px")
		.style("fill", "#fb8638")
		.text("Severe lag");
	svgHisValve.append("text")
		.attr("transform", "translate(8 , 163)")
		.style("font-size", "12px")
		.style("fill", "#fb4f38")
		.text("Close to total failure");
	svgHisValve.append("path")
		.data([newData])
		.attr("class", "line-history")
		.attr("d", valueline);
	svgHisValve.selectAll("dot")
		.data(newData)
		.enter()
		.append("circle")
		.attr("class", "line-circle")
		.attr("r", 4)
		.attr("cy", function(d) { return y(d.value); })
		.attr("cx", function(d) { return x(d.name); })
		.on('mouseover', tipHistory.show)
		.on('mouseout', tipHistory.hide);
	svgHisValve.append("g")
		.attr("transform", "translate(0," + height + ")")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%d")));
	svgHisValve.append("text")
		.attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 28) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "13px")
		.text("Time");
	svgHisValve.append("g")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		.call(d3.axisLeft(y).ticks(6));
	svgHisValve.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", "-46px")
		.attr("x",0 - (height / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-size", "13px")
		.text("Condition");
}

/* 
	------------------------------------------------
	Name : drawHistoryPump
	Desc : History - Pump
	------------------------------------------------
*/
function drawHistoryPump(newData) {
	var parseTime = d3.timeParse("%m-%d-%Y");
	newData.forEach(function(d, i) {
		d.name = parseTime(d.name);
		d.value = +d.value;
	});
	x.domain(d3.extent(newData, function(d) { return d.name; })).nice();
	y.domain([2.1, 0]).nice(); // Pump has opposite way to arrange number
	// y.domain([d3.max(newData, function(d) {
	// 	return Math.max(d.value); }), 0]).nice();
	svgHisPump.call(tipHistory);
	svgHisPump.append("g")			
		.attr("class", "grid")
		.attr("transform", "translate(0," + height + ")")
		.call(make_x_gridlines()
			.tickSize(-height)
			.tickFormat(""))
	svgHisPump.append("g")			
		.attr("class", "grid")
		.call(make_y_gridlines()
			.tickSize(-width)
			.tickFormat(""))
	// Add alert light lines
	svgHisPump.append("line")
		.style("stroke", "#42c77b")
		.attr("x1", 0).attr("y1", 0)
		.attr("x2", width).attr("y2", 0);
	svgHisPump.append("line")
		.style("stroke", "#fbdd38")
		.attr("x1", 0).attr("y1", 84)
		.attr("x2", width).attr("y2", 84);
	svgHisPump.append("line")
		.style("stroke", "#fb4f38")
		.attr("x1", 0).attr("y1", 168)
		.attr("x2", width).attr("y2", 168);
	svgHisPump.append("text")
		.attr("transform", "translate(8 , 14)")
		.style("font-size", "12px")
		.style("fill", "#42c77b")
		.text("No leakage");
	svgHisPump.append("text")
		.attr("transform", "translate(8 , 79)")
		.style("font-size", "12px")
		.style("fill", "#fbdd38")
		.text("Weak leakage");
	svgHisPump.append("text")
		.attr("transform", "translate(8 , 164)")
		.style("font-size", "12px")
		.style("fill", "#fb4f38")
		.text("Severe leakage");
	svgHisPump.append("path")
		.data([newData])
		.attr("class", "line-history")
		.attr("d", valueline);
	svgHisPump.selectAll("dot")
		.data(newData)
		.enter()
		.append("circle")
		.attr("class", "line-circle")
		.attr("r", 4)
		.attr("cy", function(d) { return y(d.value); })
		.attr("cx", function(d) { return x(d.name); })
		.on('mouseover', tipHistory.show)
		.on('mouseout', tipHistory.hide);
	svgHisPump.append("g")
		.attr("transform", "translate(0," + height + ")")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%d")));
	svgHisPump.append("text")
		.attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 28) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "13px")
		.text("Time");
	svgHisPump.append("g")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		.call(d3.axisLeft(y).ticks(6));
	svgHisPump.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", "-46px")
		.attr("x",0 - (height / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-size", "13px")
		.text("Condition");
}

/* 
	------------------------------------------------
	Name : drawHistoryAcc
	Desc : History - Acc
	------------------------------------------------
*/
function drawHistoryAcc(newData) {
	var parseTime = d3.timeParse("%m-%d-%Y");
	newData.forEach(function(d, i) {
		d.name = parseTime(d.name);
		d.value = +d.value;
	});
	x.domain(d3.extent(newData, function(d) { return d.name; })).nice();
	y.domain([85, d3.max(newData, function(d) {
		return Math.max(d.value); })]).nice();
	svgHisAcc.call(tipHistory);
	svgHisAcc.append("g")			
		.attr("class", "grid")
		.attr("transform", "translate(0," + height + ")")
		.call(make_x_gridlines()
			.tickSize(-height)
			.tickFormat(""))
	svgHisAcc.append("g")			
		.attr("class", "grid")
		.call(make_y_gridlines()
			.tickSize(-width)
			.tickFormat(""))
	// Add alert light lines
	svgHisAcc.append("line")
		.style("stroke", "#42c77b")
		.attr("x1", 0).attr("y1", 0)
		.attr("x2", width).attr("y2", 0);
	svgHisAcc.append("line")
		.style("stroke", "#fbdd38")
		.attr("x1", 0).attr("y1", 62)
		.attr("x2", width).attr("y2", 62);
	svgHisAcc.append("line")
		.style("stroke", "#fb8638")
		.attr("x1", 0).attr("y1", 124)
		.attr("x2", width).attr("y2", 124);
	svgHisAcc.append("line")
		.style("stroke", "#fb4f38")
		.attr("x1", 0).attr("y1", 165)
		.attr("x2", width).attr("y2", 165);
	svgHisAcc.append("text")
		.attr("transform", "translate(8 , 14)")
		.style("font-size", "12px")
		.style("fill", "#42c77b")
		.text("Optimal pressure");
	svgHisAcc.append("text")
		.attr("transform", "translate(8 , 58)")
		.style("font-size", "12px")
		.style("fill", "#fbdd38")
		.text("Slightly low pressure");
	svgHisAcc.append("text")
		.attr("transform", "translate(8 , 120)")
		.style("font-size", "12px")
		.style("fill", "#fb8638")
		.text("Severe low pressure");
	svgHisAcc.append("text")
		.attr("transform", "translate(8 , 161)")
		.style("font-size", "12px")
		.style("fill", "#fb4f38")
		.text("Close to total failure");
	svgHisAcc.append("path")
		.data([newData])
		.attr("class", "line-history")
		.attr("d", valueline);
	svgHisAcc.selectAll("dot")
		.data(newData)
		.enter()
		.append("circle")
		.attr("class", "line-circle")
		.attr("r", 4)
		.attr("cy", function(d) { return y(d.value); })
		.attr("cx", function(d) { return x(d.name); })
		.on('mouseover', tipHistory.show)
		.on('mouseout', tipHistory.hide);
	svgHisAcc.append("g")
		.attr("transform", "translate(0," + height + ")")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%d")));
	svgHisAcc.append("text")
		.attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 28) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "13px")
		.text("Time");
	svgHisAcc.append("g")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		.call(d3.axisLeft(y).ticks(6));
	svgHisAcc.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", "-46px")
		.attr("x",0 - (height / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-size", "13px")
		.text("Condition");
}



// Feature Weights - All Bar Gragh
function drawBar(newData) {
	newData.forEach(function(d, i) {
		d.name = d.name;
		d.value = +d.value;
	});
	xBar.domain(newData.map(function(d) { return d.name; }));
	yBar.domain([0, d3.max(newData, function(d) { return d.value; })]);

	const tipBar = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			let decimal = d.value.toFixed(2);
			return "<strong>" + d.name + "</strong> <span>" + decimal + "</span>";
		});
  svgFeat.call(tipBar);

  svgFeat.append("g")
		.attr("class", "grid")
		.attr("transform", "translate(0," + height + ")")
		.call(make_x_gridlines()
			.tickSize(-height)
			.tickFormat(""));
	svgFeat.append("g")
		.attr("class", "grid")
		.call(make_y_gridlines()
			.tickSize(-width)
			.tickFormat(""));
	// Draw bar
	svgFeat.selectAll(".bar")
		.data(newData)
		.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("fill", "#36a2eb")
		.attr("y", function(d) { return yBar(d.value); })
		.attr("height", function(d) { return height - yBar(d.value)})
		.attr("width", xBar.bandwidth())
		.attr("x", function(d) { return xBar(d.name); })
		.on('mouseover', tipBar.show)
		.on('mouseout', tipBar.hide);
	// Add the X Axis
	svgFeat.append("g")
		.attr("transform", "translate(0," + height + ")")
		.style("font-family", "Arial")
		.style("font-size", "7.5px")
		.call(d3.axisBottom(xBar))
		.selectAll("text")	
		.style("text-anchor", "end")
		.attr("dx", "-1em")
		.attr("dy", "-.95em")
		.attr("transform", "rotate(-90)");
	// text label for the x axis
	// svgFeat.append("text")
	// 	.attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 26) + ")")
	// 	.attr("text-anchor", "middle")
	// 	.style("font-size", "12px")
	// 	.text("Variables");
	// Add the Y Axis
	svgFeat.append("g")
		.style("font-family", "Raleway")
		.style("font-size", "11px")
		.call(d3.axisLeft(yBar).tickFormat(d3.format(".2f")).ticks(6));
	// text label for the y axis
	svgFeat.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", "-48px")
		.attr("x",0 - (height / 2))
		.attr("dy", "1em")
		.attr("text-anchor", "middle")
		.style("font-size", "12px")
		.text("Relative Importance");
}
























/* 
	------------------------------------------------
	Declared Global Scope Variables ( Button, data, drawing box, and empty box)
	------------------------------------------------
*/
const btnPS1 = $("#ps1"),
	btnPS2 = $("#ps2"),
	btnPS3 = $("#ps3"),
	btnPS4 = $("#ps4"),
	btnPS5 = $("#ps5"),
	btnPS6 = $("#ps6"),
	btnTS1 = $("#ts1"),
	btnTS2 = $("#ts2"),
	btnTS3 = $("#ts3"),
	btnTS4 = $("#ts4"),
	btnEPS1 = $("#EPS1"),
	btnFS1 = $("#circle1"),
	btnFS2 = $("#circle2"),
	btnVS1 = $("#VS1"),
	btnSE = $("#se"),
	btnCE = $("#ce"),
	btnCP = $("#cp"),
	dataPS1 = "/static/hs_database/ps1.csv",
	dataPS2 = "/static/hs_database/ps2.csv",
	dataPS3 = "/static/hs_database/ps3.csv",
	dataPS4 = "/static/hs_database/ps4.csv",
	dataPS5 = "/static/hs_database/ps5.csv",
	dataPS6 = "/static/hs_database/ps6.csv",
	dataTS1 = "/static/hs_database/ts1.csv",
	dataTS2 = "/static/hs_database/ts2.csv",
	dataTS3 = "/static/hs_database/ts3.csv",
	dataTS4 = "/static/hs_database/ts4.csv",
	dataEPS1 = "/static/hs_database/eps1.csv",
	dataFS1 = "/static/hs_database/fs1.csv",
	dataFS2 = "/static/hs_database/fs2.csv",
	dataVS1 = "/static/hs_database/vs1.csv",
	dataSE = "/static/hs_database/se.csv",
	dataCE = "/static/hs_database/ce.csv",
	dataCP = "/static/hs_database/cp.csv",
	titTextSensorL = $("#tit_sensorL"),
	titTextSensorR = $("#tit_sensorR"),
	drawBoxSensorL = $("#graph-sensorLeft"),
	drawBoxSensorR = $("#graph-sensorRight"),
	emptyBoxSensorL = $("#graph_sensor_1 .empty_data"),
	emptyBoxSensorR = $("#graph_sensor_2 .empty_data"),
	lockBoxSensor = $("#graph_sensor_1 .lock_data"),
	selCorrelation = $("#sensor_co_list"),
	btnCorrelation = $("#btn_sensor_co");

var initialRow = [];



/* 
	------------------------------------------------
	Name: detectDraw
	Desc: update new sensor
	------------------------------------------------
*/
function detectDraw() {
	let graphSvgL = drawBoxSensorL.children(),
		graphSvgR = drawBoxSensorR.children();
		graphSvgL.empty();
		graphSvgR.empty();
	if ( lockBoxSensor.hasClass('off') !== true ) {
		titTextSensorL.hide();
		titTextSensorR.hide();
		return;
	} else {
		drawBoxSensorL.removeClass('off');
		drawBoxSensorR.removeClass('off');
		emptyBoxSensorL.addClass("off");
		emptyBoxSensorR.addClass("off");
	}
}



/* 
	------------------------------------------------
	Name: detectSensorL
	Desc: Draw correlation sensor list
	------------------------------------------------
*/
function detectSensorL() {
	selCorrelation.empty();
	if ( titTextSensorR.text().startsWith("PS") == true || titTextSensorR.text().startsWith("EPS") == true ) {
		selCorrelation.append('<option value="none" selected="selected">Select</option>');
		selCorrelation.append('<option value="PS1">PS1</option>');
		selCorrelation.append('<option value="PS2">PS2</option>');
		selCorrelation.append('<option value="PS3">PS3</option>');
		selCorrelation.append('<option value="PS4">PS4</option>');
		selCorrelation.append('<option value="PS5">PS5</option>');
		selCorrelation.append('<option value="PS6">PS6</option>');
		selCorrelation.append('<option value="EPS1">EPS1</option>');
	} else if ( titTextSensorR.text().startsWith("FS") == true ) {
		selCorrelation.append('<option value="none" selected="selected">Select</option>');
		selCorrelation.append('<option value="FS1">FS1</option>');
		selCorrelation.append('<option value="FS2">FS2</option>');
	} else if ( titTextSensorR.text().startsWith("TS") == true || 
			titTextSensorR.text().startsWith("CE") == true || 
			titTextSensorR.text().startsWith("CP") == true || 
			titTextSensorR.text().startsWith("SE") == true ) {
		selCorrelation.append('<option value="none" selected="selected">Select</option>');
		selCorrelation.append('<option value="TS1">TS1</option>');
		selCorrelation.append('<option value="TS2">TS2</option>');
		selCorrelation.append('<option value="TS3">TS3</option>');
		selCorrelation.append('<option value="TS4">TS4</option>');
		selCorrelation.append('<option value="CP">CP</option>');
		selCorrelation.append('<option value="CE">CE</option>');
		selCorrelation.append('<option value="SE">SE</option>');
	} else {
		selCorrelation.append('<option value="none" selected="selected">None</option>');
	}
}



/* 
	------------------------------------------------
	Desc: Draw right-side correlation sensor
	------------------------------------------------
*/
btnCorrelation.click(function() {
	// if it has any node, remove all before drawing new correlation sensor
	let g = drawBoxSensorR.children();
	let gArr = g[0].childNodes;
	if (gArr.length !== 0) {
		let n = gArr[0];
		while ( n ) {
			n.remove();
			n = gArr[0];
		}
	}
	// to show loader till drawing
	let loader = $("#graph-sensorRight-loader");
	loader.addClass("move");
	
	let tit = selCorrelation.val().toLowerCase(); // detect which sensor is selected in the select box
	let originTit = titTextSensorR.text().toLowerCase(); // detect which sensor is loaded on left box
	let arrData = [
		dataPS1, dataPS2, dataPS3, dataPS4, dataPS5, dataPS6, dataEPS1,
		dataTS1, dataTS2, dataTS3, dataTS4, dataCE, dataCP, dataSE,
		dataFS1, dataFS2
	];
	if ( tit == "none" ) { return; } // when any sensor is not selected

	// find which sensor's data should be loaded
	for ( let i = 0; i < arrData.length; i++ ) {
		let d = arrData[i];
		let correlationFileName = "/" + tit + ".csv";
		if ( d.indexOf(correlationFileName) > -1 ) { // 0 true, -1 false
			d3.csv(d, function(error, data) {
				if (error) throw error;
				var correlationData = []; // Get each row
				for (var key in data[initialRow]){
					if (key != "name"){
						correlationData.push({
							name: key.toString(),
							value: +data[initialRow][key]
						})
					}
				};
				for ( let j = 0; j < arrData.length; j++ ) {
					let originD = arrData[j];
					let originFileName = "/" + originTit + ".csv";
					if ( originD.indexOf(originFileName) > -1 ) {
						d3.csv(originD, function(error, data) {
							if (error) throw error;
							var originData = []; // Get each row
							for (var key in data[initialRow]){
								if (key != "name"){
									originData.push({
										name: key.toString(),
										value: +data[initialRow][key]
									})
								}
							};

							let xLabelCorrelation, yLabelCorrelation;
							if (correlationFileName.startsWith("ps") == true) {
								xLabelCorrelation = "Time (sec)";
								yLabelCorrelation = "Pressure (bar)";
							} else if (correlationFileName.startsWith("ts") == true) {
								xLabelCorrelation = "Time (sec)";
								yLabelCorrelation = "Temperature (C)";
							} else if (correlationFileName.startsWith("eps") == true) {
								xLabelCorrelation = "Time (msec)";
								yLabelCorrelation = "Moter Power (W)";
							} else if (correlationFileName.startsWith("fs") == true) {
								xLabelCorrelation = "Time (dsec)";
								yLabelCorrelation = "Volume Flow (l/min)";
							} else if (correlationFileName.startsWith("vs") == true) {
								xLabelCorrelation = "Time (sec)";
								yLabelCorrelation = "Vibration (mm/s)";
							} else if (correlationFileName.startsWith("se") == true) {
								xLabelCorrelation = "Time (sec)";
								yLabelCorrelation = "Efficiency Factor (%)";
							} else if (correlationFileName.startsWith("ce") == true) {
								xLabelCorrelation = "Time (sec)";
								yLabelCorrelation = "Cooling Effieiency (%)";
							} else if (correlationFileName.startsWith("cp") == true) {
								xLabelCorrelation = "Time (sec)";
								yLabelCorrelation = "Cooling Power (kW)";
							}
							loader.removeClass("move");
							let correlationSwitch = document.getElementById("correlation-switch");
							if(correlationSwitch.checked == true) {
								drawSensorRTwoAxes(originData, correlationData, xLabelCorrelation, yLabelCorrelation);
							} else {
								drawSensorR(originData, correlationData, xLabelCorrelation, yLabelCorrelation);
							}
						});
					}
				}
			});
		}
	}
});



/* 
	------------------------------------------------
	Name: loadDataDrawGraph
	Desc: Draw left-side sensor
	------------------------------------------------
*/
function loadDataDrawGraph(btn, d, t, xLabel, yLabel) {
	btn.click(function() {
		detectDraw();
		let loaderLeft = $("#graph-sensorLeft-loader");
		let loaderRight = $("#graph-sensorRight-loader");
		loaderLeft.addClass("move");
		loaderRight.addClass("move");
		d3.csv(d, function(error, data) {
			if (error) throw error;
			let newData = []; // Get each row
			for (let key in data[initialRow]){
				if (key != "name"){
					newData.push({
						name: key.toString(),
						value: +data[initialRow][key]
					})
				}
			};
			loaderLeft.removeClass("move");
			loaderRight.removeClass("move");
			drawSVG(newData, xLabel, yLabel)
			titTextSensorL.text(t);
			titTextSensorR.text(t);
			detectSensorL();
		});
	});
}
loadDataDrawGraph(btnPS1, dataPS1, "PS1", "Time (sec)", "Pressure (bar)");
loadDataDrawGraph(btnPS2, dataPS2, "PS2", "Time (sec)", "Pressure (bar)");
loadDataDrawGraph(btnPS3, dataPS3, "PS3", "Time (sec)", "Pressure (bar)");
loadDataDrawGraph(btnPS4, dataPS4, "PS4", "Time (sec)", "Pressure (bar)");
loadDataDrawGraph(btnPS5, dataPS5, "PS5", "Time (sec)", "Pressure (bar)");
loadDataDrawGraph(btnPS6, dataPS6, "PS6", "Time (sec)", "Pressure (bar)");
loadDataDrawGraph(btnTS1, dataTS1, "TS1", "Time (sec)", "Temperature (C)");
loadDataDrawGraph(btnTS2, dataTS2, "TS2", "Time (sec)", "Temperature (C)");
loadDataDrawGraph(btnTS3, dataTS3, "TS3", "Time (sec)", "Temperature (C)");
loadDataDrawGraph(btnTS4, dataTS4, "TS4", "Time (sec)", "Temperature (C)");
loadDataDrawGraph(btnEPS1, dataEPS1, "EPS1", "Time (msec)", "Moter Power (W)");
loadDataDrawGraph(btnFS1, dataFS1, "FS1", "Time (dsec)", "Volume Flow (l/min)");
loadDataDrawGraph(btnFS2, dataFS2, "FS2", "Time (dsec)", "Volume Flow (l/min)");
loadDataDrawGraph(btnVS1, dataVS1, "VS1", "Time (sec)", "Vibration (mm/s)");
loadDataDrawGraph(btnSE, dataSE, "SE", "Time (sec)", "Efficiency Factor (%)");
loadDataDrawGraph(btnCE, dataCE, "CE", "Time (sec)", "Cooling Effieiency (%)");
loadDataDrawGraph(btnCP, dataCP, "CP", "Time (sec)", "Cooling Power (kW)");








/* 
	------------------------------------------------
	Name : manageDataCycle
	+
	Name : detectDataLength
	Desc : Detect how many cycle data have and push in HTML on top-m
	Desc : Change data row from csv
	------------------------------------------------
*/
(function manageDataCycle() {
	let allDataCount, 
			onlyDataCount,
			printDataLength = $("#data_length"),
			btnRowChange = $("#btn_m_changeStatus"),
			numRowChange = $("#changeText"),
			shownRowBox = $("#currentText");
	initialRow = [0];
	shownRowBox.text("1"); // initial set
	function detectDataLength(csv){
		$.get(csv, function(data) {
			allDataCount = data.split('\n').length; // this includes first row for secquence and last row for space
			onlyDataCount = allDataCount-=2;
			printDataLength.text(" ( 1 ~ "+ onlyDataCount +" )");
		})
	}
	detectDataLength(dataSE);
	btnRowChange.click(function() {
		detectDataLength(dataSE);
		let newRow = numRowChange.val();
		if ( newRow < 1 || newRow > onlyDataCount ) {
			alert("Cycle is between 1 and " + onlyDataCount );
			return;
		} else if ( isNaN(newRow) == true ) {
			alert("Cycle has to be the number" );
			numRowChange.val("");
			return;
		}
		shownRowBox.text(newRow--); // minus 1 here because data starts 0
		return initialRow = newRow--;
	});
})();



/* 
	------------------------------------------------
	Desc: Call Data - History
	------------------------------------------------
*/
// Get the data - History - Cooler
d3.csv("/static/hs_database/history_cooler.csv", function(error, data) {
	if (error) throw error;
	var newData = []; // Get each row
	for (var key in data[0]){
		if (key != "name"){
			newData.push({
				name: key,
				value: +data[0][key]
			})
		}
	};
	drawHistoryCooler(newData);
});
// Get the data - History - Valve
d3.csv("/static/hs_database/history_valve.csv", function(error, data) {
	if (error) throw error;
	var newData = []; // Get each row
	for (var key in data[0]){
		if (key != "name"){
			newData.push({
				name: key,
				value: +data[0][key]
			})
		}
	};
	drawHistoryValve(newData);
});
// Get the data - History - Pump
d3.csv("/static/hs_database/history_pump.csv", function(error, data) {
	if (error) throw error;
	var newData = []; // Get each row
	for (var key in data[0]){
		if (key != "name"){
			newData.push({
				name: key,
				value: +data[0][key]
			})
		}
	};
	drawHistoryPump(newData);
});
// Get the data - History - Acc
d3.csv("/static/hs_database/history_acc.csv", function(error, data) {
	if (error) throw error;
	var newData = []; // Get each row
	for (var key in data[0]){
		if (key != "name"){
			newData.push({
				name: key,
				value: +data[0][key]
			})
		}
	};
	drawHistoryAcc(newData);
});

/* 
	Name : loadHistoryGraphs
	Desc : Load history graph
	------------------------------------------------
*/
(function loadHistoryGraphs() {
	let iconCooler = $("#btn_history_cooler"),
		iconValve = $("#btn_history_valve"),
		iconPump = $("#btn_history_pump"),
		iconAcc = $("#btn_history_acc"),
		svgCooler = $("#graph-history-cooler"),
		svgValve = $("#graph-history-valve"),
		svgPump = $("#graph-history-pump"),
		svgAcc = $("#graph-history-acc"),
		tblCooler = $("#table-history-cooler"),
		tblValve = $("#table-history-valve"),
		tblPump = $("#table-history-pump"),
		tblAcc = $("#table-history-acc"),
		svgs = $("#graph_history .draw .chart"),
		tbls = $("#graph_history .draw .history-chart"),
		titTextHist = $("#graph_history_tit");


	function changeHistory(icon, svg, tbl, t) {
		(function() {
			if ( svgCooler.hasClass('off') == false ){
				titTextHist.text("Cooler");
			} else if ( svgValve.hasClass('off') == false ){
				titTextHist.text("Valve");
			} else if ( svgPump.hasClass('off') == false ){
				titTextHist.text("Pump");
			} else if ( svgAcc.hasClass('off') == false ){
				titTextHist.text("Acc");
			}
		})();
		icon.click(function() {
			let drawBox = $("#graph_history .draw"),
				emptyBox = $("#graph_history .empty_data"),
				lockBox = $("#graph_history .lock_data");

			if ( lockBox.hasClass('off') == false ){
				titTextHist.hide();
				return;
			}

			let checkSwith = document.getElementById("histFeat-switch");
			if (checkSwith.checked != true) {
				tbls.addClass('off');
				svgs.not($(this)).addClass('off');
				svg.removeClass('off');
			} else {
				svgs.addClass('off');
				tbls.not($(this)).addClass('off');
				tbl.removeClass('off');
			}
			emptyBox.addClass('off');
			drawBox.show();
			titTextHist.text(t);
		});
	};
	changeHistory(iconCooler, svgCooler, tblCooler, "Cooler");
	changeHistory(iconValve, svgValve, tblValve, "Valve");
	changeHistory(iconPump, svgPump, tblPump, "Pump");
	changeHistory(iconAcc, svgAcc, tblAcc, "Accumulator");
})();



/* 
	------------------------------------------------
	Desc: Call Data - Feature weights
	------------------------------------------------
*/


(function _feature() {
	function _drawFeat(btn, rf_d, lr_d, tbl, t) {
		btn.click(function() {
			let currentModel = $("#model-list").val();
			let d;
			let checkSwith = document.getElementById("histFeat-switch");
			let svgs = $("#graph_bar .draw .chart"),
					tbls = $("#graph_bar .draw .feature-chart");

			if ( lockBox.hasClass('off') == false ) {
				titTextFeat.hide();
				return;
			}
			if ( drawBox.children() !== false ) {
				drawBox.children().empty();
			} 
			if (currentModel == "rf") {
				d = rf_d;
			} else if (currentModel == "lr") {
				d = lr_d;
			}
			
			d3.csv(d, function(error, data) {
				if (error) throw error;
				var newData = []; // Get each row
				for (var key in data[0]){
					if (key != "name"){
						newData.push({
							name: key.toString(),
							value: +data[0][key]
						})
					}
				};
				emptyBox.addClass('off');
				drawBox.removeClass('off');
				titTextFeat.text(t);
				if (checkSwith.checked != true) {
					console.log("should be bar graph");
					drawBar(newData);
					tbls.addClass('off');
				} else {
					console.log("should be table");
					tbls.not($(this)).addClass('off');
					tbl.removeClass('off');
					svgs.addClass('off');
				}
			});
		});
	}

	let btnCooler = $("#btn_feat_cooler"),
		btnValve = $("#btn_feat_valve"),
		btnPump = $("#btn_feat_pump"),
		btnAcc = $("#btn_feat_acc"),
		rf_dataCooler = "/static/hs_database/feature_cooler.csv",
		rf_dataValve = "/static/hs_database/feature_valve.csv",
		rf_dataPump = "/static/hs_database/feature_pump.csv",
		rf_dataAcc = "/static/hs_database/feature_acc.csv",
		lr_dataCooler = "/static/hs_database/lr_feature_cooler.csv",
		lr_dataValve = "/static/hs_database/lr_feature_valve.csv",
		lr_dataPump = "/static/hs_database/lr_feature_pump.csv",
		lr_dataAcc = "/static/hs_database/lr_feature_acc.csv",
		titTextFeat = $("#graph_feature_tit"),
		drawBox = $("#graph-bar"),
		emptyBox = $("#graph_bar .empty_data"),
		lockBox = $("#graph_bar .lock_data"),
		tblCooler = $("#table-feature-cooler"),
		tblValve = $("#table-feature-valve"),
		tblPump = $("#table-feature-pump"),
		tblAcc = $("#table-feature-acc");

		_drawFeat(btnCooler, rf_dataCooler, lr_dataCooler, tblCooler, "Cooler");
		_drawFeat(btnValve, rf_dataValve, lr_dataValve, tblValve, "Valve");
		_drawFeat(btnPump, rf_dataPump, lr_dataPump, tblPump, "Pump");
		_drawFeat(btnAcc, rf_dataAcc, lr_dataAcc, tblAcc, "Accumulator");

})();




