gulp  = require 'gulp'
gutil  = require 'gulp-util'
coffee = require 'gulp-coffee'
uglify = require 'gulp-uglify'
del = require 'del'

gulp.task('default', ['coffee2js','minify'])
gulp.task('clean', ->
	del(['ia/générées/','ia/publiable/'], gutil.log)
)
gulp.task('coffee2js', ->
	gulp.src('ia/*.coffee')
	.pipe(coffee({bare: true}).on('error', gutil.log))
	.pipe(gulp.dest('ia/générées/'))
)
gulp.task('minify', ['coffee2js'], ->
	gulp.src(['ia/générées/*.js','ia/*.js'])
	.pipe(uglify(
		mangle:
			toplevel:false
		ie_proof:false
		dead_code:true
		pure_getters:true
		compress:
			unsafe:true
		output:
				semicolons:false
	))
	.pipe(gulp.dest('ia/publiable/'))
)
