const {build} = require('../modules/build');
const path = require('path');
const fs = require('fs');
describe('Build', () => {
    it('should build source', async () => {
        const projectDir = path.resolve(__dirname, './test/');
        const outDir = path.resolve(projectDir, './dist');
        await build(projectDir);
        expect(fs.existsSync(path.resolve(outDir, 'index.js'))).toBeTrue();
        expect(fs.existsSync(path.resolve(outDir, 'lib/utils.js'))).toBeTrue();
        expect(fs.existsSync(path.resolve(outDir, 'config/app.json'))).toBeTrue();
        fs.rmdirSync(outDir, {
            recursive: true
        });
    });
    it('should build and use', async () => {
        const projectDir = path.resolve(__dirname, './test/');
        const outDir = path.resolve(projectDir, './dist');
        await build(projectDir);
        const multiply = require(outDir).multiply;
        expect(multiply).toBeInstanceOf(Function);
        expect(multiply(2,4)).toBe(8);
        fs.rmdirSync(outDir, {
            recursive: true
        });
    });
    it('should fail due to invalid projectDir', async () => {
        let projectDir = path.resolve(__dirname, './test1/');
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