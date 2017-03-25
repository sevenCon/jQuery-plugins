var gulp = require("gulp");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");

// smartAjax js 文件压缩
gulp.task("sm-uglify",function(){
	gulp.src("./smartAjax/src/*.js")
			.pipe(uglify())
			.pipe(rename({
				suffix:".min"
			}))
			.pipe(gulp.dest("./smartAjax/dist"));
});


