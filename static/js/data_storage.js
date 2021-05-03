/*
 * IMPORTANT
 * This file MUST be loaded THE LAST ORDER of js files in HTML files both sending page and receiving page
 * 
 */
"use strict";

// DETECTION : Detect if the browser supports web storage before using it
if (window.localStorage) {
	// console.log("This browser supports localStorage");
} else {
	// console.log("Sorry, No localStorage support");
}

// Detected Button
var accpCooler = $("#btns_cooler .btn_accpet"),
	rejCooler = $("#btns_cooler .btn_reject"),
	accpValve = $("#btns_valve .btn_accpet"),
	rejValve = $("#btns_valve .btn_reject"),
	accpPump = $("#btns_pump .btn_accpet"),
	rejPump = $("#btns_pump .btn_reject"),
	accpAcc = $("#btns_acc .btn_accpet"),
	rejAcc = $("#btns_acc .btn_reject");

// Data store with library
window.onload = function() {
	sysend.proxy('http://127.0.0.1:5000/hmi');
	sysend.proxy('http://127.0.0.1:5000/storage');

	// Recieve time when window(/hmi) is loaded
	sysend.on('windowLoad', function(ready) { 
		let loadedTime = ready["ready"] + " : " + "Experiment is ready";
		let para = document.createElement("p");
		let nodeTime = document.createTextNode(loadedTime);
		let listBox = document.getElementById("data-list");
		para.appendChild(nodeTime);
		listBox.appendChild(para);
	});
	// Send time when window(/hmi) is loaded
	(function readyLoad() {
		let readyTime = new Date;
		localStorage.setItem("Window Ready Time", readyTime)
		sysend.broadcast('windowLoad', {ready: readyTime});
	})();

	// Recieve time whenever buttons are clicked
	sysend.on('dataStorage', function(message) {
		let recordTime = message["message"];
		let recordBtn = " : " + message["btnType"];
		let para = document.createElement("p");
		let nodeTime = document.createTextNode(recordTime);
		let nodeBtn = document.createTextNode(recordBtn);
		let listBox = document.getElementById("data-list");

		// Caculate between times to add before appending new para with time
		if ( listBox.childNodes.length > 0 ) {
			let beforeTime = listBox.lastElementChild.textContent.split('-')[0];
			let newTime = recordTime.toString().split('-')[0];
			let betweenTime = Date.parse(newTime) - Date.parse(beforeTime);
			var converedTime;
			function convertTime(d) {
				let	scd = parseInt( (d/1000)%60 ),
					m = parseInt( (d/(1000*60))%60 ),
					h = parseInt( (d/(1000*60*60))%24 );
					console.log("beforeTime: ", beforeTime);
					console.log("newTime: ", newTime);
				converedTime = " + " + h + " hour(s) " + " " + m + " minute(s) " + " " + scd + " second(s)";
				return converedTime;
			}
			convertTime(betweenTime);
			var nodeBetweenTime = document.createTextNode(converedTime);
		} else {
			var nodeBetweenTime = document.createTextNode(" ");
		}
		// append all time and nodes to new p element
		para.appendChild(nodeTime);
		para.appendChild(nodeBtn);
		para.appendChild(nodeBetweenTime);
		listBox.appendChild(para);
	});
	// Send time whenever buttons are clicked && each button MUST be added below
	accpCooler.add(rejCooler).add(accpValve).add(rejValve).add(accpPump).add(rejPump).add(accpAcc).add(rejAcc)
	.click(function() {
		let startTime = new Date,
				btnType = this.parentNode.id + " " + this.className;
		localStorage.setItem("Recoed Time", startTime),
		localStorage.setItem("Recoed Button", btnType);
		sysend.broadcast('dataStorage', {message: startTime, btnType});
	});
};

// Set download automatically as a text file
function download(filename, datalist) {
	let ele = document.createElement('a');
	ele.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(datalist));
	ele.setAttribute('download', filename);
	ele.style.display = 'none';
	document.body.appendChild(ele);
	ele.click();
	document.body.removeChild(ele);
}

// Start file download and Generate download of the text file with all data list
document.getElementById("btn-save-datalist").addEventListener("click", function(){
	let paras = document.getElementById("data-list").children;
	let datalist = [];
	for( var i = 0; i < paras.length; i ++ ) {
		var txt = paras[i].innerHTML + "\r\n";
		datalist.push(txt);
	}
	let filename = "buttonClickData.txt";
	download(filename, datalist); // Call download function here
});

// Remove printed data list and local storage
document.getElementById("btn-clear-datalist").addEventListener("click", function() {
	localStorage.removeItem("Recoed Time"),
	localStorage.removeItem("Recoed Button");
	let listBox = document.getElementById("data-list");
	while (listBox.firstChild) {
		listBox.removeChild(listBox.firstChild);
	}
});





