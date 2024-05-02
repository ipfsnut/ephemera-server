require = require('exports');
const express = require('express');
const path = require('path');
const ipfsClient = require('ipfs-http-client');

const app = express();

// Configure IPFS client
const ipfs = ipfsClient.create({
  host: 'localhost', // Replace with the appropriate IPFS node IP/host
  port: 5001, // Replace with the appropriate IPFS node port
  protocol: 'http'
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import IPFS routes
const ipfsRoutes = require('./routes/routes');

// Mount IPFS routes
app.use('/ipfs', ipfsRoutes);

// Pass the ipfs instance to the utils/ipfs.js module (if needed)
const { addFileToIPFS, pinFileToIPFS, getPinnedFiles, unpinFile } = require('./utils/ipfs');
module.exports = { ipfs, addFileToIPFS, pinFileToIPFS, getPinnedFiles, unpinFile };

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
