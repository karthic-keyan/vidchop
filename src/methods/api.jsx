import { useState } from "react";

const API = () => {
  const [video, setVideo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVideoUpload = (event) => {
    setVideo(event.target.files[0]);
  };

  const splitVideo = async (timings) => {
    if (!video) {
      alert("Please upload a video first.");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    formData.append("timings", JSON.stringify(timings));

    try {
      setIsProcessing(true);

      const response = await fetch("http://localhost:5000/split", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const zipURL = URL.createObjectURL(blob);

        // Create a link to download the ZIP file
        const link = document.createElement("a");
        link.href = zipURL;
        link.download = "split_videos.zip";
        link.click();

        // Clean up the URL
        URL.revokeObjectURL(zipURL);
      } else {
        alert("Failed to process video. Please try again.");
      }
    } catch (error) {
      console.error("Error splitting video:", error);
      alert("An error occurred while processing the video.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h1>Video Splitter</h1>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      <button
        onClick={() =>
          splitVideo([
            { start: "00:00:00", end: "00:01:00" },
            { start: "00:01:00", end: "00:02:00" },
          ])
        }
        disabled={!video || isProcessing}
      >
        {isProcessing ? "Processing..." : "Split Video"}
      </button>
    </div>
  );
};

export default API;
