const File = artifacts.require("File");

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('File', (accounts) => {
    let file;

    before(async () => {
        file = await File.deployed();
    });

    describe('deployment', async () => {

        it('deploys successfully', async () => {
            const address = file.address;
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
            assert.notEqual(address, 0x0);
        });
    });

    describe('storage', async () => {
        it('updates the fileHash', async () => {
            let fileHash;
            fileHash = 'abc123';
            await file.set(fileHash);
            const result = await file.get();
            assert.equal(result, fileHash);
        });
    });
});