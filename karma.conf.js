// Karma configuration
// Generated on Wed Aug 21 2013 12:06:34 GMT+0100 (GMT Daylight Time)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    urlRoot: '/Users/db15/Documents/SangerProject/bcviz/',

    // frameworks to use
    frameworks: ['mocha', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
      {pattern: 'demo/*.bc', watched: false, included: false, served: true},
      {pattern: 'css/*.css', watched: false, included: true, served: true},
      {pattern: 'js/**/*.js', included: false},
      {pattern: 'test/*Spec.js', included: false},
      {pattern: 'test/chai-1.7.2.js', included: false},
      'test/test.main.js'
    ],


    // list of files to exclude
    exclude: [
      'js/JSON_sample_main.js'
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
