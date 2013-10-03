module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-mocha-test');
  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochaTest: {
      test:{
        options:{reporter:"spec", require:"qunit-mocha-ui", ui:"qunit-mocha-ui"},
        src:"test/**/*test.js"
      },
      bench:{
        options:{reporter:"spec", require:"qunit-mocha-ui", ui:"qunit-mocha-ui"},
        src:"test/bench.js"
      }
    }
  });
  grunt.registerTask('test', ['mochaTest:test']);
  grunt.registerTask('default', ['mochaTest']);
};