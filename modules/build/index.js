
const path = require('path');
const dir = require('@babel/cli/lib/babel/dir').default;
const options = require('@babel/cli/lib/babel/options').default;
const fs = require('fs');

/**
 * Gets cli configuration
 * @param {string} projectDir
 */
function getCliConfiguration(projectDir) {
    // try to get .themost-cli.json
    let cliConfiguration;
    try {
         cliConfiguration = require(path.resolve(projectDir, './.themost-cli.json'));
    }
    catch(err) {
        // if cli configuration cannot be found 
        if (err.code === 'ENOENT') {
            try {
                // try to get themost-cli.json
                cliConfiguration = require(path.resolve(projectDir, './themost-cli.json'));
            }
            catch (err) {
                 if (err.code === 'ENOENT') {
                     // set defaults
                    cliConfiguration = {
                        base: './src',
                        out: './dist'
                    }
                 }
                 else {
                     // throw any other error while trying to load themost-cli.json
                     throw err
                 }
            }
        }
        else {
            // throw any other error while trying to load .themost-cli.json
            throw err
        }
    }
    return cliConfiguration;
}
/**
 * Build @themost/cli application by using @babel/cli
 * @param {string} projectDir 
 */
function build(projectDir) {
    // validate sourceDir
    if (projectDir == null) {
        throw new Error('projectDir cannot be null');
    }
    if (typeof projectDir !== 'string') {
        throw new Error('projectDir must be a string');
    }
    // check if sourceDir exists
    fs.statSync(projectDir);
    // get absolute path of project directory
    const finalProjectDir = path.resolve(process.cwd(), projectDir);
    // get configuration
    const cliConfiguration = getCliConfiguration(finalProjectDir);
    // get final sourceDir and outDir
    const finalSourceDir = path.resolve(finalProjectDir, cliConfiguration.base);
    const finalOutDir = path.resolve(finalProjectDir, cliConfiguration.out);
    if (finalSourceDir === finalOutDir) {
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
        '--source-maps',
        '--quiet'
    ]);
    // build
    return dir(opts);
}

module.exports = {
    build
};