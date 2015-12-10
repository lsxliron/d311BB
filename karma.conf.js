// Karma configuration
// Generated on Wed Dec 09 2015 22:01:57 GMT-0500 (EST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'app/',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'requirejs', 'chai'],

    // proxies: {
    // '/data/':'app/data/'
    // },

    // list of files / patterns to load in the browser
    files: [
      '../test-main.js',
      {pattern: 'scripts/vendor/requirejs/require.js', included: false},
      {pattern: 'scripts/vendor/jquery/dist/jquery.min.js', included: false},
      {pattern: 'scripts/vendor/jquery/dist/jquery.min.map', included: false},
      {pattern: 'scripts/vendor/d3/d3.js', included: false},
      {pattern: 'scripts/vendor/underscore/underscore.js', included: false},
      {pattern: 'scripts/vendor/backbone/backbone.js', included: false},
      {pattern: 'scripts/models/*.js', included: false},
      {pattern: 'scripts/collections/*.js', included: false},
      {pattern: 'scripts/views/*.js', included: false},
      {pattern: 'tests/*.js', included: false},
      {pattern: 'tests/requirejs-plugins/lib/text.js', included: false},
      {pattern: 'tests/requirejs-plugins/src/json.js', included: false},
      
      {pattern: 'data/gj.json', watched: true, served: true, included: false},
      {pattern: 'data/Final_Data.json', watched: true, served: true, included: false},
      
      
    ],


    // list of files to exclude
    exclude: [
        'scripts/main.js',
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
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


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
