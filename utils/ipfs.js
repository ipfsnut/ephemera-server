const axios = require('axios');

const ipfsApiUrl = 'http://165.22.184.42:5001/api/v0';

const addFileToIPFS = async (fileBuffer) => {
  try {
    const formData = new FormData();
    formData.append('file', fileBuffer);

    const response = await axios.post(`${ipfsApiUrl}/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const cid = response.data.Hash;
    return cid;
  } catch (error) {
    console.error('Error adding file to IPFS:', error);
    throw error;
  }
};

const pinFileToIPFS = async (cid) => {
  try {
    await axios.post(`${ipfsApiUrl}/pin/add?arg=${cid}`);
  } catch (error) {
    console.error('Error pinning file to IPFS:', error);
    throw error;
  }
};

const getPinnedFiles = async () => {
  try {
    const response = await axios.post(`${ipfsApiUrl}/pin/ls`);
    const pinnedFiles = response.data.Keys;
    return pinnedFiles;
  } catch (error) {
    console.error('Error retrieving pinned files:', error);
    throw error;
  }
};

const unpinFile = async (cid) => {
  try {
    await axios.post(`${ipfsApiUrl}/pin/rm?arg=${cid}`);
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
};
