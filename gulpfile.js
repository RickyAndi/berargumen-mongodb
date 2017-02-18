var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('build-styles', function() {

	//build index.css
	gulp.src([
		'./public/bower_components/bootstrap/dist/css/bootstrap.min.css',
		'./public/bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
		'./public/bower_components/toastr/toastr.min.css',
		'./public/styles/index.css'
	])
	.pipe(concat('index.css'))
	.pipe(uglifycss({
		"maxLineLen": 80,
		"uglyComments": true
	}))
	.pipe(gulp.dest('./public/builds/css'));

	//build profile.css
	gulp.src([
		'./public/bower_components/bootstrap/dist/css/bootstrap.min.css',
		'./public/bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
		'./public/styles/profile.css'
	])
	.pipe(concat('profile.css'))
	.pipe(uglifycss({
		"maxLineLen": 80,
		"uglyComments": true
	}))
	.pipe(gulp.dest('./public/builds/css'));

	//build viewboard.css
	gulp.src([
		'./public/bower_components/bootstrap/dist/css/bootstrap.min.css',
		'./public/bower_components/summernote/dist/summernote.css',
		'./public/bower_components/toastr/toastr.css',
		'./public/styles/viewboard.css'
	])
	.pipe(concat('viewboard.css'))
	.pipe(uglifycss({
		"maxLineLen": 80,
		"uglyComments": true
	}))
	.pipe(gulp.dest('./public/builds/css'));

	//build my-profile.css
	gulp.src([
		'./public/bower_components/bootstrap/dist/css/bootstrap.min.css',
		'./public/bower_components/toastr/toastr.css',
		'./public/bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
		'./public/styles/my-profile.css'
	])
	.pipe(concat('my-profile.css'))
	.pipe(uglifycss({
		"maxLineLen": 80,
		"uglyComments": true
	}))
	.pipe(gulp.dest('./public/builds/css'));
});

gulp.task('copy-fonts', function() {
	gulp.src('./public/bower_components/bootstrap/dist/fonts/*')
	.pipe(gulp.dest('./public/builds/fonts'))

	gulp.src('./public/bower_components/summernote/dist/font/*')
	.pipe(gulp.dest('./public/builds/css/font'))
})

gulp.task('build-script-production', function() {

	// build viewboard.js
	gulp.src([
		'./public/bower_components/vue/dist/vue.min.js',
		'./public/bower_components/jquery/dist/jquery.min.js',
		'./public/bower_components/jquery-ui/jquery-ui.min.js',
		'./public/bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min.js',
		'./public/bower_components/bootstrap/dist/js/bootstrap.min.js',
		'./public/bower_components/summernote/dist/summernote.min.js',
		'./public/bower_components/summernote/lang/summernote-id-ID.js',
		'./public/bower_components/jsplumb/dist/js/jsplumb.min.js',
		'./public/bower_components/ramda/dist/ramda.min.js',
		'./public/bower_components/socket.io-client/dist/socket.io.min.js',
		'./public/bower_components/toastr/toastr.min.js',
		'./public/models/board.js',
		'./public/models/card.js',
		'./public/models/user.js',
		'./public/models/relation.js',
		'./public/forms/create-card.form.js',
		'./public/vue_components/draggable-card.component.js',
		'./public/scripts/viewboard.js'
	])
	.pipe(sourcemaps.init())
	.pipe(concat('viewboard.js'))
	.pipe(uglify())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./public/builds/js'));

	// build profile.js
	gulp.src([
		'./public/bower_components/vue/dist/vue.min.js',
		'./public/bower_components/jquery/dist/jquery.min.js',
		'./public/bower_components/bootstrap/dist/js/bootstrap.min.js',
		'./public/bower_components/moment/min/moment.min.js',
		'./public/models/board.js',
		'./public/scripts/profile.js'
	])
	.pipe(sourcemaps.init())
	.pipe(concat('profile.js'))
	.pipe(uglify())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./public/builds/js'));

	// build myboard.js
	gulp.src([
		'./public/bower_components/vue/dist/vue.min.js',
		'./public/bower_components/jquery/dist/jquery.min.js',
		'./public/bower_components/bootstrap/dist/js/bootstrap.min.js',
		'./public/models/board.js',
		'./public/scripts/myboard.js'

	])
	.pipe(sourcemaps.init())
	.pipe(concat('myboard.js'))
	.pipe(uglify())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./public/builds/js'));

	// build my-profile.js
	gulp.src([
		'./public/bower_components/vue/dist/vue.min.js',
		'./public/bower_components/jquery/dist/jquery.min.js',
		'./public/bower_components/bootstrap/dist/js/bootstrap.min.js',
		'./public/bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js',
		'./public/bower_components/toastr/toastr.min.js',
		'./public/models/board.js',
		'./public/scripts/my-profile.js'
	])
	.pipe(sourcemaps.init())
	.pipe(concat('my-profile.js'))
	.pipe(uglify())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./public/builds/js'));

	// build index.js
	gulp.src([
		'./public/bower_components/jquery/dist/jquery.min.js',
		'./public/bower_components/bootstrap/dist/js/bootstrap.min.js',
		'./public/bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js',
		'./public/bower_components/vue/dist/vue.min.js',
		'./public/bower_components/moment/min/moment.min.js',
		'./public/bower_components/rxjs/dist/rx.lite.min.js',
		'./public/bower_components/toastr/toastr.min.js',
		'./public/models/user.js',
		'./public/models/board.js',
		'./public/scripts/index.js'
	])
	.pipe(sourcemaps.init())
	.pipe(concat('index.js'))
	.pipe(uglify())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./public/builds/js'));

	// build board-by-tag.js
	gulp.src([
		'./public/bower_components/jquery/dist/jquery.min.js',
		'./public/bower_components/bootstrap/dist/js/bootstrap.min.js',
		'./public/bower_components/vue/dist/vue.min.js',
		'./public/bower_components/moment/min/moment.min.js',
		'./public/models/board.js',
		'./public/models/user.js',
		'./public/scripts/board-by-tag.js'
	])
	.pipe(sourcemaps.init())
	.pipe(concat('board-by-tag.js'))
	.pipe(uglify())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./public/builds/js'));
});

gulp.task('build-script-development', function() {

	// build viewboard.js
	gulp.src([
		'./public/bower_components/vue/dist/vue.js',
		'./public/bower_components/jquery/dist/jquery.js',
		'./public/bower_components/jquery-ui/jquery-ui.js',
		'./public/bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.js',
		'./public/bower_components/bootstrap/dist/js/bootstrap.js',
		'./public/bower_components/summernote/dist/summernote.js',
		'./public/bower_components/summernote/lang/summernote-id-ID.js',
		'./public/bower_components/jsplumb/dist/js/jsplumb.js',
		'./public/bower_components/ramda/dist/ramda.js',
		'./public/bower_components/socket.io-client/dist/socket.io.js',
		'./public/bower_components/toastr/toastr.js',
		'./public/models/board.js',
		'./public/models/card.js',
		'./public/models/user.js',
		'./public/models/relation.js',
		'./public/forms/create-card.form.js',
		'./public/vue_components/draggable-card.component.js',
		'./public/scripts/viewboard.js'
	])
	.pipe(sourcemaps.init())
	.pipe(concat('viewboard.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./public/builds/js'));

	// build profile.js
	gulp.src([
		'./public/bower_components/vue/dist/vue.js',
		'./public/bower_components/jquery/dist/jquery.js',
		'./public/bower_components/bootstrap/dist/js/bootstrap.js',
		'./public/bower_components/moment/min/moment.min.js',
		'./public/models/board.js',
		'./public/scripts/profile.js'
	])
	.pipe(sourcemaps.init())
	.pipe(concat('profile.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./public/builds/js'));

	// build myboard.js
	gulp.src([
		'./public/bower_components/vue/dist/vue.js',
		'./public/bower_components/jquery/dist/jquery.js',
		'./public/bower_components/bootstrap/dist/js/bootstrap.js',
		'./public/models/board.js',
		'./public/scripts/myboard.js'

	])
	.pipe(sourcemaps.init())
	.pipe(concat('myboard.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./public/builds/js'));

	// build my-profile.js
	gulp.src([
		'./public/bower_components/vue/dist/vue.js',
		'./public/bower_components/jquery/dist/jquery.js',
		'./public/bower_components/bootstrap/dist/js/bootstrap.js',
		'./public/bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.js',
		'./public/bower_components/toastr/toastr.js',
		'./public/models/board.js',
		'./public/scripts/my-profile.js'
	])
	.pipe(sourcemaps.init())
	.pipe(concat('my-profile.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./public/builds/js'));

	// build index.js
	gulp.src([
		'./public/bower_components/jquery/dist/jquery.js',
		'./public/bower_components/bootstrap/dist/js/bootstrap.js',
		'./public/bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.js',
		'./public/bower_components/vue/dist/vue.js',
		'./public/bower_components/moment/moment.js',
		'./public/bower_components/rxjs/dist/rx.lite.js',
		'./public/bower_components/toastr/toastr.js',
		'./public/models/user.js',
		'./public/models/board.js',
		'./public/scripts/index.js'
	])
	.pipe(sourcemaps.init())
	.pipe(concat('index.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./public/builds/js'));

	// build board-by-tag.js
	gulp.src([
		'./public/bower_components/jquery/dist/jquery.js',
		'./public/bower_components/bootstrap/dist/js/bootstrap.js',
		'./public/bower_components/vue/dist/vue.js',
		'./public/bower_components/moment/moment.js',
		'./public/models/board.js',
		'./public/models/user.js',
		'./public/scripts/board-by-tag.js'
	])
	.pipe(sourcemaps.init())
	.pipe(concat('board-by-tag.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./public/builds/js'));
});

gulp.task('watch-development', function() {
	return gulp.watch([
		'./public/scripts/*.js',
		'./public/vue_components/*.js'
	], ['build-development'])
})

gulp.task('default', ['build-script-production', 'build-styles', 'copy-fonts']);
gulp.task('build-development', ['build-script-development', 'build-styles', 'copy-fonts']);
gulp.task('build-production', ['build-script-production', 'build-styles', 'copy-fonts']);