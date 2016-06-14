const gulp = require('gulp');
const stylus = require('gulp-stylus');
const jade = require('gulp-jade');
const del = require('del');
const concat = require('gulp-concat');
const gulpIf = require('gulp-if');
const gulpPlumber = require('gulp-plumber');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpNotify = require('gulp-notify');
const gulpCoffee = require('gulp-coffee');
const gulpUglify = require('gulp-uglify');
const gulpCssMin = require('gulp-cssmin');
const fileInclud = require('gulp-include');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development'; 

console.log("NODE_ENV isDevelopment = " +  isDevelopment);

const path ={
	"markup" :
		{
		"src" :  "./src/*.jade",
		"watch": "./src/**/*.jade",
		"dest" : "./build"
		},
	"styles" :
		{
		"src" :  "./src/assets/_main.styl",
		"watch":  "./src/**/*.styl",
		"dest" : "./build/"
		},
	"scripts" :
		{
		"src" :  ["./src/assets/_dependencies.js", "./src/assets/_main.coffee"],
		"watch":  "./src/blocks/**/*.coffee",
		"dest" :  "./build/",
		},
	"images" :
		{
		"src" :   "./src/assets/i/*.{jpg,JPG,JPEG,jpeg,png,PNG,SVG,svg,gif,GIF}",
		"dest" : "./build/i/"
		},
	"fonts" :
		{
		"src" :   "./src/assets/f/**/*.*",
		"dest" :   "./build/f/"
		},
	"all" : "./build/"
} 


gulp.task('fonts', function(){
	return gulp.src(path.fonts.src)
		.pipe(gulp.dest(path.fonts.dest))
});

gulp.task('images', function(){
	return gulp.src(path.images.src)
		.pipe(imagemin())
		.pipe(gulp.dest(path.images.dest))
});

gulp.task('clean', function(){
	return del(path.all)
});

gulp.task('jade', function(){
	return gulp.src(path.markup.src)
		.pipe(jade())
		.pipe(gulp.dest(path.markup.dest))
});

gulp.task('scripts', function(){
	return gulp.src(path.scripts.src)
		.pipe(gulpPlumber({"errorHandler" : gulpNotify.onError("Error: <%= error %>")}))
		.pipe(gulpIf(isDevelopment, gulpSourcemaps.init({includeContent: true})))
		.pipe(fileInclud())
		.pipe(gulpIf('**/*.coffee',
            gulpCoffee()))
		.pipe(concat('app.js'))
		.pipe(gulpIf(isDevelopment, gulpSourcemaps.write()))
		.pipe(gulpIf(!isDevelopment, gulpUglify()))
		.pipe(gulp.dest(path.all))
});

gulp.task('styles', function(){
	return gulp.src(path.styles.src)
		.pipe(gulpPlumber({'errorHandler' : gulpNotify.onError("Error: <%= error %>")}))
		.pipe(gulpIf(isDevelopment, gulpSourcemaps.init({includeContent: true})))
		.pipe(stylus({'include css': true}))
		.pipe(gulpIf(isDevelopment, gulpSourcemaps.write()))
		.pipe(gulpIf(!isDevelopment, gulpCssMin()))
		.pipe(concat('main.css'))
		.pipe(gulp.dest(path.all))
	});

gulp.task('serve', function(){
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
	browserSync.watch('web/build/**/*.*').on('change', browserSync.reload);
	});

gulp.task('jade', function(){
	return gulp.src(path.markup.src)
		.pipe(jade())
		.pipe(gulp.dest(path.all))
});

gulp.task('watch', function() {
  gulp.watch(path.styles.watch, gulp.series('styles'));
  gulp.watch(path.scripts.watch, gulp.series('scripts'));
  gulp.watch(path.markup.watch, gulp.series('jade'));
});


gulp.task('build', gulp.series('clean', 'styles', 'scripts', 'images', 'fonts', 'jade'));

gulp.task('dev', gulp.series('clean', 'styles', 'scripts', 'images', 'fonts', 'jade', gulp.parallel('watch', 'serve')));
