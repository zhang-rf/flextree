var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('default', function () {
    gulp.src('src/css/*')
        .pipe(autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'ie >=8']}))
        .pipe(gulp.dest('dist/css'))
        .pipe(cleanCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'));

    gulp.src('src/*.js')
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));

    gulp.src(['src/components/component.js',
            'src/components/selectable.js', 'src/components/collapsible.js', 'src/components/checkbox.js',
            'src/components/dnd5.js', 'src/components/ajax.js', 'src/components/search.js'])
        .pipe(concat('flextree.components.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['default'], function () {
    gulp.watch('src/**', ['default']);
});
