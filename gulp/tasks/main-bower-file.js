var gulp = require('gulp'),
	mainBowerFiles = require('main-bower-files');
var config = require('../config')["main-bower-files"];

gulp.task("main-bower-files", function(){
	return gulp.src(mainBowerFiles()).pipe(gulp.dest(config.dest));
});
