const create = require('ipfs-http-client');
const ipfs = create('http://127.0.0.1:5001');

const addFileToIPFS = async (fileBuffer) => {
  const fileAdded = await ipfs.add(fileBuffer);
  const cid = fileAdded.cid.toString();
  return cid;
};

const pinFileToIPFS = async (cid) => {
  await ipfs.pin.add(cid);
};

const getPinnedFiles = async () => {
  const pinnedFiles = await ipfs.pin.ls();
  return pinnedFiles.map((file) => file.cid.toString());
};

const unpinFile = async (cid) => {
  await ipfs.pin.rm(cid);
};

module.exports = {
  addFileToIPFS,
  pinFileToIPFS,
  getPinnedFiles,
  unpinFile,
  ipfs,
};
