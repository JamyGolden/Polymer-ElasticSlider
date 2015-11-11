var gulp = require('gulp');
var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var del = require('del');
var header = require('gulp-header');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel'); // Uglify not working without gulp-babel?
var rename = require('gulp-rename');
var minifyHtml = require('gulp-minify-html');
var pkg = require('./package.json');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

// Develop build
// ============================================================================
gulp.task('sass', function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(sourcemaps.write())
        .pipe(rename('elasticslider.css'))
        .pipe(gulp.dest('src/css'))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src([
        'src/elastic-slider/elastic-slider.js',
        'src/elastic-slider-pagi-item/elastic-slider-pagi-item.js',
    ])
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/**/*.js', ['js']);
});

gulp.task('connect', function() {
    connect.server({
        port: 5000,
        root: '.',
        livereload: true
    });
});

// Dist build
// ============================================================================
gulp.task('dist:clean', function (cb) {
    return del(['dist'], cb);
});

gulp.task('dist:copyView', ['dist:clean'], function () {
    return gulp.src([
            'src/elastic-slider/*.html',
            'src/elastic-slider-pagi-item/*.html',
        ])
        .pipe(concat('polymer-elastic-slider.html'))
        .pipe(minifyHtml({
            quotes: true,
            empty: true,
            spare: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('dist:sass', function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(rename('elasticslider.css'))
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('dist:build', ['dist:clean'], function () {
    return gulp.src([
            'src/elastic-slider/*.js',
            'src/elastic-slider-pagi-item/*.js',
        ])
        .pipe(concat('polymer-elastic-slider.min.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('dist'))
});

// Tasks
// ============================================================================
gulp.task('serve', ['sass', 'js', 'connect', 'watch']);
gulp.task('default', ['dist:build', 'dist:copyView', 'dist:sass']);
