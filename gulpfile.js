/* Gulp commands:
 * - 'gulp jshint': runs jshint for .js files
 * - 'gulp styles-dev': builds .scss to .css, makes sourcemap for .css file
 * - 'gulp styles-releace': builds .scss to .css, minifyes css, makes sourcemap for .css file
 * - 'gulp build-app-dev': runs 'gulp styles' + 'gulp jshint'
 *                         + puts into index.html dependencies of external libraries
 *                           and frameforks
 *                         + collects all .js files into main.js
 *                           and puts it into index.html.
 * - 'gulp server': runs server with lieveReload on 'http://localhost:8080'.
 * - 'gulp watch': watches for changes in source files.
 * - 'gulp build-app-release': do the same as 'gulp build-app-dev'
 *                             and uglifyes .js file.
 * - 'gulp' : 'gulp build-app-dev'
 *             + 'gulp server'
 *             + 'gulp watch'.
 * - 'gulp-release' : 'gulp build-app-release'
 *                     + 'gulp server'
 *                     + 'gulp watch'.
*/



var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    useref = require('gulp-useref'),
    jshint = require('gulp-jshint'),
    cssmin = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require("gulp-rename"),
    svgSprite = require('gulp-svg-sprite'),
    prefix  = require('gulp-autoprefixer'),
    templateCache = require('gulp-angular-templatecache'),
    ngAnnotate = require('gulp-ng-annotate'),
    concat = require('gulp-concat'),
    create = require('gulp-cordova-create'),
    description = require('gulp-cordova-description'),
    plugin = require('gulp-cordova-plugin'),
    version = require('gulp-cordova-version'),
    author = require('gulp-cordova-author'),
    xml = require('gulp-cordova-xml'),
    pref = require('gulp-cordova-preference'),
    android = require('gulp-cordova-build-android'),
    icon = require('gulp-cordova-icon'),
    nodemon = require('gulp-nodemon'),
    clean = require('gulp-clean'),
    babel = require('gulp-babel'),
    Server = require('karma').Server,
    replace = require('gulp-replace-task');
    repl = require('gulp-replace');

var bases = {
 app: 'src/',
 dist: 'build/'
};

var port = {
  client: 8080
}

var envConfig = {
    realTimePattern : /ClockService\.getCurrentTime\(\)\.currentTime.?\/.?milliseconds/,
    devTime : 1441875600,
    realWeatherApiPattern : /api.openweathermap.org\/data\/2.5\/forecast/,
    devWeatherApi : "localhost:8888/api/weather",
    realCitiesApiPattern : /cb-weather-app.herokuapp.com\/api\/city\/search\//,
    devCitiesApi : "localhost:8888/api/city/search/"
  };

var cordovaConf = {
  buildSrc: 'build',
  apkDest: 'apk',
  libMatch: "<!--CORDOVA-->",
  libSrc: "<script src='cordova.js'></script><script src='cordova_plugins.js'></script>",
  create: {
    dir: 'cordova',
    id: 'com.cdbrzzs.wthrpp',
    name: 'WeatherApp'
  },
  plugins: [
    'org.apache.cordova.device',
    'cordova-plugin-screen-orientation',
    'cordova-plugin-whitelist'
  ],
  xml: [
    '<allow-intent href="http://*/*" />'
  ]
};

var path = {
      build: { //Build files
          html: 'build/',
          js: 'build/js/',
          css: 'build/css/',
          svg: 'build/svg/'
      },
      src: { //Source files
          html: 'src/index.html',
          js: ['src/app/**/*.js', '!src/app/**/*.spec.js'],
          style: 'src/assets/scss/main.scss',
          svg: 'src/assets/svg/*.svg',
          views: 'src/app/**/*.html',
          favicon: 'favicon.ico'
      },
      watch: { // Which files we want to watch
          html: ['src/app/**/*.html','src/index.html'],
          js: 'src/app/**/*.js',
          style: ['src/assets/scss/*.scss', 'src/app/**/*.scss'],
          svg: 'src/assets/svg/*.svg'
      }
};

gulp.task('clean', function() {
  return gulp.src(bases.dist)
    .pipe(clean());
});


gulp.task('clean-cordova', function() {
  gulp.src([cordovaConf.create.dir, cordovaConf.apkDest])
    .pipe(clean());
 });

gulp.task('jshint', function() {
  return gulp.src(path.src.js)
    .pipe(jshint({"esnext": true}))
    .pipe(jshint.reporter('default'));
});

gulp.task('styles-dev', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefix("last 2 version", "> 1%", "ie 9"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(connect.reload());
});

gulp.task('styles-release', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefix("last 2 version", "> 1%", "ie 9"))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(connect.reload());
});

gulp.task('js-dev', function () {
gulp.src(path.src.js)
    .pipe(sourcemaps.init())
    .pipe(ngAnnotate())
    .pipe(babel())
    .pipe(concat('all.js'))
    .pipe(replace({
      patterns: [
        {
          match: envConfig.realTimePattern,
          replacement: envConfig.devTime
        },
        {
          match: envConfig.realWeatherApiPattern,
          replacement: envConfig.devWeatherApi
        },
        {
          match: envConfig.realCitiesApiPattern,
          replacement: envConfig.devCitiesApi
        }
      ]
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.build.js));
});

gulp.task('js-release', function () {
gulp.src(path.src.js)
    .pipe(sourcemaps.init())
    .pipe(ngAnnotate())
    .pipe(babel())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.build.js));
});


gulp.task('build-app-dev', ['pre-build-app-dev'],  function () {
    var assets = useref.assets();

    return gulp.src(path.src.html)
               .pipe(assets)
               .pipe(assets.restore())
               .pipe(useref())
               .pipe(gulp.dest(path.build.html))
               .pipe(connect.reload())
});

gulp.task('pre-build-app-dev', ['views','styles-dev', 'jshint','js-dev'],  function () {
    var assets = useref.assets();

    return gulp.src(path.src.html)
               .pipe(assets)
               .pipe(assets.restore())
               .pipe(useref())
               .pipe(gulp.dest(path.build.html))
               .pipe(connect.reload())
});

gulp.task('build-app-release', ['pre-build-app-release'],  function () {
    var assets = useref.assets();

    return gulp.src(path.src.html)
               .pipe(assets)
               .pipe(assets.restore())
               .pipe(useref())
               .pipe(gulp.dest(path.build.html))
               .pipe(connect.reload())
});

gulp.task('pre-build-app-release', ['views','styles-release', 'jshint','js-release'],  function () {
    var assets = useref.assets();

    return gulp.src(path.src.html)
               .pipe(assets)
               .pipe(assets.restore())
               .pipe(useref())
               .pipe(gulp.dest(path.build.html))
               .pipe(connect.reload())
});

gulp.task('watch', function () {
    gulp.watch(path.watch.html, ['build-app-dev']);
    gulp.watch(path.watch.style,['build-app-dev']);
    gulp.watch(path.watch.js,['build-app-dev']);
    gulp.watch(path.watch.svg,['build-app-dev']);
});

gulp.task('watch-release', function () {
    gulp.watch(path.watch.html, ['build-app-release']);
    gulp.watch(path.watch.style,['build-app-release']);
    gulp.watch(path.watch.js,['build-app-release']);
    gulp.watch(path.watch.svg,['build-app-release']);
});

gulp.task('svg', function() {
    var config = {
        dest : '.',
        mode : {
             css : {
                 dest : '.',
                 sprite : 'svg/sprite.svg'
                             }
         }
     };
    gulp.src(path.src.svg)
        .pipe(svgSprite(config))
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest(path.build.svg));
});

gulp.task("views", function() {
  return gulp.src(path.src.views)
    .pipe(templateCache('templates.js', { module:'templates', standalone:true }))
    .pipe(gulp.dest(path.build.js));
});

gulp.task('copy', function() {
  gulp.src(path.src.favicon, {cwd: bases.app})
    .pipe(gulp.dest(bases.dist));
});

gulp.task('copy-svg', function() {
  gulp.src(path.src.svg)
    .pipe(gulp.dest(path.build.svg));
});

gulp.task('lib-cordova', ['build-app-release'], function () {
  return gulp.src(cordovaConf.buildSrc + "/index.html")
          .pipe(repl(cordovaConf.libMatch, cordovaConf.libSrc))
          .pipe(gulp.dest(cordovaConf.buildSrc));
});

gulp.task('build-cordova', ['copy-svg', 'lib-cordova', 'clean-cordova'], function() {
    return gulp.src(cordovaConf.buildSrc)
      .pipe(create(cordovaConf.create))
      .pipe(plugin(cordovaConf.plugins))
      .pipe(xml(cordovaConf.xml))
      .pipe(android())
      .pipe(gulp.dest(cordovaConf.apkDest));
});

gulp.task('unit-test', function(){  
    new Server({
        configFile:__dirname + '/karma.conf.js',
        singleRun: false
    }).start();
});

gulp.task("client", ['build-app-dev'], function () {
    connect.server({
        port: port.client,
        root: 'build',
        livereload : true
    });
});

gulp.task("client-release", ['build-app-release'], function () {
    connect.server({
        port: port.client,
        root: 'build',
        livereload : true
    });
});

gulp.task('node-server', function () {
  nodemon({
    script: 'server/app.js'
  })
})


gulp.task('default', ['copy','copy-svg', 'watch','unit-test', 'node-server', 'client']);
gulp.task('release', ['copy','copy-svg', 'build-app-release']);
