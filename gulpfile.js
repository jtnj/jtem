var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    header = require('gulp-header'),
    concat = require('gulp-concat'),
    del = require('del'),
    fileinclude = require('gulp-file-include'),
    debug = require('gulp-debug'),
    package = require('./package.json');
var srcPaths = {
    globalJS: ['src/js/globals.js', 'src/modules/**/js/global.js'],
    pluginJS: ['src/js/plugins.js', 'src/modules/**/js/plugin.js'],
    globalCSS: ['src/styles/globals.scss', 'src/modules/**/css/global.scss'],
    html: ['src/*.html'],
    htmlWatch: ['src/*.html', 'src/fragments/*.html', 'src/modules/*.html'],
    files: ['src/files/*']
}
var distPaths = {
    js: 'dist/js',
    css: 'dist/css',
    files: 'dist/files',
    dist: 'dist'
}
var banner = ['/*!\n' + ' * <%= package.name %>\n' + ' * <%= package.title %>\n' + ' * <%= package.url %>\n' + ' * @author <%= package.author %>\n' + ' * @version <%= package.version %>\n' + ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' + ' */', '\n'].join('');
gulp.task('clean', function(cb) {
    del('dist', cb);
});
/*
SASS Processing
 */
gulp.task('css', function() {
    return gulp.src(srcPaths.globalCSS).pipe(debug({title: 'css'})).pipe(sass({
        errorLogToConsole: true
    })).pipe(concat('globals.css')).pipe(gulp.dest(distPaths.css)).pipe(browserSync.reload({
        stream: true
    }));
});
gulp.task('css-minify', function() {
    return gulp.src(srcPaths.globalCSS).pipe(debug({title: 'css'})).pipe(sass({
        errorLogToConsole: true
    })).pipe(concat('globals.css')).pipe(gulp.dest(distPaths.css)).pipe(minifyCSS()).pipe(rename({
        suffix: '.min'
    })).pipe(header(banner, {
        package: package
    })).pipe(gulp.dest(distPaths.css));
});
/*
JS Processing
 */
gulp.task('js', function() {
    gulp.src(srcPaths.globalJS).pipe(debug({title: 'globalJS'})).pipe(jshint('.jshintrc')).pipe(jshint.reporter('default')).pipe(concat('globals.js')).pipe(header(banner, {
        package: package
    })).pipe(gulp.dest(distPaths.js)).pipe(browserSync.reload({
        stream: true,
        once: true
    }));
    gulp.src(srcPaths.pluginJS).pipe(debug({title: 'pluginJS'})).pipe(jshint('.jshintrc')).pipe(jshint.reporter('default')).pipe(concat('plugins.js')).pipe(header(banner, {
        package: package
    })).pipe(gulp.dest(distPaths.js)).pipe(browserSync.reload({
        stream: true,
        once: true
    }));
    return;
});
gulp.task('js-uglify', function() {
    gulp.src(srcPaths.globalJS).pipe(debug({title: 'globalJS'})).pipe(jshint('.jshintrc')).pipe(jshint.reporter('default')).pipe(concat('globals.js')).pipe(gulp.dest(distPaths.js)).pipe(uglify()).pipe(header(banner, {
        package: package
    })).pipe(rename({
        suffix: '.min'
    })).pipe(gulp.dest(distPaths.js));
    gulp.src(srcPaths.pluginJS).pipe(debug({title: 'pluginJS'})).pipe(jshint('.jshintrc')).pipe(jshint.reporter('default')).pipe(concat('plugins.js')).pipe(gulp.dest(distPaths.js)).pipe(uglify()).pipe(header(banner, {
        package: package
    })).pipe(rename({
        suffix: '.min'
    })).pipe(gulp.dest(distPaths.js));
    return;
});
/*
HTML Processing
 */
gulp.task('html', function() {
    return gulp.src(srcPaths.html).pipe(debug({title: 'html'})).pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    })).pipe(gulp.dest(distPaths.dist));
});
/*
Associated Files
 */
gulp.task('files', function() {
    return gulp.src(srcPaths.files).pipe(debug({title: 'files'})).pipe(gulp.dest(distPaths.files));
});
/*
Browser Sync
 */
gulp.task('browser-sync', ['css', 'js', 'html', 'files'], function() {
    browserSync({
        server: {
            baseDir: "dist"
        }
    });
});
gulp.task('default', ['browser-sync'], function() {
    gulp.watch(srcPaths.globalCSS, ['css']);
    gulp.watch(srcPaths.globalJS, ['js']);
    gulp.watch(srcPaths.htmlWatch, ['html']);
});

/*
Build for production with minify CSS & JS
 */
gulp.task('prod', ['css-minify', 'js-uglify', 'html', 'files'], function() {
});