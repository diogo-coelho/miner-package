const gulp       = require('gulp');
const uglify     = require('gulp-uglify');
const filter     = require('gulp-filter');
const sourcemaps = require('gulp-sourcemaps');

function minifyFiles (cb) {
    gulp.src('build/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/'))
        .pipe(filter('**/*.js')) 
        .pipe(uglify({
            compress: {
                negate_iife: false
            }
        }))
        .pipe(gulp.dest('./bin/'));

    cb();
}

exports.minify = minifyFiles;