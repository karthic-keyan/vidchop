import  { useState } from "react";
import { FFmpeg  } from "@ffmpeg/ffmpeg";
import { fetchFile } from '@ffmpeg/util'
import JSZip from "jszip";

const Local = () => {
  const ffmpeg = new FFmpeg()
  const [video, setVideo] = useState(null);
  const [outputVideos, setOutputVideos] = useState([]);

  const loadFFmpeg = async () => {
    if (ffmpeg.loaded) {
      await ffmpeg.load();
    }
  };

  const handleVideoUpload = (event) => {
    setVideo(event.target.files[0]);
  };

  const splitVideo = async (timings) => {
    await loadFFmpeg();
    
    const videoFileName = "711291046558.mp4";
    const file = await fetchFile(video);
    await ffmpeg.writeFile(videoFileName, file);
    
    const outputs = [];

    for (let i = 0; i < timings.length; i++) {
      // const { start, end } = timings[i];
      await loadFFmpeg();
      const outputFileName = `output_${i + 1}.mp4`;

      await ffmpeg.exec([
        "-i",
        videoFileName,
        // "-ss",
        // start,
        // "-to",
        // end,
        // "-c",
        // "copy",
        outputFileName
      ]
      );
      console.log('loadFFmpeg')

      const data = ffmpeg.readFile(outputFileName);
      const blob = new Blob([data.buffer], { type: "video/mp4" });
      outputs.push({ fileName: outputFileName, blob });
    }

    setOutputVideos(outputs);
  };

  const downloadAsZip = async () => {
    const zip = new JSZip();

    // Add each video segment to the ZIP
    outputVideos.forEach(({ fileName, blob }) => {
      zip.file(fileName, blob);
    });

    // Generate the ZIP file and create a download link
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const zipURL = URL.createObjectURL(zipBlob);

    const link = document.createElement("a");
    link.href = zipURL;
    link.download = "split_videos.zip";
    link.click();

    // Cleanup
    URL.revokeObjectURL(zipURL);
  };

  return (
    <div>
      <h1>Video Splitter with ZIP Download</h1>
      <input type="file" onChange={handleVideoUpload} />
      <button
        onClick={() =>
          splitVideo([
            { start: "00:00:00", end: "00:01:00" },
            { start: "00:01:00", end: "00:02:00" },
          ])
        }
      >
        Split Video
      </button>
      <button onClick={downloadAsZip} disabled={!outputVideos.length}>
        Download as ZIP
      </button>

      {outputVideos.map(({ fileName, blob }, index) => (
        <div key={index}>
          <h3>{fileName}</h3>
          <video controls src={URL.createObjectURL(blob)}></video>
        </div>
      ))}
    </div>
  );
};

export default Local;
