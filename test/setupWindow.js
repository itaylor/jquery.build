var jsdom = require("jsdom");
global.document = jsdom.jsdom("<html><head>"+
  "</head><body></body></html>", null, {
  features:{
    FetchExternalResources: ["script", "css", "link"]
  }
})
global.window = document.createWindow();
global.navigator = window.navigator;
global.location = window.location;
global.jQuery = require("../lib/jquery-1.10.2.js");
global.$ = jQuery;
var $b = require('../jquery.build.js')(jQuery,document);
jQuery.build = $b;
var helpers = require('../lib/qunit-helpers.js');
for(k in helpers){
  global[k] = helpers[k];
}
global.Benchmark = require("../lib/benchmark.js");
module.exports = window;