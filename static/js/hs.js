"use strict";

/* 
	Declared Global Scope Variables
	------------------------------------------------
*/
let globalShapData = {};  // Holds all SHAP values from the backend
var btnReason = $("#btn_m_reason"),
	btnSensors = $("#btn_m_sensors"),
	btnHistory = $("#btn_m_history"),
	btnConfidRate = $("#btn_m_confidenceRate"),
	btnFeature = $("#btn_m_featureWeights"),
	// btnCritical = $("#btn_m_criticality"),
	// btnResources = $("#btn_m_resources"),
	// btnOprHrs = $("#btn_m_oprhours"),

	drawCol_1 = $(".recomm_act"),
	drawCol_2 = $(".col-confiRate"),
	drawBox_1 = $("#graph_sensor_1 .draw"),
	drawBox_1_chart = $("#graph_sensor_1 .chart"),
	drawBox_2 = $("#graph_sensor_2 .draw"),
	drawBox_2_chart = $("#graph_sensor_2 .chart"),
	drawBox_3 = $("#graph_history .draw"),
	drawBox_3_chart = $("#graph_history .chart"),
	drawBox_4 = $("#graph_bar .draw"),
	drawBox_4_chart = $("#graph_bar .chart"),
	// drawTbl_1 = $("#tbl_crtclty"),
	// drawTbl_2 = $("#tbl_oprHrs"),
	// drawTbl_3 = $("#tbl_resources"),

	emptyBox_1 = $("#graph_sensor_1 .empty_data"),
	emptyBox_2 = $("#graph_sensor_2 .empty_data"),
	emptyBox_3 = $("#graph_history .empty_data"),
	emptyBox_4 = $("#graph_bar .empty_data"),
	lockBox_1 = $("#graph_sensor_1 .lock_data"),
	lockBox_2 = $("#graph_sensor_2 .lock_data"),
	lockBox_3 = $("#graph_history .lock_data"),
	lockBox_4 = $("#graph_bar .lock_data"),
	// lockTbl_1 = $("#r_crtclty .lock_data"),
	// lockTbl_2 = $("#r_oprHrs .lock_data"),
	// lockTbl_3 = $("#r_resources .lock_data"),
	titSensorL = $("#tit_sensorL"),
	titSensorR = $("#tit_sensorR"),
	titSensorCo = $("#tit_sensor_co"),
	titHistory = $("#graph_history_tit"),
	titFeature = $("#graph_feature_tit");


/* 
	Name : parseShapFeatures
	Desc : Parse SHAP features for visualization
	------------------------------------------------
*/

function parseShapFeatures(shapList) {
	const momentMap = { 'M': 'Mean', 'V': 'Variance', 'S': 'Skewness', 'K': 'Kurtosis' };
	let sensors = new Set();
	let data = shapList.map(d => {
		let [sensor, momentCode] = d.feature.split('_');
		sensors.add(sensor);
		return {
			sensor: sensor,
			moment: momentMap[momentCode],
			value: d.value,
			shap: d.shap
		};
	});
	return { data, sensors: Array.from(sensors), moments: ['Mean', 'Variance', 'Skewness', 'Kurtosis'] };
}


/* 
	Name : detectBtn
	Desc : Check each button if it turns on or off
	------------------------------------------------
*/
function detectBtn(lockBox, btn, emptyBox) {
	if ( lockBox.hasClass('off') == true ) {
		btn.addClass('on');
	} else {
		btn.removeClass('on');
	}
}



/* 
	Name : topmenuOnOff
	Desc : Only manager can control menus 
	+ 3.Sep.2019 added Password stage
	------------------------------------------------
*/
function topmenuOnOff(){
	let password = $("#lock_password"),
		mouseTrackingBox = $("#mouse_tracking"),
		btnPassword = $("#btn_password"),
		valPassword = $("#user_password"),
		worngPassword = $("#worng_password"),
		unlockBox = $("#btn_m_unlockBox");
	$("#btn_m_lock").toggle(function() {
		if ( $(this).is(':visible') == false ){
			password.removeClass('off');
			// it has to be passed password here to open other buttons
			btnPassword.click(function() {
				if ( valPassword.val() === "7796" ) { // password can be changed
					password.addClass('off');
					mouseTrackingBox.addClass('off');
					unlockBox.removeClass('off');
				} else {
					// Show the sentence next to password box
					// when you try to change to alret box, whenever you try to asscess again without reload, it will be repeared
					worngPassword.text("No Authorization");
				}
			})
			detectBtn(lockBox_1, btnSensors, emptyBox_1);
			detectBtn(lockBox_3, btnHistory, emptyBox_3);
			detectBtn(lockBox_4, btnFeature, emptyBox_4);
			// detectBtn(lockTbl_1, btnCritical);
			// detectBtn(lockTbl_2, btnOprHrs);
			// detectBtn(lockTbl_3, btnResources);
			// below function ( detectBtnTbl ) is for inside of table column
			function detectBtnTbl(col, btn) {
				if ( col.hasClass('off') == false ) {
					btn.addClass('on');
				} else {
					btn.removeClass('on');
				}
			}
			detectBtnTbl(drawCol_1, btnReason);
			detectBtnTbl(drawCol_2, btnConfidRate);
		} else {
			valPassword.val('');
			worngPassword.text('');
			mouseTrackingBox.removeClass('off');
			unlockBox.addClass('off');
		}
	});
}



/* 
	Name : sectionLock
	Desc : Contents will be controled at top-menu
	------------------------------------------------
*/
(function sectionLock() {

	// Reason
	btnReason.click(function() {
		if ( drawCol_1.hasClass('off') == false ){
			drawCol_1.addClass('off');
			btnReason.removeClass('on');
			$("#sggst_btn_feature").css("width", "259px");
			// $("#sggst_btn_feature").css("width", "262px");
		} else {
			drawCol_1.removeClass('off');
			btnReason.addClass('on');
			$("#sggst_btn_feature").css("width", "54px");
		}
	});

	// Confidence Rate
	btnConfidRate.click(function() {
		console.log(drawCol_2);
		if ( drawCol_2.hasClass('off') == false ){
			drawCol_2.addClass('off');
			btnConfidRate.removeClass('on');
			$("#sggst_sggst").css("width", "274px");
		} else {
			drawCol_2.removeClass('off');
			btnConfidRate.addClass('on');
			$("#sggst_sggst").css("width", "162px");
		}
	});

	// Sensors
	btnSensors.click(function() {
		if ( lockBox_1.hasClass('off') == false ){
			$(this).addClass('on');
			drawBox_1.show();
			drawBox_2.show();
			titSensorL.show().empty();
			titSensorR.show().empty();
			titSensorCo.show().empty();
			lockBox_1.addClass('off');
			lockBox_2.addClass('off');
			emptyBox_1.removeClass('off');
			emptyBox_2.removeClass('off');
		} else {
			$(this).removeClass('on');
			drawBox_1.hide();
			drawBox_1_chart.addClass('off');
			drawBox_2.hide();
			drawBox_2_chart.addClass('off');
			titSensorL.hide();
			titSensorR.hide();
			titSensorCo.hide();
			titSensorCo.parent().hide();
			lockBox_1.removeClass('off');
			lockBox_2.removeClass('off');
			emptyBox_1.addClass('off');
			emptyBox_2.addClass('off');
		}
	});

	function lockOnoffGragh(btn, lock, empty, tit, chart) {
		btn.click(function() {
			if ( lock.hasClass('off') == false ){
				$(this).addClass('on');
				lock.addClass('off');
				tit.show().empty();
				empty.removeClass('off');
			} else {
				$(this).removeClass('on');
				chart.addClass('off')
				lock.removeClass('off');
				tit.hide();
				empty.addClass('off');
			}
		});
	}
	lockOnoffGragh(btnHistory, lockBox_3, emptyBox_3, titHistory, drawBox_3_chart);
	lockOnoffGragh(btnFeature, lockBox_4, emptyBox_4, titFeature, drawBox_4_chart);

	function lockOnOffTbl(btn, draw, lock) {
		btn.click(function() {
			if ( lock.hasClass('off') == false ){
				$(this).addClass('on');
				draw.show();
				lock.addClass('off');
			} else {
				$(this).removeClass('on');
				draw.hide();
				lock.removeClass('off');				
			}
		});
	}
	// lockOnOffTbl(btnCritical, drawTbl_1, lockTbl_1);
	// lockOnOffTbl(btnOprHrs, drawTbl_2, lockTbl_2);
	// lockOnOffTbl(btnResources, drawTbl_3, lockTbl_3);

})();



/* 
	Name : sggstEleHighlight
	Desc : When mouse points each tag colunm, highlights the area at above maps
	------------------------------------------------
*/
(function sggstEleHighlight() {
	let cooler = $("#ele_tag_cooler").parent(),
			coolerTitle = $("#ele-tit-cooler").parent(),
			coolerRect = $("#highlight_cooler"),
			valve = $("#ele_tag_valve").parent(),
			valveTitle = $("#ele-tit-valve").parent(),
			valveRect = $("#highlight_valve"),
			pump =  $("#ele_tag_pump").parent(),
			pumpTitle = $("#ele-tit-pump").parent(),
			pumpRect = $("#highlight_pump"),
			acc =  $("#ele_tag_acc").parent(),
			accTitle = $("#ele-tit-acc").parent(),
			accRect = $("#highlight_acc");
		let imgCooler = $("#diamond3"),
			imgValve = $("#valve_v10"),
			imgPump = $("#motor1"),
			imgAccA1 = $("#tank_a1"),
			imgAccA2 = $("#tank_a2"),
			imgAccA3 = $("#tank_a3"),
			imgAccA4 = $("#tank_a4");

	function highlightEle(tbl, map, tit, img) {
		let arr = [tbl, map, tit, img];
		for ( let i = 0; i < arr.length; i++) {
			arr[i].mouseenter(function() {
				tbl.addClass('highlight_col');
				map.addClass('highlight_colour');
				tit.addClass('highlight_col');
			});
			arr[i].mouseleave(function() {
				tbl.removeClass('highlight_col');
				map.removeClass('highlight_colour');
				tit.removeClass('highlight_col');
			});
		}
	};
	highlightEle(cooler, coolerRect, coolerTitle, imgCooler);
	highlightEle(valve, valveRect, valveTitle, imgValve);
	highlightEle(pump, pumpRect, pumpTitle, imgPump);
	highlightEle(acc, accRect, accTitle, imgAccA1);
	highlightEle(acc, accRect, accTitle, imgAccA2);
	highlightEle(acc, accRect, accTitle, imgAccA3);
	highlightEle(acc, accRect, accTitle, imgAccA4);

})();



/* 
	Name :
	Desc : Load ML data to the suggestion table (left-bottom side)
	
	* NOTE
	* Currently almost same function is repeared when window is opened for initial set and when current cycle is changed
	* When these repeated codes are put one function, it is not working well
	* Need to refactoring about this
	------------------------------------------------
*/
var lightCooler = $("#lightBox_cooler").children(),
		lightValve = $("#lightBox_valve").children(),
		lightPump = $("#lightBox_pump").children(),
		lightAcc = $("#lightBox_acc").children(),
		sugCooler = $("#suggestion_cooler"),
		sugValve = $("#suggestion_valve"),
		sugPump = $("#suggestion_pump"),
		sugAcc = $("#suggestion_acc"),
		recommCooler = $("#recomm_cooler"),
		recommValve = $("#recomm_valve"),
		recommPump = $("#recomm_pump"),
		recommAcc = $("#recomm_acc"),
		btnsCooler = $("#btns_cooler"),
		btnsValve = $("#btns_valve"),
		btnsPump = $("#btns_pump"),
		btnsAcc = $("#btns_acc"),
		dateCooler = $("#date_record_cooler"),
		dateValve = $("#date_record_valve"),
		datePump = $("#date_record_pump"),
		dateAcc = $("#date_record_acc");

$(document).ready(function() {
	let currentCycle = $("#currentText").text();
	let currentModel = $("#model-list").val();
	let requestURL = 'http://127.0.0.1:5000/data/?cycle=' + currentCycle + '&model=' + currentModel;
	let predictionCooler, predictionValve, predictionPump, predictionAcc;
	let interpretation = "",
			recommendation = "";

	let confiRateCooler = $("#confiRate-cooler"),
	 		confiRateValve = $("#confiRate-valve"),
	 		confiRatePump = $("#confiRate-pump"),
	 		confiRateAcc = $("#confiRate-acc");

	currentModel == "random_forest" ? (
		confiRateCooler.text("99.70%"),
		confiRateValve.text("99.24%"),
		confiRatePump.text("99.40%"),
		confiRateAcc.text("98.45%")
	) : currentModel == "logistic_regression" ? (
		confiRateCooler.text("99.55%"),
		confiRateValve.text("84.29%"),
		confiRatePump.text("97.58%"),
		confiRateAcc.text("77.04%")
	) : ( 
		confiRateCooler.text("00.00%"),
		confiRateValve.text("00.00%"),
		confiRatePump.text("00.00%"),
		confiRateAcc.text("00.00%")
	);

	$.getJSON(requestURL, function(data) {
		predictionCooler = data['cooler']['prediction'];
		predictionValve = data['valve']['prediction'];
		predictionPump = data['pump']['prediction'];
		predictionAcc = data['acc']['prediction'];

		// Save SHAP values for each component globally
		globalShapData = {
			cooler: parseShapFeatures(data['cooler']['shap_values']),
			valve: parseShapFeatures(data['valve']['shap_values']),
			pump: parseShapFeatures(data['pump']['shap_values']),
			acc: parseShapFeatures(data['acc']['shap_values'])
		};

		// Cooler
		predictionCooler == 3 ? ( 
			interpretation = "Close to total failure", recommendation = "Replace immediately",
			lightCooler.addClass('alert_l4'), lightCooler.removeClass('alert_l1 alert_l2'),
			btnsCooler.removeClass('off')
		) : predictionCooler == 20 ? (
			interpretation = "Reduced efficiency", recommendation = "Expect to replace",
			lightCooler.addClass('alert_l2'), lightCooler.removeClass('alert_l1 alert_l4'),
			btnsCooler.removeClass('off')
		) : ( 
			interpretation = "Full efficiency", recommendation = "Do not replace",
			lightCooler.addClass('alert_l1'), lightCooler.removeClass('alert_l2 alert_l4'),
			btnsCooler.removeClass('off')
		);
		sugCooler.html(interpretation);
		recommCooler.html(recommendation);
		// Valve
		predictionValve == 73 ? ( 
			interpretation = "Close to total failure", recommendation = "Replace immediately",
			lightValve.addClass('alert_l4'), lightValve.removeClass('alert_l1 alert_l2 alert_l3'),
			btnsValve.removeClass('off')
		) : predictionValve == 80 ? ( 
			interpretation = "Severe lag", recommendation = "Expect to replace",
			lightValve.addClass('alert_l3'), lightValve.removeClass('alert_l1 alert_l2 alert_l4'),
			btnsValve.removeClass('off')
		) : predictionValve == 90 ? ( 
			interpretation = "Small lag", recommendation = "Expect to replace",
			lightValve.addClass('alert_l2'), lightValve.removeClass('alert_l1 alert_l3 alert_l4'),
			btnsValve.removeClass('off')
		) : ( 
			interpretation = "Optimal switching", recommendation = "Do not replace",
			lightValve.addClass('alert_l1'), lightValve.removeClass('alert_l2 alert_l3 alert_l4'),
			btnsValve.removeClass('off')
		);
		sugValve.html(interpretation);
		recommValve.html(recommendation);
		// Pump
		predictionPump == 2 ? ( 
			interpretation = "Severe leakage", recommendation = "Replace immediately",
			lightPump.addClass('alert_l4'), lightPump.removeClass('alert_l1 alert_l2'),
			btnsPump.removeClass('off')
		) : predictionPump == 1 ? ( 
			interpretation = "Weak leakage", recommendation = "Expect to replace",
			lightPump.addClass('alert_l2'), lightPump.removeClass('alert_l1 alert_l4'),
			btnsPump.removeClass('off')
		) : ( 
			interpretation = "No leakage", recommendation = "Do not replace",
			lightPump.addClass('alert_l1'), lightPump.removeClass('alert_l2 alert_l4'),
			btnsPump.removeClass('off')
		);
		sugPump.html(interpretation);
		recommPump.html(recommendation);
		// Acc
		predictionAcc == 90 ? ( 
			interpretation = "Close to total failure", recommendation = "Replace immediately",
			lightAcc.addClass('alert_l4'), lightAcc.removeClass('alert_l1 alert_l2 alert_l3'),
			btnsAcc.removeClass('off')
		) : predictionAcc == 100 ? ( 
			interpretation = "Severe low pressure", recommendation = "Expect to replace",
			lightAcc.addClass('alert_l3'), lightAcc.removeClass('alert_l1 alert_l2 alert_l4'),
			btnsAcc.removeClass('off')
		) : predictionAcc == 115 ? ( 
			interpretation = "Slightly low pressure", recommendation = "Expect to replace",
			lightAcc.addClass('alert_l2'), lightAcc.removeClass('alert_l1 alert_l3 alert_l4'),
			btnsAcc.removeClass('off')
		) : ( 
			interpretation = "Optimal pressure", recommendation = "Do not replace",
			lightAcc.addClass('alert_l1'), lightAcc.removeClass('alert_l2 alert_l3 alert_l4'),
			btnsAcc.removeClass('off')
		);
		sugAcc.html(interpretation);
		recommAcc.html(recommendation);
	});
});

const getData = () => {
	let currentCycle = $("#currentText").text();
	let currentModel = $("#model-list").val();
	let requestURL = 'http://127.0.0.1:5000/data/?cycle=' + currentCycle + '&model=' + currentModel;
	let predictionCooler, predictionValve, predictionPump, predictionAcc;
	let interpretation = "",
			recommendation = "";

	drawBox_1_chart.addClass("off");
	drawBox_2_chart.addClass("off");
	drawBox_3_chart.addClass("off");
	drawBox_4_chart.addClass("off");
	emptyBox_1.removeClass("off");
	emptyBox_2.removeClass("off");
	emptyBox_3.removeClass("off");
	emptyBox_4.removeClass("off");
	lockBox_1.addClass("off");
	lockBox_2.addClass("off");
	lockBox_3.addClass("off");
	lockBox_4.addClass("off");
	detectBtn(lockBox_1, btnSensors, emptyBox_1);
	detectBtn(lockBox_2, btnSensors, emptyBox_2);
	detectBtn(lockBox_3, btnHistory, emptyBox_3);
	detectBtn(lockBox_4, btnFeature, emptyBox_4);
	selCorrelation.empty();
	titSensorR.html(" ");

	let confiRateCooler = $("#confiRate-cooler"),
	 		confiRateValve = $("#confiRate-valve"),
	 		confiRatePump = $("#confiRate-pump"),
	 		confiRateAcc = $("#confiRate-acc");
	currentModel == "random_forest" ? (
		confiRateCooler.text("99.70%"),
		confiRateValve.text("99.24%"),
		confiRatePump.text("99.40%"),
		confiRateAcc.text("98.45%")
	) : currentModel == "logistic_regression" ? (
		confiRateCooler.text("99.55%"),
		confiRateValve.text("84.29%"),
		confiRatePump.text("97.58%"),
		confiRateAcc.text("77.04%")
	) : ( 
		confiRateCooler.text("00.00%"),
		confiRateValve.text("00.00%"),
		confiRatePump.text("00.00%"),
		confiRateAcc.text("00.00%")
	);

	$.getJSON(requestURL, function(data) {
		predictionCooler = data['cooler']['prediction'];
		predictionValve = data['valve']['prediction'];
		predictionPump = data['pump']['prediction'];
		predictionAcc = data['acc']['prediction'];

		// Save SHAP values for each component globally
		globalShapData = {
			cooler: parseShapFeatures(data['cooler']['shap_values']),
			valve: parseShapFeatures(data['valve']['shap_values']),
			pump: parseShapFeatures(data['pump']['shap_values']),
			acc: parseShapFeatures(data['acc']['shap_values'])
		};

		// Cooler
		predictionCooler == 3 ? ( 
			interpretation = "Close to total failure", recommendation = "Replace immediately",
			lightCooler.addClass('alert_l4'), lightCooler.removeClass('alert_l1 alert_l2'),
			dateCooler.addClass('off'), btnsCooler.removeClass('off')
		) : predictionCooler == 20 ? (
			interpretation = "Reduced efficiency", recommendation = "Expect to replace",
			lightCooler.addClass('alert_l2'), lightCooler.removeClass('alert_l1 alert_l4'),
			dateCooler.addClass('off'), btnsCooler.removeClass('off')
		) : ( 
			interpretation = "Full efficiency", recommendation = "Do not replace",
			lightCooler.addClass('alert_l1'), lightCooler.removeClass('alert_l2 alert_l4'),
			dateCooler.addClass('off'), btnsCooler.removeClass('off')
		);
		sugCooler.html(interpretation);
		recommCooler.html(recommendation);
		// Valve
		predictionValve == 73 ? ( 
			interpretation = "Close to total failure", recommendation = "Replace immediately",
			lightValve.addClass('alert_l4'), lightValve.removeClass('alert_l1 alert_l2 alert_l3'),
			dateValve.addClass('off'), btnsValve.removeClass('off')
		) : predictionValve == 80 ? ( 
			interpretation = "Severe lag", recommendation = "Expect to replace",
			lightValve.addClass('alert_l3'), lightValve.removeClass('alert_l1 alert_l2 alert_l4'),
			dateValve.addClass('off'), btnsValve.removeClass('off')
		) : predictionValve == 90 ? ( 
			interpretation = "Small lag", recommendation = "Expect to replace",
			lightValve.addClass('alert_l2'), lightValve.removeClass('alert_l1 alert_l3 alert_l4'),
			dateValve.addClass('off'), btnsValve.removeClass('off')
		) : ( 
			interpretation = "Optimal switching", recommendation = "Do not replace",
			lightValve.addClass('alert_l1'), lightValve.removeClass('alert_l2 alert_l3 alert_l4'),
			dateValve.addClass('off'), btnsValve.removeClass('off')
		);
		sugValve.html(interpretation);
		recommValve.html(recommendation);
		// Pump
		predictionPump == 2 ? ( 
			interpretation = "Severe leakage", recommendation = "Replace immediately",
			lightPump.addClass('alert_l4'), lightPump.removeClass('alert_l1 alert_l2'),
			datePump.addClass('off'), btnsPump.removeClass('off')
		) : predictionPump == 1 ? ( 
			interpretation = "Weak leakage", recommendation = "Expect to replace",
			lightPump.addClass('alert_l2'), lightPump.removeClass('alert_l1 alert_l4'),
			datePump.addClass('off'), btnsPump.removeClass('off')
		) : ( 
			interpretation = "No leakage", recommendation = "Do not replace",
			lightPump.addClass('alert_l1'), lightPump.removeClass('alert_l2 alert_l4'),
			datePump.addClass('off'), btnsPump.removeClass('off')
		);
		sugPump.html(interpretation);
		recommPump.html(recommendation);
		// Acc
		predictionAcc == 90 ? ( 
			interpretation = "Close to total failure", recommendation = "Replace immediately",
			lightAcc.addClass('alert_l4'), lightAcc.removeClass('alert_l1 alert_l2 alert_l3'),
			dateAcc.addClass('off'), btnsAcc.removeClass('off')
		) : predictionAcc == 100 ? ( 
			interpretation = "Severe low pressure", recommendation = "Expect to replace",
			lightAcc.addClass('alert_l3'), lightAcc.removeClass('alert_l1 alert_l2 alert_l4'),
			dateAcc.addClass('off'), btnsAcc.removeClass('off')
		) : predictionAcc == 115 ? ( 
			interpretation = "Slightly low pressure", recommendation = "Expect to replace",
			lightAcc.addClass('alert_l2'), lightAcc.removeClass('alert_l1 alert_l3 alert_l4'),
			dateAcc.addClass('off'), btnsAcc.removeClass('off')
		) : ( 
			interpretation = "Optimal pressure", recommendation = "Do not replace",
			lightAcc.addClass('alert_l1'), lightAcc.removeClass('alert_l2 alert_l3 alert_l4'),
			dateAcc.addClass('off'), btnsAcc.removeClass('off')
		);
		sugAcc.html(interpretation);
		recommAcc.html(recommendation);
	});
};

$(document).on('click', '#btn_m_changeStatus', function() {
	getData();
});
$(document).on('click', '#btn_m_changeModelStatus', function() {
	getData();
});




/* 
	Name : recordDate
	Desc : Record date and resource for accpet and decline button in popup
	------------------------------------------------
*/
// Global variable for buttons with Accept and Reject
var accpCooler = $("#btns_cooler .btn_accpet"),
	rejCooler = $("#btns_cooler .btn_reject"),
	accpValve = $("#btns_valve .btn_accpet"),
	rejValve = $("#btns_valve .btn_reject"),
	accpPump = $("#btns_pump .btn_accpet"),
	rejPump = $("#btns_pump .btn_reject"),
	accpAcc = $("#btns_acc .btn_accpet"),
	rejAcc = $("#btns_acc .btn_reject");

function recordDate(btnAcc, btnRej, btnBox, dateBox, lightBox) {
	let today = new Date();
	let printToday = today.toDateString();
	// when any accept button is clicked
	btnAcc.click(function() {
		let date, resource, action;
		date = localStorage.removeItem("acceptDate");
		resource = localStorage.removeItem("resource");
		action = localStorage.removeItem("action");
		let popup = window.open('../static/popup/popup_schedule.html', '_blank', 'width=550, height=570');
		popup.onbeforeunload = function(){
			// Bring date in local storage and resource value
			date = localStorage.getItem("acceptDate");
			resource = localStorage.getItem("resource");
			action = localStorage.getItem("action");
			if ( date == null || resource == null || resource == "select" ) {
				date = localStorage.removeItem("acceptDate");
				resource = localStorage.removeItem("resource");
				return false;
			}
			btnBox.addClass('off');
			dateBox.removeClass('off');
			dateBox.text(action + ": " + date + " / " + resource);
		}
	});
	// when any reject button is clicked
	btnRej.click(function() {
		let date, resource, action;
		date = localStorage.removeItem("acceptDate");
		resource = localStorage.removeItem("resource");
		action = localStorage.removeItem("action");
		let popup = window.open('../static/popup/popup_schedule.html', '_blank', 'width=550, height=570');
		popup.onbeforeunload = function(){
			// Bring date in local storage and resource value
			date = localStorage.getItem("acceptDate");
			resource = localStorage.getItem("resource");
			action = localStorage.getItem("action");
			if ( date == null || resource == null || resource == "select" ) {
				date = localStorage.removeItem("acceptDate");
				resource = localStorage.removeItem("resource");
				return false;
			}
			btnBox.addClass('off');
			dateBox.removeClass('off');
			dateBox.text(action + ": " + date + " / " + resource);
		}
	});
}
recordDate(accpCooler, rejCooler, btnsCooler, dateCooler, lightCooler);
recordDate(accpValve, rejValve, btnsValve, dateValve, lightValve);
recordDate(accpPump, rejPump, btnsPump, datePump, lightPump);
recordDate(accpAcc, rejAcc, btnsAcc, dateAcc, lightAcc);
