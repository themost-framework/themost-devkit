const {build} = require('../modules/build');
const path = require('path');
describe('Build', () => {
    it('should build source', async () => {
        await build(path.resolve(__dirname, './test/src'), path.resolve(__dirname, './test/dist'));
    });
});