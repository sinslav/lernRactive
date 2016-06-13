const gulp = require('gulp');
const stylus = require('gulp-stylus');
const jade = require('gulp-jade');
const del = require('del');
const concat = require('gulp-concat')
const gulpIf = require('gulp-if');
const gulpPlumber = require('gulp-plumber');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpNotify = require('gulp-notify');
const gulpCoffee = require('gulp-coffee');
const gulpUglify = require('gulp-uglify');
const fileInclud = require('gulp-file-include');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development'; 
console.log("NODE_ENV isDevelopment = " +  isDevelopment);

const path ={
	"markup" :
		{
		"src" :  "./src/*.jade",
		"dest" : "./build"
		},
	"css" :
		{
		"src" :  ["./src/assets/css/*.styl", "./src/assets/blocks/**.styl" ],
		"dest" : "./build/"
		},
	"scripts" :
		{
		"src" :  ["./src/assets/js/_main.coffee", "./src/assets/js/_dependencies.js", "./src/assets/blocks/**.coffee" ],
		"dest" :  ["./build/" ],
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



gulp.task('clean', function(){
	return del(path.all)
})

gulp.task('jade', function(){
	return gulp.src(path.markup.src)
		.pipe(jade())
		.pipe(gulp.dest(path.markup.dest))
})

gulp.task('scripts', function(){
	return gulp.src(path.scripts.src)
		.pipe(gulpPlumber({"errorHandler" : gulpNotify.onError("Error: <%= error %>")}))
		.pipe(gulpIf(isDevelopment, gulpSourcemaps.init({includeContent: true})))
		.pipe(fileInclud())
		.pipe(gulpIf('**/*.coffee',
            gulpCoffee()))
				.pipe(concat('build.js'))
		.pipe(concat('app.js'))
		.pipe(gulpIf(isDevelopment, gulpSourcemaps.write()))
		.pipe(gulpIf(!isDevelopment, gulpUglify()))
		.pipe(gulp.dest(path.all))



		// .pipe(gulpIf(isDevelopment, sourcemaps.init(includeContent: true)))
		// .pipe(include())
		// .pipe(gulpIf('**/*.coffee', coffee(bare: true).on('error', notify.onError("Error: <%= error %>"))))
		// .pipe(debug(title: 'concat'))
		// .pipe(concat('build.js'))
		// .pipe(gulpIf(isDevelopment, sourcemaps.write()))
		// .pipe(gulpIf(!isDevelopment, uglify()))
		// .pipe gulp.dest(path.build.scripts)

})