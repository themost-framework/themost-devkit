
const path = require('path');
const dir = require('@babel/cli/lib/babel/dir').default;
const options = require('@babel/cli/lib/babel/options').default;
const fs = require('fs');
/**
 * Build @themost/cli application by using @babel/cli
 * @param {string} sourceDir 
 * @param {string} outDir 
 */
function build(sourceDir, outDir) {
    // validate sourceDir
    if (sourceDir == null) {
        throw new Error('sourceDir cannot be null');
    }
    if (typeof sourceDir !== 'string') {
        throw new Error('sourceDir must be a string');
    }
    // check if sourceDir exists
    fs.statSync(sourceDir);
    // validate outDir
    outDir = outDir || path.resolve(process.cwd(), 'dist');
    if (typeof outDir !== 'string') {
        throw new Error('outDir must be a string');
    }
    const finalSourceDir = path.resolve(process.cwd(), sourceDir);
    const finalOutDir = path.resolve(process.cwd(), outDir);
    if (finalSourceDir === outDir) {
        throw new Error('sourceDir and outDir cannot be the same');
    }
    // get options
    const opts = options([
        '',
        '',
        finalSourceDir,
        '--config-file',
        path.resolve(__dirname, './babel.config.js'),
        '--out-dir',
        finalOutDir,
        '--copy-files',
        '--source-maps'
    ]);
    // build
    return dir(opts);
}

module.exports = {
    build
};