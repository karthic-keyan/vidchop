import express from "express";
import cors from "cors";
import multer from "multer";
import ffmpeg, { setFfmpegPath } from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import JSZip from "jszip";
import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync, rmSync } from "fs";
import { join } from "path";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

setFfmpegPath(ffmpegPath);

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

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
  }

  try {
    const promises = JSON.parse(timings).map((timing, index) => {
      const { start, end } = timing;
      console.log('timing', timing)
      const outputFileName = `output_${index + 1}.mp4`;
      const outputPath = join(outputDir, outputFileName);

      return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .setStartTime(start)
          .setDuration(end)
          .output(outputPath)
          .on("end", () => {
            const fileData = readFileSync(outputPath);
            zip.file(outputFileName, fileData);
            resolve();
          })
          .on("error", (err) => reject(err))
          .run();
      });
    });

    await Promise.all(promises);

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const zipFilePath = join(outputDir, "split_videos.zip");

    writeFileSync(zipFilePath, zipBuffer);

    res.download(zipFilePath, "split_videos.zip", () => {
      // Cleanup
      unlinkSync(videoPath);
      unlinkSync(zipFilePath);
      rmSync(outputDir, { recursive: true, force: true });
    });
  } catch (error) {
    console.error("Error processing video:", error);
    res.status(500).send("An error occurred during video processing.");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
