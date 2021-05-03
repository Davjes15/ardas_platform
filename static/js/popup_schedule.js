/*
 + Add action type
 + Changed class for accept button
 + Changed month charater
 + Added code for hs system 
 + Added real today to compare selected date to make limit when selecting
*/

/*
# Vanilla Javascript Date Picker
An open source date picker based on Material Design using vanilla javascript. 
Project initiated by Danny Pule www.dannypule.com

## -- STILL IN DEVELOPMENT --
It can be used in any javascript based project and only has only one dependency which is the Roboto Google Font which is loaded using Javascript. To remove this font and use your own, see the below instructions in the 'Removing Roboto Font' section. 
 
COMPATABILITY
This date-picker should be compatible with all modern browsers including IE8 and IE9 which has been made compatible using a .classList polyfill made by Eli Grey called ClassList.js.

The MIT License

Copyright (c) 2015-2016 Danny Pule, Inc. http://www.dannypule.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

window.onload = function(){
  (function(window){ 
    const html =      "<div id='date-pick' class='date-pick text-center'>"
                    + "<div id='date-pick-body-current' class='date-pick-body'>"
                      + "<div id='date-pick-month' class='date-pick-month'>"
                        + "<span class='date-pick-controls date-pick-prev-month'>"
                          + "<i id='date-pick-prev' class='prev'><</i>"
                        + "</span>"
                        + "<div id='date-pick-month-current' class='date-pick-month-select'></div>"
                        + "<span class='date-pick-controls date-pick-next-month'>"
                          + "<i id='date-pick-next' class='next'>></i>"
                        + "</span>"
                      + "</div>"
                      + "<div id='date-pick-week-days-current' class='date-pick-week-days'>"
                        + "<span class='date-pick-week-day'>S</span>"
                        + "<span class='date-pick-week-day'>M</span>"
                        + "<span class='date-pick-week-day'>T</span>"
                        + "<span class='date-pick-week-day'>W</span>"
                        + "<span class='date-pick-week-day'>T</span>"
                        + "<span class='date-pick-week-day'>F</span>"
                        + "<span class='date-pick-week-day'>S</span>"
                      + "</div>"
                      + "<div id='date-pick-days-current' class='date-pick-days'></div>"
                    + "</div>"
                  + "</div>";
        
    document.getElementById("date-pick-container").innerHTML = html;
      
    document.getElementById("date-pick-prev").addEventListener("click", function(){
      _makeCalender('prev');
    });
    document.getElementById("date-pick-next").addEventListener("click", function(){
      _makeCalender('next');
    });
    document.getElementById("repairAction").addEventListener("click", function() {
      toggleSelectPeople();
    });
    document.getElementById("inspectionAction").addEventListener("click", function() {
      toggleSelectPeople();
    });
    document.getElementById("schedule-button").addEventListener("click", function(e){
      let action = "",
        repair = document.getElementById("repairAction"),
        inspection = document.getElementById("inspectionAction");
      let sel = document.getElementById("selected-resource").value;
      if ( repair.checked ) {
        console.log("repair");
        action = "Repair";
      } else if ( inspection.checked ) {
        console.log("inspection");
        action = "Inspection";
        sel = "";
      }
      let scheduleDate = days[globalDayOfWeek]+ " " +months[globalMonth]+ " " +globalDay+ " " +globalYear;
      localStorage.setItem("acceptDate", scheduleDate);
      localStorage.setItem("action", action);
      localStorage.setItem("resource", sel);
      window.close();
    });
  
  // const months =  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const months =  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // const days =  ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const days =  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysFirstLetter =  ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  var globalYear, globalMonth, globalDay, globalDayOfWeek;

  var dInit = new Date();
  var yearVariable = dInit.getFullYear();
  var monthVariable = dInit.getMonth();

  // month is 0-based but days are 1-based. Asking for day 0 and adding 1 to the current month gives you number of days in the month
  function daysInMonth(year,month) {
      return new Date(year, month + 1, 0).getDate();
  }

  window._makeCalender = function(status){
    var offset; // increases or decreases month
    var newSpan; // for creating a new span node
    var newContent; // for creating new day of month to go into span node
    var datePickBody = document.getElementById("date-pick-days-current");

    if (status === "current") {
      monthVariable = dInit.getMonth(); // sets monthVariable to current month
    } else if (status === "prev") {
      while (datePickBody.firstChild) { // removes all span nodes from datePickBody element
          datePickBody.removeChild(datePickBody.firstChild);
      }
      monthVariable -= 1; // decreases the month variable by 1 month
    } else if (status === "next") {
      while (datePickBody.firstChild) { // removes all span nodes from datePickBody element
          datePickBody.removeChild(datePickBody.firstChild);
      }
      monthVariable += 1; // increases the month variable by 1 month
    } else {
      monthVariable = dInit.getMonth(); // sets monthVariable to current month by default
    } // if

    var currentD = new Date();
    var currentYear = currentD.getFullYear();
    var currentMonth = currentD.getMonth();
    var currentDay = currentD.getDate(); // for highlighting current date

    var d = new Date(yearVariable, monthVariable); // creates year and date based on the status of monthVariable
    var year = globalYear = d.getFullYear();
    var month = globalMonth = d.getMonth();
    var date = d.getDate();
    var dayOfWeek = d.getDay();
    var numOfDaysInMonth = daysInMonth(year, month); 
    var extraBoxes = 35 - numOfDaysInMonth;
    var extraBoxesRight = extraBoxes - dayOfWeek;
    var extraBoxesLeft = extraBoxes - extraBoxesRight;
    var counter = 1;

    var datePickMonthCurrent = document.getElementById("date-pick-month-current");
    datePickMonthCurrent.innerHTML = months[month] + " " + year; // outputs date month and year on page

    for (var i = 1; i <= extraBoxesLeft; i++) {    
      newSpan = document.createElement("span"); 
      newSpan.className = "date-pick-day date-pick-extra-box";

      newContent = document.createTextNode(".");
      newSpan.appendChild(newContent);

      datePickBody.appendChild(newSpan);
    }; // for

    for (var j = 1; j <= numOfDaysInMonth; j++) {
      newSpan = document.createElement("span"); 
      newSpan.className = "date-pick-day date-pick-selectatble";
      newSpan.setAttribute("data-day", j);

      if (j === currentDay && month === currentMonth && year === currentYear) {   
        newSpan.className += " date-pick-selected-day";
      } // if

      newContent = document.createTextNode(j);
      newSpan.appendChild(newContent);

      // handles dates where 30th and/or 31st need to appear on the first line
      if (j !== 30 && j !== 31) {
        datePickBody.appendChild(newSpan);
      } else if (j === 30 && extraBoxesLeft == 6) {
        datePickBody.removeChild(datePickBody.childNodes[0]); // removes an empty box
        datePickBody.insertBefore(newSpan, datePickBody.firstChild);
      } else if (j === 31 && extraBoxesLeft == 5) {
        datePickBody.removeChild(datePickBody.childNodes[0]); // removes an empty box
        datePickBody.insertBefore(newSpan, datePickBody.firstChild); // adds after day 30
      } else if (j === 31 && extraBoxesLeft == 6) {
        datePickBody.removeChild(datePickBody.childNodes[1]); // removes an empty box
        datePickBody.insertBefore(newSpan, datePickBody.firstChild.nextElementSibling); // adds after day 30
      } else {
        datePickBody.appendChild(newSpan); 
      }// if

    }; // for

    if (extraBoxesRight >= 0) {
      for (var k = 1; k <= extraBoxesRight; k++) {
      newSpan = document.createElement("span"); 
      newSpan.className = "date-pick-day date-pick-extra-box";

      newContent = document.createTextNode(".");
      newSpan.appendChild(newContent);

      datePickBody.appendChild(newSpan);
      }; // for
    } // if

    var datePickSelectatble = document.getElementsByClassName("date-pick-selectatble");
    for(var i=0; i<datePickSelectatble.length; i++) { // adds changeSelectedDay event listener to each day
        datePickSelectatble[i].onclick = changeSelectedDay;
    };

  } // makeCalender
  _makeCalender("current");

  function makeTwoDigit(number){
    if (number < 10 && number[0] !== "0") {
      return "0" + number.toString();
    } else {
      return number;
    }
  }

  function changeSelectedDay(){
    datePickSelectedDay = document.getElementsByClassName("date-pick-selected-day");
    if (datePickSelectedDay[0] !== undefined){
      datePickSelectedDay[0].classList.remove("date-pick-selected-day");
      datePickSelectedDay = document.getElementsByClassName("date-pick-selected-day");
    }
    clickedElement = event.target;
    clickedElement.classList.add("date-pick-selected-day");

    globalDay = clickedElement.getAttribute("data-day");
    globalDay = parseInt(globalDay);
    tempDate = new Date(globalYear, globalMonth, globalDay);
    globalDayOfWeek = tempDate.getDay();
    globalMonthString = makeTwoDigit(globalMonth + 1);
    globalDayString = makeTwoDigit(globalDay);
    // console.log(globalYear + "-" + globalMonthString + "-" + globalDayString); // LOGGING TO CONSOLE
    var dateInput = document.getElementById("date-picker-input");
    // Added this part
    let realToday = new Date();
    if ( tempDate.getDate() < realToday.getDate() ) {
      alert("Select after today");
      localStorage.removeItem("acceptDate");
      this.classList.remove("date-pick-selected-day");
      return;
    }
    

    dateInput.value = days[globalDayOfWeek] + " " + months[globalMonth] + " " + globalDay + " " + globalYear;
    dateInput.setAttribute("data-selected-year", globalYear);
    dateInput.setAttribute("data-selected-month", globalMonth);
    dateInput.setAttribute("data-selected-day", globalDay);
  };

  function toggleSelectPeople(){
    let selectedPeople = document.getElementById("selected-people");
    let actionType = document.getElementsByName("action");
    let actionValue = "";
      for (let i = 0; i < actionType.length; i++) {
        if (actionType[i].checked) {
        actionValue = actionType[i].value;
      }
    }
    if (actionValue == "repairAction") {
      selectedPeople.classList.toggle("hidden");
    } else {
      selectedPeople.classList.add("hidden");
    }
  };

  WebFontConfig = {
    google: { families: [ 'Roboto::latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();
})(window);
}




/* 
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if ("document" in self) {

// Full polyfill for browsers with no classList support
if (!("classList" in document.createElement("_"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
      classListProp = "classList"
    , protoProp = "prototype"
    , elemCtrProto = view.Element[protoProp]
    , objCtr = Object
    , strTrim = String[protoProp].trim || function () {
        return this.replace(/^\s+|\s+$/g, "");
    }
    , arrIndexOf = Array[protoProp].indexOf || function (item) {
        var
              i = 0
            , len = this.length
        ;
        for (; i < len; i++) {
            if (i in this && this[i] === item) {
                return i;
            }
        }
        return -1;
    }
    // Vendors: please allow content code to instantiate DOMExceptions
    , DOMEx = function (type, message) {
        this.name = type;
        this.code = DOMException[type];
        this.message = message;
    }
    , checkTokenAndGetIndex = function (classList, token) {
        if (token === "") {
            throw new DOMEx(
                  "SYNTAX_ERR"
                , "An invalid or illegal string was specified"
            );
        }
        if (/\s/.test(token)) {
            throw new DOMEx(
                  "INVALID_CHARACTER_ERR"
                , "String contains an invalid character"
            );
        }
        return arrIndexOf.call(classList, token);
    }
    , ClassList = function (elem) {
        var
              trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
            , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
            , i = 0
            , len = classes.length
        ;
        for (; i < len; i++) {
            this.push(classes[i]);
        }
        this._updateClassName = function () {
            elem.setAttribute("class", this.toString());
        };
    }
    , classListProto = ClassList[protoProp] = []
    , classListGetter = function () {
        return new ClassList(this);
    }
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
    return this[i] || null;
};
classListProto.contains = function (token) {
    token += "";
    return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
    var
          tokens = arguments
        , i = 0
        , l = tokens.length
        , token
        , updated = false
    ;
    do {
        token = tokens[i] + "";
        if (checkTokenAndGetIndex(this, token) === -1) {
            this.push(token);
            updated = true;
        }
    }
    while (++i < l);

    if (updated) {
        this._updateClassName();
    }
};
classListProto.remove = function () {
    var
          tokens = arguments
        , i = 0
        , l = tokens.length
        , token
        , updated = false
        , index
    ;
    do {
        token = tokens[i] + "";
        index = checkTokenAndGetIndex(this, token);
        while (index !== -1) {
            this.splice(index, 1);
            updated = true;
            index = checkTokenAndGetIndex(this, token);
        }
    }
    while (++i < l);

    if (updated) {
        this._updateClassName();
    }
};
classListProto.toggle = function (token, force) {
    token += "";

    var
          result = this.contains(token)
        , method = result ?
            force !== true && "remove"
        :
            force !== false && "add"
    ;

    if (method) {
        this[method](token);
    }

    if (force === true || force === false) {
        return force;
    } else {
        return !result;
    }
};
classListProto.toString = function () {
    return this.join(" ");
};

if (objCtr.defineProperty) {
    var classListPropDesc = {
          get: classListGetter
        , enumerable: true
        , configurable: true
    };
    try {
        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
    } catch (ex) { // IE 8 doesn't support enumerable:true
        if (ex.number === -0x7FF5EC54) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        }
    }
} else if (objCtr[protoProp].__defineGetter__) {
    elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

} else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
    "use strict";

    var testElement = document.createElement("_");

    testElement.classList.add("c1", "c2");

    // Polyfill for IE 10/11 and Firefox <26, where classList.add and
    // classList.remove exist but support only one argument at a time.
    if (!testElement.classList.contains("c2")) {
        var createMethod = function(method) {
            var original = DOMTokenList.prototype[method];

            DOMTokenList.prototype[method] = function(token) {
                var i, len = arguments.length;

                for (i = 0; i < len; i++) {
                    token = arguments[i];
                    original.call(this, token);
                }
            };
        };
        createMethod('add');
        createMethod('remove');
    }

    testElement.classList.toggle("c3", false);

    // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
    // support the second argument.
    if (testElement.classList.contains("c3")) {
        var _toggle = DOMTokenList.prototype.toggle;

        DOMTokenList.prototype.toggle = function(token, force) {
            if (1 in arguments && !this.contains(token) === !force) {
                return force;
            } else {
                return _toggle.call(this, token);
            }
        };

    }

    testElement = null;
}());

}

}
