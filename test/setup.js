/**
* Sets up the execution enviroment for doing tests that use jQuery and dom manipulation.
* We create a fake HTML Dom with jsdom, then copy the window properties into the local scope.
*/
var _ = require("underscore");
var jsdom = require("jsdom");
jsdom.defaultDocumentFeatures = {
  FetchExternalResources   : false,
  ProcessExternalResources : false,
  MutationEvents           : false,
  QuerySelector            : false
};

window = jsdom.jsdom("<!doctype html>\n<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'/></head><body>hello world</body></html>").createWindow();

global.window = window;
//put all the properties of window that weren't defined in global already into global
_.defaults(global,window);
