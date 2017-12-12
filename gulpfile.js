var gulp = require('gulp');
var eslint = require('gulp-eslint');

var JS = [
  'app.js',
  'routes/routes.js',
  'db/databases.js',
  'db/keyvaluestore.js'
];

gulp.task('eslint', function () {
  return gulp.src(JS)
    .pipe(eslint())
    .pipe(eslint.format());
});
