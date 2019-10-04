/*=============================================
  Simple Front End Gulp starter by @milomirtopic
=============================================*/

/**
*
* Used packages
*
**/
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var browserSync  = require('browser-sync');
var prefix       = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');
// var uglify       = require('gulp-uglify');
// var rename       = require("gulp-rename");
var imagemin     = require("gulp-imagemin");
var pngquant     = require('imagemin-pngquant');
var notify       = require("gulp-notify");
var htmlmin      = require('gulp-html-minifier');
var clean        = require('gulp-clean');
var include      = require('gulp-include');
var nunjucksRender      = require('gulp-nunjucks-render');
//var htmlrender   = require('gulp-htmlrender');
//test 1


/**
* Nunjucks Templates
**/
gulp.task('templates', function () {
  return gulp.src('src/pages/**/*.+(html|nunjucks)')
    .pipe(nunjucksRender({
      path: ['src/templates/'] // String or Array
    }))
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true, preserveLineBreaks: true}))
    .pipe(gulp.dest('public'));
});



/**
*
* HTML
* - Minify
**/
// gulp.task('html', function() {
//   gulp.src('src/*.html')
//     .pipe(htmlmin({collapseWhitespace: true}))
//     .pipe(gulp.dest('public'))
// });



/**
*
* Javascript
* - Uglify
* - jshint notify errors
**/
gulp.task('scripts', function() {
  gulp.src('src/js/*.js')
    .pipe(uglify())
    // .pipe(rename({
    //   dirname: "min",
    //   suffix: ".min",
    // }))
    .pipe(gulp.dest('public/js'))
});


/**
* Javascript
* - Vendors
**/
gulp.task('vendors', function() {
  gulp.src('src/vendors/*.js')
    .pipe(include())
    .pipe(gulp.dest('public/vendors'))
});

/**
* html render tpls
**/

// gulp.task('render', function() {
// 	return gulp.src('src/*.html', {read: false})
//         .pipe(htmlmin({collapseWhitespace: true}))
// 		.pipe(htmlrender.render())
// 		.pipe(gulp.dest('public'));
// });



/**
*
* Styles
* - Compile
* - Compress/Minify
* - Catch errors (gulp-plumber)
* - Autoprefixer
*
**/
gulp.task('scss', function() {
  gulp.src('src/scss/**/*.scss')
  .pipe(sass())
  .on('error', notify.onError(function (error) {
     return 'An error occurred while compiling scss.\nLook in the console for details.\n' + error;
  }))
  // .pipe(rename({
  //   suffix: ".min",
  // }))
  .pipe(prefix('last 3 versions', '> 1%', 'ie 8', 'Android 2', 'Firefox ESR'))
  .pipe(plumber())
  .pipe(gulp.dest('public/css'));
});



/**
*
* BrowserSync
* - Watch CSS, JS & HTML for changes
* - localhost:3000
*
**/
gulp.task('browser-sync', function() {
  browserSync.init(['public/css/*.css', 'public/js/**/*.js', 'public/*.html'], {
    server: {
      baseDir: './public/'
    }
  });
});

// browserSync.init({
//     open: 'external',
//     files: ['./**/*.php'],
//     host: 'wp-starter.dev',
//     proxy: 'wp-starter.dev',
//     port: 3000
// });



/**
*
* Images
* - Compress them!
*
**/
gulp.task('img', function () {
  return gulp.src('src/img/**/*')
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('public/img'));
});

/**
*
* Clean
*
**/
gulp.task('clean', function () {
    return gulp.src('public/', {read: false})
        .pipe(clean());
});

/**
*
* Default task
*
**/
gulp.task('watch', ['scss', 'browser-sync', 'scripts', 'img', 'vendors', 'templates'], function () {
  //gulp.watch('src/*.html', ['html']);
  gulp.watch('src/scss/**/*.scss', ['scss']);
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('src/img/**/*', ['img']);
  gulp.watch('src/vendors/*.js', ['vendors']);
  gulp.watch('src/**/*.+(html|nunjucks)', ['templates']);
  //gulp.watch(['src/**/*.html'], ['render']);
});
