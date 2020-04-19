/* eslint-disable */
const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const path = require('path');
/**
 * Get build task
 * @param {*} cliConfiguration 
 * @param {*} typescriptConfiguration 
 * @returns Function
 */
function getBuildTask(cliConfiguration) {

    const defaultConfig = path.resolve(cliConfiguration.base, './tsconfig.json');
    // get ts project
    const tsProject = ts.createProject(defaultConfig);
    tsProject.projectDirectory = cliConfiguration.base;
    // clean build directory
    // read more at https://github.com/peter-vilja/gulp-clean
    gulp.task('clean', function () {
        // validate that output path is not absolute
        // if (path.isAbsolute(cliConfiguration.out)) {
        //     throw 'Output directory cannot be an absolute path.';
        // }
        // validate that output path is under process.cwd()
        // if (path.relative(process.cwd(), cliConfiguration.out).startsWith('..')) {
        //     throw 'Output directory must be under to process cwd.';
        // }
        return gulp.src(cliConfiguration.out, { 
                read: true, 
                allowEmpty: true
            }).pipe(clean());
    });
    // copy project files
    // read more at https://github.com/gulpjs/gulp
    gulp.task('copy-files', function () {
        return gulp.src([
            path.join(cliConfiguration.base,'**/*'),
            '!' + path.join(cliConfiguration.base,'**/*.ts')
        ]).pipe(gulp.dest(cliConfiguration.out));
    });
    // build typescript
    // read more at https://github.com/ivogabe/gulp-typescript
    gulp.task('build-typescript', function () {
        return tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(cliConfiguration.out));
    });

    return gulp.series('clean', 'copy-files', 'build-typescript');
}


module.exports = {
    getBuildTask
};