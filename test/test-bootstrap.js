/**
*  Adds everything necessary to make a QUnit HTML page with all the right versions of QUnit and jQuery 
*/
(function() {
  var qunitFolder = "../node_modules/qunit/deps/qunit/qunit/";
  var scripts = ["../lib/jquery-1.7.2.js", qunitFolder+ "qunit.js", "../lib/qunit-helpers.js", "../lib/benchmark.js", "../jquery.build.js"];

  var firstScript = document.getElementsByTagName("script")[0];
  var p = firstScript.parentNode;

  //add all the scripts to the DOM.
  for(var i = 0; i< scripts.length; i++){
    //This must be synchronous, so using document.write
    document.write("<script src='"+scripts[i]+"' type='text/javascript'></script>");
  }
  
  window.qUnitBootStrap = function (){
    jQuery(function (){
      jQuery("head").append(
        jQuery('<link rel="stylesheet" href="' + qunitFolder + 'qunit.css" type="text/css" media="screen" />')
      );
      jQuery("body").append(
        jQuery("<div id='qunit'></div>")
      );
    });  
  }
  document.write("<script defer>qUnitBootStrap();</script>");    
})();