gulp      = require 'gulp'
gutil     = require 'gulp-util'
include   = require 'gulp-include'
coffee    = require 'gulp-coffee'

uglify    = require 'gulp-uglify'
del       = require 'del'

srcPaths =
	coffee: 'ia/*.coffee'
	js: ['ia/générées/*.js','ia/*.js']
targetPaths =
	js:'ia/générées/'
	final:'ia/publiable/'



gulp.task('default', ['coffee2js', 'minify'])
gulp.task('clean', ->
	del((cheminsEnTableau for key, cheminsEnTableau of targetPaths), gutil.log)
)
gulp.task('coffee2js', ->
	gulp.src(srcPaths.coffee)
	.pipe(include())
	.pipe(coffee({bare: true}).on('error', gutil.log))
	.pipe(gulp.dest(targetPaths.js))
)
gulp.task('minify', ['coffee2js'], ->
	gulp.src(srcPaths.js)
	.pipe(uglify(
		mangle:
			toplevel:true
			except: ["thisNameMustNotBeMinified"]
		ie_proof:false
		dead_code:true
		pure_getters:true
		compress:
			unsafe:true
		output:
				semicolons:true
	))
	.pipe(gulp.dest(targetPaths.final))
)

gulp.task('watch', ['default'], ->
	gulp.watch(srcPaths.coffee, ['coffee2js']);
	gulp.watch(srcPaths.js, ['minify']);
)
