const express = require("express");
const multer = require("multer");
const path = require("path");
const ipfsClient = require("ipfs-http-client");

const app = express();
const upload = multer({ dest: "uploads/" });

// Configure IPFS client
const ipfs = ipfsClient.create({
  host: "localhost",
  port: 5001,
  protocol: "http",
});

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import utility functions from utils/ipfs.js
const { addFileToIPFS, pinFileToIPFS, getPinnedFiles, unpinFile } = require("./utils/ipfs");

// Route for handling file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    const cid = await addFileToIPFS(file.buffer);
    await pinFileToIPFS(cid);
    res.send(`File uploaded and pinned to IPFS with CID: ${cid}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading and pinning file");
  }
});

// Route for retrieving pinned files
app.get("/pinned-files", async (req, res) => {
  try {
    const cids = await getPinnedFiles();
    res.json(cids);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving pinned files");
  }
});

// Route for unpinning a file
app.delete("/unpin/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    await unpinFile(cid);
    res.send(`File with CID ${cid} unpinned from IPFS`);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error unpinning file with CID ${cid}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
