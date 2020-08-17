const {build} = require('../modules/build-typescript');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
describe('Build Typescript', () => {
    it('should build source', async () => {
        const projectDir = path.resolve(__dirname, './test-typescript/');
        await build(projectDir);
        const outDir = path.resolve(projectDir, './dist');
        expect(fs.existsSync(path.resolve(outDir, 'index.js'))).toBeTrue();
        expect(fs.existsSync(path.resolve(outDir, 'index.js.map'))).toBeTrue();
        expect(fs.existsSync(path.resolve(outDir, 'lib/utils.js'))).toBeTrue();
        expect(fs.existsSync(path.resolve(outDir, 'config/app.json'))).toBeTrue();
        rimraf.sync(outDir);
    });
    it('should build and use', async () => {
        const projectDir = path.resolve(__dirname, './test-typescript/');
        await build(projectDir);
        const outDir = path.resolve(projectDir, './dist');
        const multiply = require(outDir).multiply;
        expect(multiply).toBeInstanceOf(Function);
        expect(multiply(2,4)).toBe(8);
        rimraf.sync(outDir);
    });
    it('should fail due to invalid projectDir', async () => {
        let projectDir = path.resolve(__dirname, './test-typescript1/');
        await expectAsync((async function () {
            return await build(projectDir)
        })()).toBeRejected();
        projectDir = null;
        await expectAsync((async function () {
            return await build(projectDir)
        })()).toBeRejectedWithError('projectDir cannot be null');
        projectDir = { };
        await expectAsync((async function () {
            return await build(projectDir)
        })()).toBeRejectedWithError('projectDir must be a string');
    });
});