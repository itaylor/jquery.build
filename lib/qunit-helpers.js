/**
 Several helper functions for dealing with common evaluation cases for QUnit
*/

equalIgnoreCase = function(expected, actual, message){
  equal(expected.toLowerCase(), actual.toLowerCase(), message);
};

/**
 * The innerHTML of a DOM node in IE is horribly munged, with uppercase tagnames and random spacing
 * This function allows you to compare two strings that may have come out of a dom node's innerHTML.
 * We do the same thing for JSDOM, which puts " />" at the end of all self closed tags.
 */
htmlCompare = function (expected, actual, message){
  if(navigator.userAgent.toLowerCase().indexOf("msie") != -1 || navigator.appName.toLowerCase().indexOf("jsdom") != -1){
    var div = document.createElement("div");
    div.innerHTML = expected;
    div.innerHTML +="";
    var expected = div.innerHTML;
    div = document.createElement("div");
    div.innerHTML = actual;
    div.innerHTML +="";
    actual = div.innerHTML;
    equalIgnoreCase(expected, actual, message);
  }else{
    equal(expected, actual, message);
  }
};

//This makes it so that calling window.console is always safe.
//In a browser that doesn't have a console, you can get at the console output by 
//alerting window.console.fakeconsole;

(function (){
 
 var fakeLogger = function (){
   window.console.fakeconsole.push(arguments);
 }
 
 window.console = window.console || {
    fakeconsole : [],
    log: fakeLogger,
    info: fakeLogger,
    error: fakeLogger,
    dir: fakeLogger  
 }; 
  
})()

if(typeof module != "undefined"){
  module.exports = {
    htmlCompare:htmlCompare,
    equalIgnoreCase:equalIgnoreCase
  }
}
