module.exports = function(config) {
  config.set({

    plugins: [
      'karma-jasmine',
      'karma-babel-preprocessor',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'phantomjs',
      'karma-phantomjs-launcher',
      'karma-ng-html2js-preprocessor',
      'karma-coverage',
      'morgan'
    ],

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-local-storage/dist/angular-local-storage.js',
      'bower_components/angular-loading-bar/build/loading-bar.js',
      'bower_components/ui-select/dist/select.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'node_modules/karma-babel-preprocessor/node_modules/babel-core/browser-polyfill.js',
      'src/**/*.js',
      'src/app/**/*.html'
    ],

    exclude: [
    ],

    preprocessors: {
      'src/**/*.js': ['babel', 'coverage'],
      'src/app/**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      moduleName: 'templates',
      stripPrefix: 'src/app/'
    },

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['PhantomJS'],

    singleRun: false
  });
};