var testrunner = require("qunit");
testrunner.setup({
  log:{
     // log assertions overview
    assertions: false,
    // log expected and actual values for failed tests
    errors: true,
    // log tests overview
    tests: false,
    // log summary
    summary: false,
    // log global summary (all files)
    globalSummary: true,
    // log currently testing code file
    testing: true,
   }
})

testrunner.run({
   deps: ["./setup.js", "../lib/jquery-1.7.2.js", "../lib/qunit-helpers.js", {path:"../lib/benchmark.js", namespace:"Benchmark"}],
   code: "../jquery.build.js",
   tests: ["./docfrag.test.js", "./build.test.js", "./speed.test.js"]
 }, function (err, report){
   process.exit(report.failed)
});

