var gulp = require('gulp');
var eslint = require('gulp-eslint');

var JS = [
];

gulp.task('eslint', function () {
  return gulp.src(JS)
    .pipe(eslint())
    .pipe(eslint.format());
});
