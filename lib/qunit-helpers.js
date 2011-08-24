/**
 Several helper functions for dealing with common evaluation cases for QUnit
*/

var equalsIgnoreCase = function(expected, actual, message){
  equals(expected.toLowerCase(), actual.toLowerCase(), message);
};

/**
 * The innerHTML of a DOM node in IE is horribly munged, with uppercase tagnames and random spacing
 * This function allows you to compare two strings that may have come out of a dom node's innerHTML
 */
var htmlCompareForIE = function (expected, actual, message){
  if(navigator.userAgent.toLowerCase().indexOf("msie") != -1){
    var div = document.createElement("div");
    div.innerHTML = expected;
    div.innerHTML +="";
    var expected = div.innerHTML;
    div = document.createElement("div");
    div.innerHTML = actual;
    div.innerHTML +="";
    actual = div.innerHTML;
    equalsIgnoreCase(expected, actual, message);
  }else{
    equals(expected, actual, message);
  }
};