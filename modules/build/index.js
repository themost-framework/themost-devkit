
const path = require('path');
const dir = require('@babel/cli/lib/babel/dir').default;
const options = require('@babel/cli/lib/babel/options').default;
/**
 * *} sourceDir 
 * @param {*} outDir 
 */
function build(sourceDir, outDir) {
    
    const finalSourceDir = path.resolve(process.cwd(), sourceDir);
    const finalOutDir = path.resolve(process.cwd(), outDir);
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