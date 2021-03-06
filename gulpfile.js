const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const ghPages = require('gulp-gh-pages');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const gulpStylelint = require('gulp-stylelint');
const clean = require('gulp-clean');
const { series, parallel } = gulp;

function style () {
    return gulp.src('./scss/**/*.scss')
            .pipe(gulpStylelint({
                reporters: [
                    {
                    formatter: 'string', 
                    console: true
                    }
                ]
            }))
            .pipe(sass())
            .pipe(gulp.dest('build/css'))
            .pipe(browserSync.stream())
}

const html = () => {
    return gulp
      .src('*.html')
      .pipe(gulp.dest('build'))
  }

const images = () => {
  return gulp.src('imgs/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/imgs'))
}

// function lintCss () {
//     return gulp.src('./scss/**/*.scss')
//       .pipe(gulpStylelint({
//         reporters: [
//             {
//               formatter: 'string', 
//               console: true
//             }
//         ]
//       }));
// }

function watch () {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
    gulp.watch('./scss/**/*.scss', style);
    gulp.watch('./*.html').on('change', browserSync.reload);
}

const cleanBuild = () => {
    return gulp.src('build', {read: false})
    .pipe(clean())
  }

gulp.task('deploy', function() {
    return gulp.src('./build/**/*')
      .pipe(ghPages());
  });

exports.dev = series(
    cleanBuild,
    parallel(html, style, images)
);
exports.style = style;
exports.watch = watch;
// exports.lintCss = lintCss;