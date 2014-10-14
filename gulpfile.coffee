gulp  = require 'gulp'
gutil  = require 'gulp-util'
coffee = require 'gulp-coffee'
closureCompiler = require 'gulp-closure-compiler'
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
	gulp.src(['ia/générées/*.js'])
	.pipe(closureCompiler(
		compilerPath: 'node_modules/closurecompiler/compiler/compiler.jar'
		fileName: 'build.js'
		compilerFlags:
			#closure_entry_point: 'app.main'
			compilation_level: 'ADVANCED_OPTIMIZATIONS'
			#define: [
			#	"goog.DEBUG=false"
			#],
			#externs: [
			#	'bower_components/este-library/externs/react.js'
			#],
			#extra_annotation_name: 'jsx'
			# Some compiler flags (like --use_types_for_optimization) don't have value. Use null.
			#use_types_for_optimization: null
			only_closure_dependencies: true
			#output_wrapper: '(function(){%output%})();'
			warning_level: 'VERBOSE'
	))
	.pipe(gulp.dest('ia/publiable/'))
)
