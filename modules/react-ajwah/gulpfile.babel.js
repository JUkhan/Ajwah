
const gulp = require('gulp');
const babel = require('gulp-babel');


gulp.task('build:esm', () => {
    gulp.src('src/**/*.js')
        .pipe(babel({
            babelrc: false,
            presets: [
                ['@babel/preset-env', { modules: false }]
            ],
            plugins: [
                '@babel/plugin-proposal-object-rest-spread'

            ]
        }))
        .pipe(gulp.dest('lib/esm'));
});
