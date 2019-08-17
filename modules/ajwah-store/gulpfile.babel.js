
const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('build:esm', () => {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            babelrc: false,
            presets: [
                ['@babel/preset-env', { modules: false }]
            ],
            plugins: [
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-async-to-generator'
            ]
        }))
        .pipe(gulp.dest('lib/esm'));
});
