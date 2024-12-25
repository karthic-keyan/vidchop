const express = require("express");
const cors = require("cors");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
require("dotenv").config();

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// MongoDB setup
const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri);
let db;

client.connect().then(() => {
  db = client.db("videoSplitter");
  console.log("Connected to MongoDB");
});

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// API endpoint to upload and split video
app.post("/split", upload.single("video"), async (req, res) => {
  const { timings } = req.body;
  const videoPath = req.file.path;
  const outputDir = "output/";
  const zip = new JSZip();

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  try {
    const promises = JSON.parse(timings).map((timing, index) => {
      const { start, end } = timing;
      console.log('timing', timing)
      const outputFileName = `output_${index + 1}.mp4`;
      const outputPath = path.join(outputDir, outputFileName);

      return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .setStartTime(start)
          .setDuration(end)
          .output(outputPath)
          .on("end", () => {
            const fileData = fs.readFileSync(outputPath);
            zip.file(outputFileName, fileData);
            resolve();
          })
          .on("error", (err) => reject(err))
          .run();
      });
    });

    await Promise.all(promises);

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const zipFilePath = path.join(outputDir, "split_videos.zip");

    fs.writeFileSync(zipFilePath, zipBuffer);

    res.download(zipFilePath, "split_videos.zip", () => {
      // Cleanup
      fs.unlinkSync(videoPath);
      fs.unlinkSync(zipFilePath);
      fs.rmSync(outputDir, { recursive: true, force: true });
    });
  } catch (error) {
    console.error("Error processing video:", error);
    res.status(500).send("An error occurred during video processing.");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
