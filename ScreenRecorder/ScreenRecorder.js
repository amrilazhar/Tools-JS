/* Sample Code from https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture
 Wtih some edit and add recorder function
*/
const videoElem = document.getElementById("video");
const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");
// const startRecElem = document.getElementById("startRec");
// const stopRecElem = document.getElementById("stopRec");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const downloadBtn = document.getElementById("downloadBtn");

let tracks;
//Recorder buat ngerekam
let recorder;
let chunks = [];

// Options for getDisplayMedia()
var displayMediaOptions = {
  video: {
    cursor: "always",
  },
  audio: false,
};

// Set event listeners for the start and stop buttons
startElem.addEventListener(
  "click",
  function (evt) {
    startCapture();
    startBtn.classList.add("hide");
    stopBtn.classList.remove("hide");
    downloadBtn.classList.add("hide");
  },
  false
);

stopElem.addEventListener(
  "click",
  function (evt) {
    stopCapture();
    startBtn.classList.remove("hide");
    stopBtn.classList.add("hide");
    downloadBtn.classList.remove("hide");
  },
  false
);

console.log = (msg) => (logElem.innerHTML += `${msg}<br>`);
console.error = (msg) =>
  (logElem.innerHTML += `<span class="error">${msg}</span><br>`);
console.warn = (msg) =>
  (logElem.innerHTML += `<span class="warn">${msg}<span><br>`);
console.info = (msg) =>
  (logElem.innerHTML += `<span class="info">${msg}</span><br>`);

// Share Screen //
async function startCapture() {
  logElem.innerHTML = "";

  try {
    videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );
    recorder = new MediaRecorder(videoElem.srcObject);
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.start();

    //initiate tracks
    tracks = videoElem.srcObject.getTracks()
    let vidTracks = videoElem.srcObject.getVideoTracks();
    //add listener if someone click stopsharing
    vidTracks.forEach((track) => {
      track.onended = () => {
        stopCapture();
        startBtn.classList.remove("hide");
        stopBtn.classList.add("hide");
        downloadBtn.classList.remove("hide");
      }
    });

    dumpOptionsInfo();
    console.log('<span class="info"> Start Recording </span>');
  } catch (err) {
    console.error("Error: " + err);
  }
}

function stopCapture(evt) {
  let fileName;
  recorder.stop();
  /// Convert to Object and save
  recorder.onstop = (e) => {
    const completeBlob = new Blob(chunks, { type: "video/webm" });
    const dateNow = new Date();

    let DLink = document.getElementById("recorded");
    DLink.href = URL.createObjectURL(completeBlob);
    DLink.download = `scRecord-${dateNow.getDate()}-${dateNow.getMonth()}-${dateNow.getFullYear()}-${dateNow.getMilliseconds()}`;
    DLink.innerHTML = "Click here to download the video";
    fileName = `scRecord-${dateNow.getDate()}-${dateNow.getMonth()}-${dateNow.getFullYear()}-${dateNow.getMilliseconds()}`;
    //empty the chunks to use again
    chunks = [];
  };

  console.log('<span class="info"> STOP Recording </span>');

  tracks.forEach((track) => track.stop());
  videoElem.srcObject = null;
  console.log('<span class="info"> STOP Capturing </span>');
}

function dumpOptionsInfo() {
  const videoTrack = videoElem.srcObject.getVideoTracks()[0];

  console.info("Track settings:");
  console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
  console.info("Track constraints:");
  console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}
