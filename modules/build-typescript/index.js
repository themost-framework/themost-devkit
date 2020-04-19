
const getBuildTask = require('./gulpfile').getBuildTask;
const fs = require('fs');
const path = require('path');
const tsConfig = require('./tsconfig.json');
/**
 * Build @themost/cli application by using @babel/cli
 * @param {string} sourceDir 
 */
function build(sourceDir) {
    // validate sourceDir
    if (sourceDir == null) {
        throw new Error('sourceDir cannot be null');
    }
    if (typeof sourceDir !== 'string') {
        throw new Error('sourceDir must be a string');
    }
    // check if sourceDir exists
    fs.statSync(sourceDir);

    // try to get .themost-cli.json
    let cliConfiguration;
    try {
         cliConfiguration = require(path.resolve(sourceDir, './.themost-cli.json'));
    }
    catch(err) {
        // if cli configuration cannot be found 
        if (err.code === 'ENOENT') {
            try {
                // try to get themost-cli.json
                cliConfiguration = require(path.resolve(sourceDir, './themost-cli.json'));
            }
            catch (err) {
                 if (err.code === 'ENOENT') {
                     // set defaults
                     cliConfiguration = {
                        base: path.resolve(sourceDir, './src'),
                        out: path.resolve(sourceDir, './dist')
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
    if (cliConfiguration.base === cliConfiguration.out) {
        throw new Error('sourceDir and outDir cannot be the same');
    }
    // get build task
    const runTask = getBuildTask(cliConfiguration);
    
    return new Promise((resolve, reject) => {
        return runTask( err => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
    
}

module.exports = {
    build
};