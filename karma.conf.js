// Karma configuration
// Generated on Wed Aug 07 2013 14:26:08 GMT+0100 (BST)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    urlRoot: '/Users/db15/Documents/SangerProject/bcviz/',

    // frameworks to use
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      {pattern: 'test/chai/chai.js', included: true},
      'http://d3js.org/d3.v3.js',
      'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js',
      {pattern: 'demo/*.bc', watched: false, included: false, served: true},
      {pattern: 'css/*.css', watched: false, included: true, served: true},
      'js/*.js',
      'test/*.js'
    ],


    // list of files to exclude
    exclude: [
      
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

    // you can define custom flags
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          windowName: 'my-window',
          settings: {
            webSecurityEnabled: false
          }
        }
      }
    },

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
