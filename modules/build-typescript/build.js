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
function getTask(cliConfiguration) {

    const tsConfigFile = path.resolve(cliConfiguration.cwd, './tsconfig.json');
    // get ts project
    const tsProject = ts.createProject(tsConfigFile);
    // set project directory
    // tsProject.projectDirectory = cliConfiguration.cwd;
    // validate out directory 
    if (path.isAbsolute(cliConfiguration.out)) {
        throw 'Output directory cannot be an absolute path.';
    }
    // resolve outDir
    const outDir = path.resolve(cliConfiguration.cwd, cliConfiguration.out);
    // resolve sourceDir
    const sourceDir = path.resolve(cliConfiguration.cwd, cliConfiguration.base);
    // validate that output path is under process.cwd()
    if (path.relative(cliConfiguration.cwd, outDir).startsWith('..')) {
        throw 'Output directory must be under to process cwd.';
    }
    
    // clean build directory
    // read more at https://github.com/peter-vilja/gulp-clean
    gulp.task('clean', function () {
        // validate that output path is not absolute
        return gulp.src(outDir, { 
                read: true, 
                allowEmpty: true
            }).pipe(clean());
    });
    // copy project files
    // read more at https://github.com/gulpjs/gulp
    gulp.task('copy-files', function () {
        return gulp.src([
            path.join(sourceDir,'**/*'),
            '!' + path.join(sourceDir,'**/*.ts')
        ]).pipe(gulp.dest(outDir));
    });
    // build typescript
    // read more at https://github.com/ivogabe/gulp-typescript
    gulp.task('build-typescript', function () {
        return tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(outDir));
    });

    return gulp.series('clean', 'copy-files', 'build-typescript');
}


module.exports = {
    getTask: getTask
};