const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Import utility functions from utils/ipfs.js
const { addFileToIPFS, pinFileToIPFS, getPinnedFiles, unpinFile } = require('./utils/ipfs');

// IPFS routes
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded');
    }

    const cid = await addFileToIPFS(file.buffer);
    await pinFileToIPFS(cid);
    res.send(`File uploaded and pinned to IPFS with CID: ${cid}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading and pinning file');
  }
});

router.get('/pinned-files', async (req, res) => {
  try {
    const cids = await getPinnedFiles();
    res.json(cids);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving pinned files');
  }
});

router.delete('/unpin/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    await unpinFile(cid);
    res.send(`File with CID ${cid} unpinned from IPFS`);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error unpinning file with CID ${cid}`);
  }
});

module.exports = router;
