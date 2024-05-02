const ipfsClient = require('ipfs-http-client');

// Configure IPFS client
const ipfs = ipfsClient.create({
  host: 'localhost', // Replace with the appropriate IPFS node IP/host
  port: 5001, // Replace with the appropriate IPFS node port
  protocol: 'http'
});

const addFileToIPFS = async (fileBuffer) => {
  try {
    const { cid } = await ipfs.add(fileBuffer);
    return cid.toString();
  } catch (error) {
    console.error('Error adding file to IPFS:', error);
    throw error;
  }
};

const pinFileToIPFS = async (cid) => {
  try {
    await ipfs.pin.add(cid);
  } catch (error) {
    console.error('Error pinning file to IPFS:', error);
    throw error;
  }
};

const getPinnedFiles = async () => {
  try {
    const pinnedFiles = await ipfs.pin.ls();
    return pinnedFiles.map(({ hash }) => hash.toString());
  } catch (error) {
    console.error('Error retrieving pinned files:', error);
    throw error;
  }
};

const unpinFile = async (cid) => {
  try {
    await ipfs.pin.rm(cid);
  } catch (error) {
    console.error('Error unpinning file from IPFS:', error);
    throw error;
  }
};

module.exports = {
  addFileToIPFS,
  pinFileToIPFS,
  getPinnedFiles,
  unpinFile,
  ipfs // Export the ipfs instance if needed elsewhere
};
