/*import gulp from 'gulp';
import babel from 'gulp-babel';
require("@babel/register")({
    // This will override `node_modules` ignoring - you can alternatively pass
    // an array of strings to be explicitly matched or a regex / glob
    ignore: [],
});*/
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
