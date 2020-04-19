const {build} = require('../modules/build');
const path = require('path');
const fs = require('fs');
describe('Build', () => {
    it('should build source', async () => {
        const sourceDir = path.resolve(__dirname, './test/src');
        const outDir = path.resolve(__dirname, './test/dist');
        await build(sourceDir, outDir);
        expect(fs.existsSync(path.resolve(outDir, 'index.js'))).toBeTrue();
        expect(fs.existsSync(path.resolve(outDir, 'lib/utils.js'))).toBeTrue();
        expect(fs.existsSync(path.resolve(outDir, 'config/app.json'))).toBeTrue();
        fs.rmdirSync(outDir, {
            recursive: true
        });
    });
    it('should build and use', async () => {
        const sourceDir = path.resolve(__dirname, './test/src');
        const outDir = path.resolve(__dirname, './test/dist');
        await build(sourceDir, outDir);
        const multiply = require(outDir).multiply;
        expect(multiply).toBeInstanceOf(Function);
        expect(multiply(2,4)).toBe(8);
        fs.rmdirSync(outDir, {
            recursive: true
        });
    });
    it('should fail due to invalid sourceDir', async () => {
        let sourceDir = path.resolve(__dirname, './test/src1');
        let outDir = path.resolve(__dirname, './test/dist');
        await expectAsync((async function () {
            return await build(sourceDir, outDir)
        })()).toBeRejected();
        sourceDir = null;
        await expectAsync((async function () {
            return await build(sourceDir, outDir)
        })()).toBeRejectedWithError('sourceDir cannot be null');
        sourceDir = { };
        await expectAsync((async function () {
            return await build(sourceDir, outDir)
        })()).toBeRejectedWithError('sourceDir must be a string');
        sourceDir = path.resolve(__dirname, './test/src');
        outDir = { };
        await expectAsync((async function () {
            return await build(sourceDir, outDir)
        })()).toBeRejectedWithError('outDir must be a string');
        outDir = sourceDir;
        await expectAsync((async function () {
            return await build(sourceDir, outDir)
        })()).toBeRejectedWithError('sourceDir and outDir cannot be the same');

    });
});