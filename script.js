const videoUpload = document.getElementById("videoUpload");
const videoPlayer = document.getElementById("videoPlayer");
const cameraFeed = document.getElementById("cameraFeed");
const snapshotCanvas = document.getElementById("snapshotCanvas");
let mediaRecorder;
let recordedChunks = [];

videoUpload.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const videoURL = URL.createObjectURL(file);
    videoPlayer.src = videoURL;
  }
});

function deleteVideo() {
  videoPlayer.src = "";
  videoUpload.value = "";
}

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    cameraFeed.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      videoPlayer.src = URL.createObjectURL(blob);
      recordedChunks = [];
    };
  })
  .catch(err => console.error("Camera access error:", err));

function startRecording() {
  recordedChunks = [];
  mediaRecorder.start();
}

function stopRecording() {
  mediaRecorder.stop();
}

function takePicture() {
  const context = snapshotCanvas.getContext("2d");
  snapshotCanvas.width = cameraFeed.videoWidth;
  snapshotCanvas.height = cameraFeed.videoHeight;
  context.drawImage(cameraFeed, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
}
