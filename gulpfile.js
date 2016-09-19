var gulp = require('gulp'),
    autoprefixer = require('autoprefixer'),
    sass = require("gulp-sass"),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sourcemaps = require("gulp-sourcemaps"),
    fs = require('graceful-fs'),
    bytediff = require('gulp-bytediff'),
    plumber = require('gulp-plumber'),
    minify = require('gulp-minify'),
    postcss = require('gulp-postcss'),
    flexboxfixer = require('postcss-flexboxfixer');

var $    = require('gulp-load-plugins')();


var config = {
    jssrc: [
        "src/js/jquery.theAwesomeShadow.js"
    ]
};

var processors = [
    autoprefixer,
    flexboxfixer
];

gulp.task('styles', function() {
    gulp.src('src/scss/main.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(bytediff.start())
        .pipe(postcss([ autoprefixer({ add: false, browsers: [] }) ]))
        .pipe(postcss(processors))
        .pipe(cssnano())
        .pipe(concat('style.min.css'))
        .pipe(bytediff.stop(function(data) {
            var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
            var percent = data.percent*100;
            percent = 100-percent;
            return data.fileName + ' is ' + percent + '%' + difference + '\n' + 'StartSize: ' + data.startSize + '\n' + 'endSize: ' + data.endSize;
        }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest('dist/css/'))
});

gulp.task('compressJS', function() {
    return gulp.src(config.jssrc)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(rename("jquery.theAwesomeShadow.min.js"))
        .pipe(uglify())
        .pipe(concat("jquery.theAwesomeShadow.min.js"))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest('dist/js'));
});


