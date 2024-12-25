---

# **VidChop - Video Splitter API**

VidChop is a video processing application that allows users to upload large video files, split them into smaller segments by specified or default intervals (e.g., 1-minute segments), and download the processed videos as a ZIP file. It uses a React-based frontend and a Node.js backend with FFmpeg for video processing.

---

## **Features**

- Upload video files via the frontend.
- Automatically split videos into 1-minute segments by default.
- Specify custom start and end timings for splitting.
- Download split videos as a single ZIP file.
- Backend powered by Node.js and MongoDB Atlas.
- Uses FFmpeg for efficient video processing.

---

## **Tech Stack**

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Video Processing**: FFmpeg with `fluent-ffmpeg`

---

## **Prerequisites**

Before running the app, ensure you have the following installed on your system:

- Node.js (v16 or above)
- MongoDB Atlas account
- FFmpeg installed and available in your system PATH

---

## **Installation**

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/vidchop.git
cd vidchop
```

### **2. Install Dependencies**

#### **Backend**
```bash
cd backend
npm install
```

#### **Frontend**
```bash
cd ../frontend
npm install
```

---

## **Setup**

### **1. FFmpeg Configuration**
Make sure FFmpeg and ffprobe are installed on your system:

- Download FFmpeg from the [official website](https://ffmpeg.org/download.html).
- Add FFmpeg's `bin` directory to your system PATH.
- Verify installation by running:
  ```bash
  ffmpeg -version
  ffprobe -version
  ```

Alternatively, the project uses `ffmpeg-static` and `@ffprobe-installer/ffprobe` to ensure compatibility.

---

### **2. MongoDB Atlas Configuration**
1. Create a MongoDB Atlas account and cluster.
2. Get the connection string from your cluster.
3. Create a `.env` file in the `backend` folder and add the following:
   ```bash
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

---

### **3. Start the Application**

#### **Backend**
Navigate to the `backend` folder and start the server:
```bash
npm run dev
```
The backend runs on `http://localhost:5000`.

#### **Frontend**
Navigate to the `frontend` folder and start the React app:
```bash
npm start
```
The frontend runs on `http://localhost:3000`.

---

## **Usage**

1. Upload a video file in the frontend.
2. By default, the video is split into 1-minute segments. You can also specify custom timings.
3. Download the processed videos as a ZIP file.

---

## **API Documentation**

### **POST /split**
- **Description**: Uploads a video and splits it based on specified or default timings.
- **Endpoint**: `http://localhost:5000/split`
- **Request**:
  - **Form Data**:
    - `video` (required): The video file to upload.
    - `timings` (optional): An array of objects specifying custom start and end times, e.g.:
      ```json
      [
        { "start": "00:00:00", "end": "00:01:00" },
        { "start": "00:01:00", "end": "00:02:30" }
      ]
      ```
- **Response**: A ZIP file containing the split videos.

---

## **Development**

### **With Nodemon**
The backend uses `nodemon` for hot-reloading during development. To start the backend with `nodemon`:
```bash
npm run dev
```

---

## **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---

## **License**

This project is licensed under the MIT License.

---

## **Acknowledgments**

- [FFmpeg](https://ffmpeg.org/)
- [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)

---
