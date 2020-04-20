
const getTask = require('./build').getTask;
const fs = require('fs');
const path = require('path');

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

    // try to get .themost-cli.json
    let cliConfiguration = getCliConfiguration(projectDir);
    // validate base and out directories
    if (cliConfiguration.base === cliConfiguration.out) {
        throw new Error('sourceDir and outDir cannot be the same');
    }
    // set project root
    cliConfiguration.cwd = path.resolve(process.cwd(), projectDir);
    // get build task
    const runTask = getTask(cliConfiguration);
    // run task
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